import React from 'react';
import {MatchType} from "@/schemes/match.scheme";
import dayjs from "dayjs";
import translate from "../public/translate.json";
import {LangType} from "@/services/storage.service";

type MatchComponentProps = {
    sortedMatches: MatchType[];
    index: number;
    match: MatchType;
    lang: LangType;
}

const baseImage = "https://admin.handballbelgium.be/lms_league_ws/public/img/";

const MatchComponent = (props: MatchComponentProps) => {
    const formatDate = dayjs(new Date(props.match.date)).format("dddd D MMM");
    const formatTime = props.match.time ? props.match.time.split(":").slice(0, 2).join(":") : "00:00";

    const isPostponed = props.match.game_status_id === 6;

    const text = translate[props.lang];

    return (
        <div className={`flex ssm:flex-row flex-col ${props.index % 2 === 0 ? "bg-white" : "bg-gray-100"} py-3`}>
            <div className={`flex flex-col items-center`}>
                <p className="text-center font-bold">{props.match.serie_name} - {formatDate}</p>
                <p className="text-center">{props.match.venue_name}</p>
                <div className="h-[1px] w-20 bg-gray-200 my-1"/>
                <div className="flex w-full justify-center">
                    <div className="flex flex-col justify-center items-center w-32">
                        <img
                            src={(props.match.organization_name == "shl" ? "" : baseImage) + props.match.home_club_logo_img_url}
                            alt={props.match.home_team_short_name}
                            className="w-8 h-8"/>
                        <p className="text-center">{props.match.home_team_short_name}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center w-24">
                        {isPostponed ? <p className="font-bold text-[#D32F2F]">Postponed</p> :
                            <p>{props.match.home_score !== undefined && props.match.away_score !== undefined ?
                                `${props.match.home_score} - ${props.match.away_score}` : formatTime}</p>}
                    </div>
                    <div className="flex flex-col justify-center items-center w-32">
                        <img
                            src={(props.match.organization_name == "shl" ? "" : baseImage) + props.match.away_club_logo_img_url}
                            alt={props.match.away_team_short_name}
                            className="w-8 h-8"/>
                        <p className="text-center">{props.match.away_team_short_name}</p>
                    </div>
                </div>
            </div>
            <div className="flex ssm:flex-col flex-row justify-center ssm:mt-0 mt-2 ml-0 ssm:ml-5">
                <div className="flex flex-col ssm:w-32 w-56">
                    <p className="font-bold underline">{text.referees}</p>
                    {props.match.referees.length == 0 ? <p>x</p> :
                        props.match.referees.map((referee, index) => {
                            if (referee !== null) {
                                return (
                                    <p key={referee.id}>
                                        {index+1}. {referee.surname} {referee.firstname.substring(0, 1).toUpperCase()}.
                                    </p>
                                );
                            }
                        })}
                </div>
                <div className="flex flex-col w-32">
                    <p className="font-bold underline">{text.delegates}</p>
                    {!props.match.delegates || props.match.delegates.length == 0 ? <p>x</p> :
                        props.match.delegates.map((delegate, index) => {
                            if (delegate !== null) {
                                return (
                                    <p key={delegate.id}>
                                        {index+1}. {delegate.surname} {delegate.firstname.substring(0, 1).toUpperCase()}.
                                    </p>
                                );
                            }
                        })}
                </div>
            </div>
        </div>
    );
};

export default MatchComponent;