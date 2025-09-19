import {z} from "zod";


export const Competition = z.object({
    reference: z.string(),
    short_name: z.string(),
})

export type CompetitionType = z.infer<typeof Competition>;

export const CompetitionList = z.object({
    elements: z.array(Competition),
})
