import {z} from "zod";

export const Facility = z.object({
    FacilityName: z.string(),
    City: z.string()
});

export type FacilityType = z.infer<typeof Facility>;