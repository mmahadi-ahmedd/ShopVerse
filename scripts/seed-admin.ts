import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { createUser } from "../src/lib/db/users";

(async () => {
  await createUser({
    id: nanoid(12), name: "Admin", email: "admin@shopverse.com", role: "admin",
    passwordHash: await bcrypt.hash("Admin@12345", 10), createdAt: new Date().toISOString(),
  });
  console.log("Admin created: admin@shopverse.com / Admin@12345");
})();