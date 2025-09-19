import {z} from "zod";

export const Referee = z.object({
    id: z.number(),
    firstname: z.string(),
    surname: z.string(),
});

export type RefereeType = z.infer<typeof Referee>;

export const SHLReferee = z.object({
    PublicMatchId: z.string(),
    MatchOfficial: z.array(z.object({
        OfficialId: z.number(),
        FunctionDescription: z.string(),
        FirstName: z.string(),
        Infix: z.string().nullable(),
        LastName: z.string(),
    })),
});