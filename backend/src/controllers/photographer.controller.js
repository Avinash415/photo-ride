import fs from "fs";
console.log(
  "📄 CONTROLLER FILE CONTENT:\n",
  fs.readFileSync(new URL(import.meta.url), "utf8")
);
