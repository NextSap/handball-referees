"use server"

import {getMatches} from "@/services/urbh.service";
import {MatchType} from "@/schemes/match.scheme";
import dayjs from "dayjs";
import {CompetitionType} from "@/schemes/competition.scheme";

let cacheData: {matches: MatchType[], competitions: CompetitionType[]};
let lastUpdate = 0;
const CACHE_TTL = 300;

async function fetchMatches() {
    try {
        console.log(`[FETCH] lastupdate = ${lastUpdate}`);
        const date = dayjs().day() == 0 ? dayjs().subtract(1, "day") : dayjs();
        cacheData = await getMatches(date.format("YYYY-MM-DD"), dayjs(date.add(35, "day")).format("YYYY-MM-DD"));
        lastUpdate = Date.now();
    } catch (error) {
        console.error('[FETCH] Erreur lors du fetch des matchs:', error);
    }
}

export async function getCachedMatches(): Promise<{matches: MatchType[], competitions: CompetitionType[]}> {
    console.log(`[CACHE] Récupération des matchs en cache... lastupdate : ${lastUpdate} difference : ${Date.now() - lastUpdate}`);
    if (!cacheData) {
        await fetchMatches();
    }
    return cacheData;
}

setInterval(fetchMatches, CACHE_TTL * 1000);

// export last update time
export async function getLastUpdateTime(): Promise<number> {
    return Promise.resolve(lastUpdate);
}