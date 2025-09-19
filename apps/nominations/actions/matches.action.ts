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
        console.log(`Chargement des matchs... ${lastUpdate}`);
        const date = dayjs().day(1);
        cacheData = await getMatches(date.format("YYYY-MM-DD"), dayjs(date.add(30, "day")).format("YYYY-MM-DD"));
        lastUpdate = Date.now();
    } catch (error) {
        console.error('Erreur lors du fetch des matchs:', error);
    }
}

export async function getCachedMatches(): Promise<{matches: MatchType[], competitions: CompetitionType[]}> {
    console.log(`Récupération des matchs en cache... ${lastUpdate} ${Date.now() - lastUpdate}`);
    if (!cacheData || Date.now() - lastUpdate > CACHE_TTL * 1000) {
        await fetchMatches();
    }
    return cacheData;
}

setInterval(fetchMatches, CACHE_TTL * 1000);

// export last update time
export async function getLastUpdateTime(): Promise<number> {
    return Promise.resolve(lastUpdate);
}