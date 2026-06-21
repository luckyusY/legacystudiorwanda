/**
 * Seed the initial admin account.
 * Usage: npm run seed
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD / MONGODB_URI from .env.local
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";

// Lightweight .env.local loader (dotenv only reads .env by default)
try {
  const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of envFile.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // ignore — env may be provided some other way
}

const { MONGODB_URI, MONGODB_DB, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB || "legacystudio" });

  const email = (ADMIN_EMAIL || "admin@mylegacystudio.com").toLowerCase();
  const password = ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await Admin.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = existing.name || "Administrator";
    await existing.save();
    console.log(`✓ Updated existing admin: ${email}`);
  } else {
    await Admin.create({ name: "Administrator", email, passwordHash });
    console.log(`✓ Created admin: ${email}`);
  }

  console.log(`  Password: ${password}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
