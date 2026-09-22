#!/usr/bin/env node

/**
 * Password Hash Generator for GDCMS
 *
 * Usage:
 * node database/generateHash.js <password> [rounds]
 *
 * Examples:
 * node database/generateHash.js admin123
 * node database/generateHash.js dokter123 10
 */

const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = process.argv[2];
  const rounds = parseInt(process.argv[3]) || 10;

  if (!password) {
    console.error("Error: Password is required");
    console.log("\nUsage: node generateHash.js <password> [rounds]");
    console.log("Example: node generateHash.js admin123 10");
    process.exit(1);
  }

  try {
    console.log("\n================================================");
    console.log("GDCMS Password Hash Generator");
    console.log("================================================\n");
    console.log(`Password: ${password}`);
    console.log(`Rounds: ${rounds}`);
    console.log("\nGenerating hash...\n");

    const hash = await bcrypt.hash(password, rounds);

    console.log(`Hash (bcrypt $2b format):`);
    console.log(`${hash}\n`);

    // Verify the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log(`Verification: ${isValid ? "✓ Valid" : "✗ Invalid"}\n`);

    // SQL Query
    console.log("SQL Query Template:");
    console.log(
      `UPDATE users SET password = '${hash}' WHERE email = 'user@example.com';\n`,
    );

    console.log("================================================\n");
  } catch (error) {
    console.error("Error generating hash:", error.message);
    process.exit(1);
  }
}

generateHash();
