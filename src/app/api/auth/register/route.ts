import { route } from "@/utils/errors";
import { register } from "@/services/auth.service";
import { authResponse } from "@/lib/authResponse";

export const POST = route(async (req: Request) => authResponse(await register(await req.json()), 201));
