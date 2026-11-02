import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createUser, getUserByEmail } from "@/lib/db/users";
import { AppError } from "@/utils/errors";
import type { User } from "@/types";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
  role: z.enum(["user", "seller"]).default("user"),
});
const loginSchema = registerSchema.pick({ email: true, password: true });

export const publicUser = ({ id, name, email, role, createdAt }: User) => ({ id, name, email, role, createdAt });

export async function register(input: unknown) {
  const d = registerSchema.parse(input);
  const user: User = {
    id: nanoid(12), name: d.name, email: d.email, role: d.role,
    passwordHash: await bcrypt.hash(d.password, 10),
    createdAt: new Date().toISOString(),
  };
  await createUser(user);
  return user;
}

export async function login(input: unknown) {
  const d = loginSchema.parse(input);
  const user = await getUserByEmail(d.email);
  if (!user || !(await bcrypt.compare(d.password, user.passwordHash)))
    throw new AppError(401, "Invalid email or password");
  return user;
}