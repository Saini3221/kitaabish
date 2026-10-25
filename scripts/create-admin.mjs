// Create or reset an admin account. Run it yourself so the password never leaves your terminal:
//   npm run admin:create
// The password is stored only as a scrypt hash (same format lib/auth.ts verifies).
import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "kitaabish";
if (!uri || uri.includes("<db_username>")) {
  console.error("Set MONGODB_URI in .env.local first.");
  process.exit(1);
}

// Prompt that hides what you type (falls back to visible input if the terminal can't hide it).
function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(s);
        else rl.output.write("*".repeat(s.length ? 1 : 0));
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const email = (await ask("Admin email: ")).trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("That doesn't look like an email address.");
  process.exit(1);
}
const password = await ask("Password (min 12 characters): ", true);
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}
const confirm = await ask("Confirm password: ", true);
if (password !== confirm) {
  console.error("Passwords don't match.");
  process.exit(1);
}

const N = 16384, r = 8, p = 1;
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
const passwordHash = `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${hash.toString("base64")}`;

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  await db.collection("admins").createIndex({ email: 1 }, { unique: true });
  const res = await db
    .collection("admins")
    .updateOne({ email }, { $set: { email, passwordHash, updatedAt: new Date() } }, { upsert: true });
  // Changing a password signs that admin out everywhere.
  await db.collection("admin_sessions").deleteMany({ email });
  console.log(res.upsertedCount ? `Admin ${email} created.` : `Password for ${email} updated (all sessions signed out).`);
} catch (err) {
  console.error("Failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}
