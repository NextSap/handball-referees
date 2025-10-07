"use client";

import React, {useEffect, useState, useTransition} from 'react';
import {getCachedMatches, getLastUpdateTime} from "@/actions/matches.action";
import {MatchType} from "@/schemes/match.scheme";
import LoaderComponent from "@/components/loader.component";
import Image from "next/image";
import MatchComponent from "@/components/match.component";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@workspace/ui/components/accordion";
import {CompetitionType} from "@/schemes/competition.scheme";
import {Checkbox} from "@workspace/ui/components/checkbox";
import {Label} from "@workspace/ui/components/label";
import dayjs from "@/config/dayjs.config";
import {Dayjs} from "dayjs";
import translate from "../public/translate.json";
import {LangType, setStorageLang, getStorageLang} from "@/services/storage.service";

const Page = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPending, startTransition] = useTransition();

    const [refereeFilter, setRefereeFilter] = useState<string>("");
    const [teamFilter, setTeamFilter] = useState<string>("");

    const [selectedSeries, setSelectedSeries] = useState<{
        shl: boolean,
        national: boolean,
        lfh: boolean,
        vhv: boolean
    }>({
        shl: true,
        national: true,
        lfh: true,
        vhv: true
    });

    const [showLastCacheUpdate, setShowLastCacheUpdate] = useState<boolean>(false);
    const [lastCacheUpdate, setLastCacheUpdate] = useState<number>(0);

    const [weeklyMatches, setWeeklyMatches] = useState<Record<string, MatchType[]>>({});

    const [lang, setLang] = useState<LangType>("en");

    const text = translate[lang];

    const renderMatches = () => {
        setLang(getStorageLang())
        setIsLoading(true);
        startTransition(() => {

            getCachedMatches().then((result) => {
                const groupedByWeek: Record<string, MatchType[]> = groupByWeekend(result);
                setWeeklyMatches(groupedByWeek);
            });
            getLastUpdateTime().then((time) => setLastCacheUpdate(time));

            setIsLoading(false);
        });
    }

    useEffect(() => {
        renderMatches();
    }, []);

    const matchesFilter = (match: MatchType) => {
        const normalize = (str: string) =>
            str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        if (!selectedSeries.shl && match.organization_name === "shl") return false;
        if (!selectedSeries.national && match.organization_name === "national") return false;
        if (!selectedSeries.lfh && match.organization_name === "lfh") return false;
        if (!selectedSeries.vhv && match.organization_name === "vhv") return false;

        if (refereeFilter === "" && teamFilter === "") return true;

        const refereeValues = match.referees.flatMap((referee) => {
            if (!referee) return [];
            const fullName1 = `${referee.firstname} ${referee.surname}`;
            const fullName2 = `${referee.surname} ${referee.firstname}`;
            return [referee.firstname, referee.surname, fullName1, fullName2];
        });

        if (match.delegates) {
            match.delegates.forEach((delegate) => {
                if (delegate) {
                    const fullName1 = `${delegate.firstname} ${delegate.surname}`;
                    const fullName2 = `${delegate.surname} ${delegate.firstname}`;
                    refereeValues.push(delegate.firstname, delegate.surname, fullName1, fullName2);
                }
            });
        }

        const teamValues = [
            match.home_team_short_name || "",
            match.away_team_short_name || "",
        ];

        return (
            (refereeFilter &&
                refereeValues.some((value) =>
                    normalize(value).includes(normalize(refereeFilter))
                )) ||
            (teamFilter &&
                teamValues.some((value) =>
                    normalize(value).includes(normalize(teamFilter))
                ))
        );
    };

    const filteredMatches = (matches: MatchType[]) => {
        return matches.filter(matchesFilter);
    };

    return (
        isLoading ?
            <LoaderComponent lang={lang}/> :
            <div className="flex flex-col gap-1.5 p-3">
                <Image className="m-auto z-10" src={"/urbh_logo.png"} alt={"URBH Logo"} width={50} height={50}
                       onClick={() => {
                           setShowLastCacheUpdate(!showLastCacheUpdate);
                       }}/>
                <h1 className="flex justify-center font-bold text-2xl w-full text-center">Belgian Referees
                    Nominations</h1>
                {showLastCacheUpdate && <p className="w-full text-center text-xs">Last matches
                    update {dayjs(lastCacheUpdate).format("DD/MM/YYYY - HH:mm:ss")}</p>}
                <ul className="flex gap-5 justify-center my-2">
                    <li>
                        <a className={`p-1 cursor-pointer transition-all duration-300 ${lang === "en" ? "font-bold bg-green-100" : "hover:bg-green-100"}`}
                           onClick={() => {
                               setLang("en")
                               setStorageLang("en")
                           }}>English</a>
                    </li>
                    <li>
                        <a className={`p-1 cursor-pointer transition-all duration-300 ${lang === "nl" ? "font-bold bg-green-100" : "hover:bg-green-100"}`}
                           onClick={() => {
                               setLang("nl")
                               setStorageLang("nl")
                           }}>Nederlands</a>
                    </li>
                    <li>
                        <a className={`p-1 cursor-pointer transition-all duration-300 ${lang === "fr" ? "font-bold bg-green-100" : "hover:bg-green-100"}`}
                           onClick={() => {
                               setLang("fr")
                               setStorageLang("fr")
                           }}>Français</a>
                    </li>
                    <li>
                        <a className={`p-1 cursor-pointer transition-all duration-300 ${lang === "de" ? "font-bold bg-green-100" : "hover:bg-green-100"}`}
                           onClick={() => {
                               setLang("de")
                               setStorageLang("de")
                           }}>Deutsch</a>
                    </li>
                </ul>
                <div>
                    <input
                        type="text"
                        placeholder={text.refereeFilter}
                        value={refereeFilter}
                        onChange={(e) => setRefereeFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder={text.teamFilter}
                        value={teamFilter}
                        onChange={(e) => setTeamFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                    />
                </div>
                <div className="flex flex-col ssm:flex-row gap-2">
                    <Label
                        className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                        <Checkbox
                            id="toggle-2"
                            checked={selectedSeries.shl}
                            onClick={() => setSelectedSeries(prev => ({...prev, shl: !prev.shl}))}
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                        />
                        <p className="text-sm leading-none font-medium">
                            SHL matches
                        </p>
                    </Label>
                    <Label
                        className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                        <Checkbox
                            id="toggle-2"
                            checked={selectedSeries.national}
                            onClick={() => setSelectedSeries(prev => ({...prev, national: !prev.national}))}
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                        />
                        <p className="text-sm leading-none font-medium">
                            National matches
                        </p>
                    </Label>
                    <Label
                        className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                        <Checkbox
                            id="toggle-2"
                            checked={selectedSeries.lfh}
                            onClick={() => setSelectedSeries(prev => ({...prev, lfh: !prev.lfh}))}
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                        />
                        <p className="text-sm leading-none font-medium">
                            LFH matches
                        </p>
                    </Label>
                    <Label
                        className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                        <Checkbox
                            id="toggle-2"
                            checked={selectedSeries.vhv}
                            onClick={() => setSelectedSeries(prev => ({...prev, vhv: !prev.vhv}))}
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                        />
                        <p className="text-sm leading-none font-medium">
                            VHV matches
                        </p>
                    </Label>
                </div>
                <Accordion type="multiple">
                    {Object.entries(weeklyMatches).map(([week, matches], index) => {
                        const date = new Date(week);
                        const monday = dayjs(date).format("DD/MM/YYYY");
                        const saturday = dayjs(date).add(5, "day").format("DD/MM");
                        const sunday = dayjs(date).add(6, "day").format("DD/MM");

                        console.log(week)

                        let weekName;

                        if (index == 0) {
                            weekName = text.thisWeek;
                        } else if (index == 1) {
                            weekName = text.nextWeek;
                        } else {
                            weekName = text.InXWeeks.replace("{{count}}", index.toString());
                        }

                        return (
                            <AccordionItem className="bg-blue-50" value={week} key={week}>
                                <AccordionTrigger className="font-bold text-xl">{weekName}<br/>Sa {saturday} -
                                    Su {sunday}</AccordionTrigger>
                                <AccordionContent>
                                    {filteredMatches(matches).map((match, index, sortedMatches) => {
                                        return <MatchComponent key={match.reference + index} match={match}
                                                               index={index}
                                                               sortedMatches={sortedMatches}
                                                               lang={lang}
                                        />
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </div>
    );
};

export default Page;

const groupByWeekend = (result: {
    belgianMatches: MatchType[],
    competitions: CompetitionType[],
    SHLMatches: MatchType[]
}) => {
    let groupedByWeek: Record<string, MatchType[]> = {};
    result.belgianMatches.forEach((match) => {
        const weekStart = getLastMonday(dayjs(match.date, "YYYY-MM-DD").day() == 0 ? dayjs(match.date, "YYYY-MM-DD").subtract(3, "day") : dayjs(match.date, "YYYY-MM-DD")); // Week starts on Sunday, substract 1 to stay on the right week
        const weekKey = weekStart.format("YYYY/MM/DD");

        if (!groupedByWeek[weekKey]) groupedByWeek[weekKey] = [];

        groupedByWeek[weekKey].push(match);
    });

    result.SHLMatches.forEach((match) => {
        const weekStart = getLastMonday(dayjs(match.date).day() == 0 ? dayjs(match.date).subtract(3, "day") : dayjs(match.date)); // Week starts on Sunday, substract 1 to stay on the right week
        const weekKey = weekStart.format("YYYY/MM/DD");

        if (!groupedByWeek[weekKey]) groupedByWeek[weekKey] = [];

        groupedByWeek[weekKey].push(match);
    });

    const competitionOrder: Record<string, number> = result.competitions.reduce(
        (acc, comp, index) => {
            acc[comp.reference] = index;
            return acc;
        }, {} as Record<string, number>);

    Object.keys(groupedByWeek).forEach((weekKey) => {
        groupedByWeek[weekKey]
            .sort((a, b) => {
                const dateA = dayjs(a.date + " " + a.time, "YYYY-MM-DD hh:mm:ss");
                const dateB = dayjs(b.date + " " + b.time, "YYYY-MM-DD hh:mm:ss");

                return dateA.valueOf() - dateB.valueOf();
            })
            .sort((a, b) => competitionOrder[a.serie_reference] - competitionOrder[b.serie_reference]);
    });

    groupedByWeek = Object.fromEntries(
        Object.entries(groupedByWeek)
            .sort(([keyA], [keyB]) => {
                const dateA = dayjs(keyA, "YYYY/MM/DD");
                const dateB = dayjs(keyB, "YYYY/MM/DD");
                return dateA.valueOf() - dateB.valueOf();
            })
    );

    return groupedByWeek;
}

const getLastMonday = (date: Dayjs): Dayjs => {
    const day = date.day();
    return dayjs(date).subtract((day + 6) % 7, 'day');
}