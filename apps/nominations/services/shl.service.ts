import {Login, LoginType} from "@/schemes/login.scheme";
import {shl} from "@/config/ky.config";
import {Match, MatchType, SHLMatchList} from "@/schemes/match.scheme";
import {RefereeType, SHLOfficial} from "@/schemes/referee.scheme";
import {Facility} from "@/schemes/facility.scheme";
import dayjs from "dayjs";

const publicTeamId = "T632086442";

export const getToken = async () => {
    const url = `https://app-sportlinked-production.sportlink.com/oauth/token`;

    const {CLIENT_ID, GRANT_TYPE, PASSWORD, SECRET, USERNAME} = process.env;

    const searchParams = new URLSearchParams();
    searchParams.append("client_id", CLIENT_ID ?? "");
    searchParams.append("grant_type", GRANT_TYPE ?? "");
    searchParams.append("password", PASSWORD ?? "");
    searchParams.append("secret", SECRET ?? "");
    searchParams.append("username", USERNAME ?? "");

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams,
    }).then(response => response.json()).then(Login.parse);
}

export const getSHLMatches = async () => {
    console.log("Token request for SHL");

    const token = await getToken();

    console.log("DEBUG 3", token);

    const url = `https://app-sportlinked-production.sportlink.com/entity/common/memberportal/app/team/TeamProgram?PublicTeamId=${publicTeamId}&v=3`;

    const matches = await shl(token.access_token).get(`${url}`).json().then(SHLMatchList.parse);
    matches.ProgramItemMatch.sort((a, b) => new Date(a.Match.MatchDateTime).getTime() - new Date(b.Match.MatchDateTime).getTime());
    matches.ProgramItemMatch = matches.ProgramItemMatch.filter(match => dayjs(match.Match.MatchDateTime).isAfter(dayjs()) && dayjs(match.Match.MatchDateTime).isBefore(dayjs(dayjs().add(35, "day"))));

    const parsedMatched: MatchType[] = [];

    for (const match of matches.ProgramItemMatch) {
        const officials = await getMatchOfficials(match.Match.PublicMatchId, token);
        const facility = await getMatchFacility(match.Match.PublicMatchId, token);

        const referees: RefereeType[] = [];
        const delegates: RefereeType[] = [];

        for (const official of officials.MatchOfficial) {
            official.Infix ??= "";
            official.LastName == "Afgeschermd" ? official.LastName = "Name hidden" : official.LastName;
            if (official.FunctionDescription === "Scheidsrechter 2") {
                referees.push({
                    id: official.OfficialId || 0,
                    firstname: official.FirstName,
                    surname: official.Infix + " " + official.LastName
                });
            } else if (official.FunctionDescription === "Waarnemer") {
                delegates.push({
                    id: official.OfficialId || 0,
                    firstname: official.FirstName,
                    surname: official.Infix + " " + official.LastName
                });
            }
        }

        parsedMatched.push(Match.parse({
            reference: match.Match.PublicMatchId,
            access: {
                organization_ids: [0],
            },
            organization_name: "shl",
            date: match.Match.MatchDateTime.split("T")[0],
            time: match.Match.MatchDateTime.split("T")[1].split("+")[0],
            home_score: undefined,
            away_score: undefined,
            serie_reference: "SHL",
            serie_name: "Super Handball League",
            venue_name: facility.FacilityName,
            venue_city: facility.City,
            home_team_short_name: match.Match.HomeTeam.TeamName,
            away_team_short_name: match.Match.AwayTeam.TeamName,
            game_status_id: 1,
            home_club_logo_img_url: "/api/image?bucket=" + match.Match.HomeTeam.Club.ClubLogo.Bucket + "&hash=" + match.Match.HomeTeam.Club.ClubLogo.Hash,
            away_club_logo_img_url: "/api/image?bucket=" + match.Match.AwayTeam.Club.ClubLogo.Bucket + "&hash=" + match.Match.AwayTeam.Club.ClubLogo.Hash,
            referees: referees,
            delegates: delegates,
        }))
    }

    return parsedMatched;
}

export const getMatchOfficials = async (matchId: string, login: LoginType) => {
    const url = `https://app-sportlinked-production.sportlink.com/entity/common/memberportal/app/match/MatchOfficials?PublicMatchId=${matchId}&v=1`

    return await shl(login.access_token).get(`${url}`).json().then(SHLOfficial.parse);
}

export const getMatchFacility = async (matchId: string, login: LoginType) => {
    const url = `https://app-sportlinked-production.sportlink.com/entity/common/memberportal/app/match/MatchFacility?PublicMatchId=${matchId}&v=3`

    return await shl(login.access_token).get(`${url}`).json().then(Facility.parse);
}