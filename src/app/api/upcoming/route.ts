import { getTeamLogo } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";


interface Match {
  unix_timestamp: string;
  team1: string;
  team2: string;
  team1_flag: string;
  score1: string;
  team2_flag: string;
  score2: string;
  current_map: string;
  match_series: string;
  team1_logo?: string; // Yeni eklenen alan
  team2_logo?: string; // Yeni eklenen alan
}

interface EventGroup {
  event: string;
  matches: Match[];
}

export async function GET() {
  revalidatePath("/api/upcoming");
  const res = await fetch("https://vlrggapi.vercel.app/match?q=upcoming");
  const { data } = await res.json();
  const newData = data.segments;

  const groupedData: EventGroup[] = [];

  for (const item of newData) {
    const event = item.match_event;

    // Daha önce bu event var mı kontrol et
    let eventGroup = groupedData.find((group) => group.event === event);

    // Eğer event daha önce eklenmediyse, yeni bir event grubu oluştur
    if (!eventGroup) {
      eventGroup = { event: event, matches: [] };
      groupedData.push(eventGroup);
    }

    // Takım logolarını ekleyelim
    const team1Logo = await getTeamLogo(item.team1);
    const team2Logo = await getTeamLogo(item.team2);

    eventGroup.matches.push({
      ...item,
      team1_logo: team1Logo,
      team2_logo: team2Logo,
    });
  }

  return NextResponse.json(groupedData);
}