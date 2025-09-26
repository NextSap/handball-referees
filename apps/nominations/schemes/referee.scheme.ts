import {z} from "zod";

export const Referee = z.object({
    id: z.number(),
    firstname: z.string(),
    surname: z.string(),
});

export type RefereeType = z.infer<typeof Referee>;

export const SHLOfficial = z.object({
    PublicMatchId: z.string(),
    MatchOfficial: z.array(z.object({
        OfficialId: z.number().nullable(),
        FunctionDescription: z.string(),
        FirstName: z.string(),
        Infix: z.string().nullable(),
        LastName: z.string(),
    })),
});