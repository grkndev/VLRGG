import { getTeamLogo } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

interface EventGroup {
  event: string;
  matches: {
    unix_timestamp: string;
    team1: string;
    team2: string;
    team1_logo: string;
    team2_logo: string;
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
export async function GET() {
  revalidatePath("/api/live");
  const res = await fetch("https://vlrggapi.vercel.app/match?q=live_score");
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

    // getTeam fonksiyonlarını çağır ve sonuçları bekle
    // const [team1icon, team2icon] = await Promise.all([
    //   new Promise<string>((resolve) => getTeam(item.team1, resolve)),
    //   new Promise<string>((resolve) => getTeam(item.team2, resolve)),
    // ]);

     // Takım logolarını ekleyelim
     const team1Logo = await getTeamLogo(item.team1);
     const team2Logo = await getTeamLogo(item.team2);


    // Bu event grubuna maçı ekle
    eventGroup.matches.push({
      unix_timestamp: item.unix_timestamp,
      team1: item.team1,
      team2: item.team2,
      team1_logo: team1Logo,
      team2_logo: team2Logo,
      score1: item.score1,
      score2: item.score2,
      current_map: item.current_map,
      match_series: item.match_series,
      team1_round_ct: item.team1_round_ct,
      team1_round_t: item.team1_round_t,
      team2_round_ct: item.team2_round_ct,
      team2_round_t: item.team2_round_t,
    });
  }

  return NextResponse.json(groupedData);
}
