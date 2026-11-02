import { route } from "@/utils/errors";
import { login } from "@/services/auth.service";
import { authResponse } from "@/lib/authResponse";

export const POST = route(async (req: Request) => authResponse(await login(await req.json())));