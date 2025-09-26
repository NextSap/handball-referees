import {z} from "zod";

export const Login = z.object({
    access_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
    refresh_token: z.string(),
});

export type LoginType = z.infer<typeof Login>;