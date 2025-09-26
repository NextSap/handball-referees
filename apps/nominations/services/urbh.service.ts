import {bigcaptain} from "@/config/ky.config";
import {MatchList} from "@/schemes/match.scheme";
import {CompetitionList} from "@/schemes/competition.scheme";

const season_id = 5; // 2025-2026

export const getNationalMatches = async (startDate: string, endDate: string) => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=${season_id}&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=1&start_date=${startDate}&end_date=${endDate}`;

    return await bigcaptain.get(`${url}`).json().then(MatchList.parse);
}

export const getNationalCompetitions = async () => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/serie/byMyLeague?organization_id=1&season_id=${season_id}&sort[0]=competition&sort[1]=division&sort[2]=order&serie_status_id[0]=0&serie_status_id[1]=1`

    return await bigcaptain.get(`${url}`).json().then(CompetitionList.parse);
}

export const getLeagueMatches = async (startDate: string, endDate: string) => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=${season_id}&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=3&start_date=${startDate}&end_date=${endDate}`;

    return await bigcaptain.get(`${url}`).json().then(MatchList.parse);
}

export const getLeagueCompetitions = async () => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/serie/byMyLeague?organization_id=3&season_id=${season_id}&sort[0]=competition&sort[1]=division&sort[2]=order&serie_status_id[0]=0&serie_status_id[1]=1`

    return await bigcaptain.get(`${url}`).json().then(CompetitionList.parse);
}

export const getLiegeMatches = async (startDate: string, endDate: string) => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=${season_id}&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=7&start_date=${startDate}&end_date=${endDate}`;

    return await bigcaptain.get(`${url}`).json().then(MatchList.parse);
}

export const getLiegeCompetitions = async () => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/serie/byMyLeague?organization_id=7&season_id=${season_id}&sort[0]=competition&sort[1]=division&sort[2]=order&serie_status_id[0]=0&serie_status_id[1]=1`

    return await bigcaptain.get(`${url}`).json().then(CompetitionList.parse);
}

export const getBHMatches = async (startDate: string, endDate: string) => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=${season_id}&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=8&start_date=${startDate}&end_date=${endDate}`;

    return await bigcaptain.get(`${url}`).json().then(MatchList.parse);
}

export const getBHCompetitions = async () => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/serie/byMyLeague?organization_id=8&season_id=${season_id}&sort[0]=competition&sort[1]=division&sort[2]=order&serie_status_id[0]=0&serie_status_id[1]=1`

    return await bigcaptain.get(`${url}`).json().then(CompetitionList.parse);
}

export const getVHVMatches = async (startDate: string, endDate: string) => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=${season_id}&without_in_preparation=true&sort[0]=date&sort[1]=time&organization_id=2&start_date=${startDate}&end_date=${endDate}`;

    return await bigcaptain.get(`${url}`).json().then(MatchList.parse);
}

export const getVHVCompetitions = async () => {
    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/serie/byMyLeague?organization_id=2&season_id=${season_id}&sort[0]=competition&sort[1]=division&sort[2]=order&serie_status_id[0]=0&serie_status_id[1]=1`

    return await bigcaptain.get(`${url}`).json().then(CompetitionList.parse);
}


export const getMatches = async (startDate: string, endDate: string) => {

    const promisesMatches = [
        getNationalMatches(startDate, endDate),
        getLeagueMatches(startDate, endDate),
        getLiegeMatches(startDate, endDate),
        getBHMatches(startDate, endDate),
        getVHVMatches(startDate, endDate),
    ]

    const promisesCompetitions = [
        getNationalCompetitions(),
        getLeagueCompetitions(),
        getLiegeCompetitions(),
        getBHCompetitions(),
        getVHVCompetitions(),
    ]

    const resultsMatches = await Promise.allSettled(promisesMatches);
    const resultsCompetitions = await Promise.allSettled(promisesCompetitions);

    const matches = resultsMatches.filter(result => result.status === "fulfilled")
        .flatMap(result => result.value.elements);

    const competitions = resultsCompetitions.filter(result => result.status === "fulfilled")
        .flatMap(result => result.value.elements);

    competitions.unshift({
        reference: "SHL",
        short_name: "Super League",
    });

    matches.forEach((match) => {
        match.referees = match.referees.filter((referee) => referee !== null);

        if (match.referees.length > 2) {
            match.delegates = match.referees.slice(2);
            match.referees = match.referees.slice(0, 2);
        }

        switch (match.access.organization_ids[0]) {
            case 0:
                match.organization_name = "shl";
                break;
            case 1:
                match.organization_name = "national";
                break;
            case 3:
            case 7:
            case 8:
                match.organization_name = "lfh";
                break;
            case 2:
                match.organization_name = "vhv";
                break;
            default:
                match.organization_name = "other";
                break;
        }
    });

    const competitionOrder: Record<string, number> = competitions.reduce(
        (acc, comp, index) => {
            acc[comp.reference] = index;
            return acc;
        }, {} as Record<string, number>);

    matches.sort(
        (a, b) => competitionOrder[a.serie_reference] - competitionOrder[b.serie_reference]
    );

    console.log("Belgian Loaded");

    return {
        matches: matches,
        competitions: competitions
    }
}