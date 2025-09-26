import {z} from "zod";

const Lang = z.enum(["en", "fr", "nl", "de"]);
export type LangType = z.infer<typeof Lang>;

export const getStorageLang = (): LangType => {
    const lang = localStorage.getItem('lang') || "en";
    return Lang.parse(lang);
}

export const setStorageLang = (lang: LangType) => {
    localStorage.setItem('lang', lang);
}