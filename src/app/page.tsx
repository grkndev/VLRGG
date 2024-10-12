"use client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type Match = {
  unix_timestamp: string;
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  team1_flag: string;
  team2_flag: string;
  current_map?: string;
  match_series?: string;
  team1_round_ct?: string;
  team1_round_t?: string;
  team2_round_ct?: string;
  team2_round_t?: string;
};
export default function Home() {
  const [upcomingMatches, setUpcomingMatches] = React.useState<
    { event: string; matches: Match[] }[]
  >([]);
  const [liveMatches, setLiveMatches] = React.useState<
    { event: string; matches: Match[] }[]
  >([]);

  React.useEffect(() => {
    fetch("/api/upcoming")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setUpcomingMatches(data);
      });
  }, []);

  React.useEffect(() => {
    fetch("/api/live")
      .then((res) => res.json())
      .then((data) => {
        setLiveMatches(data);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full bg-[#1e1e1e]">
          <TabsTrigger
            value="upcoming"
            className="text-white w-full data-[state=active]:text-white data-[state=active]:bg-[#3E3E3E]"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="text-white w-full data-[state=active]:text-white data-[state=active]:bg-[#3E3E3E]"
          >
            Live
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <MatchList matches={upcomingMatches} />
        </TabsContent>
        <TabsContent value="live">
          <MatchList matches={liveMatches} isLive={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
function MatchList({
  matches,
  isLive,
}: {
  matches: { event: string; matches: Match[] }[];
  isLive?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center justify-center gap-4 w-full">
      {matches &&
        matches.map((event) => (
          <Card
            key={event.event}
            className={`bg-transparent border-2 text-white w-full h-full ${
              isLive ? "border-red-500" : "border-[#3E3E3E]"
            }`}
          >
            <div className="flex flex-col items-center justify-start space-y-4 h-full py-4">
              <div className="flex flex-row items-center justify-center space-x-2 p-4">
                <Image
                  src="https://owcdn.net/img/604be13d01964.png"
                  alt="logo"
                  width={200}
                  height={200}
                  className="w-6 h-6"
                />
                <span className="text-sm">{event.event}</span>
              </div>

              <ScrollArea className="flex items-center justify-center w-full h-fit">
                <div className="flex flex-col items-center justify-center space-y-2 w-full">
                  {event.matches.map((match: Match) => (
                    <div
                      className="w-full items-center justify-center"
                      key={match.unix_timestamp}
                    >
                      <Separator
                        dateString={isLive ? "LIVE" : match.unix_timestamp}
                      />
                      <Match
                        type={"upcoming"}
                        team1={match.team1}
                        team2={match.team2}
                        team1_logo={match.team1_flag}
                        team2_flag={match.team2_flag}
                        score1={match.score1}
                        score2={match.score2}
                        isLive={isLive}
                        current_map={match.current_map}
                        match_series={match.match_series}
                        team1_round_ct={match.team1_round_ct}
                        team1_round_t={match.team1_round_t}
                        team2_round_ct={match.team2_round_ct}
                        team2_round_t={match.team2_round_t}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        ))}
    </div>
  );
}

function Separator({ dateString }: { dateString: string }) {
  const isToday =
    dateString === "LIVE" ? "NOW" : dayjs(dateString).isSame(dayjs(), "day");
  return (
    <div className="flex flex-row items-center justify-center space-x-2 w-full">
      <div
        className={`w-full h-[2px] bg-[#3E3E3E] ${
          dateString === "LIVE" ? "bg-red-500" : ""
        }`}
      />
      <span
        className={`text-sm text-[#3E3E3E] font-semibold text-nowrap ${
          dateString === "LIVE" ? "text-red-500" : ""
        }`}
      >
        {dateString === "LIVE"
          ? "LIVE"
          : dayjs(dateString)
              .add(3, "hours")
              .format(isToday ? "HH:mm [Today]" : "HH:mm DD/MM/YYYY") +
            " GMT+3"}
      </span>
      <div
        className={`w-full h-[2px] bg-[#3E3E3E] ${
          dateString === "LIVE" ? "bg-red-500" : ""
        }`}
      />
    </div>
  );
}
function Match({
  team1,
  team2,
  score1,
  score2,
  isLive,
  current_map,
  team1_logo,
  team2_flag,
  match_series,
  team1_round_ct,
  team1_round_t,
  team2_round_ct,
  team2_round_t,
}: {
  type: "upcoming" | "live" | "finished";
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  team1_logo: string;
  team2_flag: string;
  isLive?: boolean;
  current_map?: string;
  match_series?: string;
  team1_round_ct?: string;
  team1_round_t?: string;
  team2_round_ct?: string;
  team2_round_t?: string;
}) {

  return (
    <div className="flex flex-col items-center justify-between space-y-2 w-full px-4 py-2 ">
      <div className="flex flex-row items-center justify-between space-x-2 w-full ">
        <div className="flex flex-row items-center justify-center space-x-2 ">
          <Image
            src={team1_logo||"https://owcdn.net/img/604be13d01964.png"}
            alt="logo"
            width={200}
            height={200}
            className="w-6 h-6 shadow-xl "
          />
          <span className="text-base font-semibold">{team1}</span>
        </div>
        {isLive && (
          <div className="flex flex-row items-center justify-center space-x-2">
            <span className="text-sm text-white/20">
              (
              {Number(team1_round_ct == "N/A" ? 0 : team1_round_ct) +
                Number(team1_round_t == "N/A" ? 0 : team1_round_t)}
              )
            </span>
            <div className="w-8 h-8 flex flex-row items-center justify-center space-x-2 bg-[#3E3E3E] p-2 rounded-md">
              <span className="text-sm font-semibold">{score1}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-between space-x-2 w-full">
        <div className="flex flex-row items-center justify-center space-x-2">
          <Image
            src={team2_flag||"https://owcdn.net/img/604be13d01964.png"}
            alt="logo"
            width={200}
            height={200}
            className="w-6 h-6 "
          />

          <span className="text-base font-semibold">{team2}</span>
        </div>
        {isLive && (
          <div className="flex flex-row items-center justify-center space-x-2">
            <span className="text-sm text-white/20">
              (
              {Number(team2_round_ct == "N/A" ? 0 : team2_round_ct) +
                Number(team2_round_t == "N/A" ? 0 : team2_round_t)}
              )
            </span>
            <div className="w-8 h-8 flex flex-row items-center justify-center space-x-2 bg-[#3E3E3E] p-2 rounded-md">
              <span className="text-sm font-semibold">{score2}</span>
            </div>
          </div>
        )}
      </div>
      {isLive && (
        <div className="flex flex-row items-center justify-between space-x-2 w-full mt-2">
          <span className="text-sm text-white/20">{match_series}</span>
          <span className="text-sm text-white/20">
            Current Map: {current_map}
          </span>
        </div>
      )}
    </div>
  );
}
