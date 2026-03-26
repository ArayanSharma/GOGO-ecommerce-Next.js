import mysql from "mysql2/promise";

// Create pool
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "gogo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

  try {
    const connection = await db.getConnection();
    console.log("✅ Connected to database successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
