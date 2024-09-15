import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidatePath("/api/live");
  const res = await fetch("https://vlrggapi.vercel.app/match?q=live_score");
  const { data } = await res.json();
  const newData = data.segments;

  // Verileri event adlarına göre gruplamak ve {event:"", matches:[]} yapısına dönüştürmek
  interface EventGroup {
    event: string;
    matches: {
      unix_timestamp: string;
      team1: string;
      team2: string;
      score1: string;
      score2: string;
      current_map: string;
      match_series: string;
      team1_round_ct: string;
      team1_round_t: string;
      team2_round_ct: string;
      team2_round_t: string;
    }[];
  }

  const groupedData = newData.reduce((acc: EventGroup[], item: {
    match_event: string;
    unix_timestamp: string;
    team1: string;
    team2: string;
    score1: string;
    score2: string;
    current_map: string;
    match_series: string;
    team1_round_ct: string;
    team1_round_t: string;
    team2_round_ct: string;
    team2_round_t: string;
  }) => {
    const event = item.match_event;
    let eventGroup = acc.find((group: EventGroup) => group.event === event);

    if (!eventGroup) {
      eventGroup = { event: event, matches: [] };
      acc.push(eventGroup);
    }

    // Only push the required properties
    eventGroup.matches.push({
      unix_timestamp: item.unix_timestamp,
      team1: item.team1,
      team2: item.team2,
      score1: item.score1,
      score2: item.score2,
      current_map: item.current_map,
      match_series: item.match_series,
      team1_round_ct: item.team1_round_ct,
      team1_round_t: item.team1_round_t,
      team2_round_ct: item.team2_round_ct,
      team2_round_t: item.team2_round_t,
    });

    return acc;
  }, [] as EventGroup[]);

  return NextResponse.json(groupedData);
}
