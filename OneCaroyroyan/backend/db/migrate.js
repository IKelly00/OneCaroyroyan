/**
 * db/migrate.js
 * Runs schema.sql against MySQL using the credentials in .env.
 * Usage: npm run db:migrate
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function migrate() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  // Connect WITHOUT a default database first, since schema.sql creates it.
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  try {
    console.log("Running schema.sql ...");
    await connection.query(sql);
    console.log("✔ Database and tables created successfully.");
  } catch (err) {
    console.error("✘ Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

migrate();
