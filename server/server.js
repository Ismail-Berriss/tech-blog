import express from "express";
import env from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Load environment variables from .env file
env.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(cors());
app.use(bodyParser.json());

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.sendStatus(401); // Unauthorized
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user;
      next();
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.sendStatus(403);
  }

  next();
};

const userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.sendStatus(403);
  }

  next();
};

app.post("/api/signup", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const userCheck = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" }); // Bad Request
    }

    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
      if (err) {
        console.log("Error hashing password: ", err);
      } else {
        const newUser = await db.query(
          "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
          [username, hashedPassword, role || "user"]
        );

        const token = generateToken(newUser.rows[0]);

        res.status(201).json({ token, role: newUser.rows[0].role }); // Created
      }
    });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" }); // Bad Request
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" }); // Bad Request
    }

    const token = generateToken(user.rows[0]);

    res.json({ token, role: user.rows[0].role });
  } catch (error) {
    console.error("Error logging in user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/admin", authenticateJWT, adminMiddleware, (req, res) => {
  res.json("Hello Admin");
});

app.get("/api/user", authenticateJWT, userMiddleware, (req, res) => {
  res.json("Hello User");
});

app.listen(port, () => {
  console.log(`Server port is running on ${port}`);
});
