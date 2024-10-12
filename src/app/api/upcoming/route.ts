import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

interface EventGroup {
  event: string;
  matches: {
    unix_timestamp: string;
    team1: string;
    team2: string;
    team1_flag: string;
    score1: string;
    team2_flag: string;
    score2: string;
    current_map: string;
    match_series: string;
  }[];
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

    // getTeam fonksiyonlarını çağır ve sonuçları bekle
    // const [team1icon, team2icon] = await Promise.all([
    //   new Promise<string>((resolve) => getTeam(item.team1, resolve)),
    //   new Promise<string>((resolve) => getTeam(item.team2, resolve)),
    // ]);

    // Bu event grubuna maçı ekle
    // eventGroup.matches.push({
    //   ...item,
    //   team1_flag: team1icon,
    //   team2_flag: team2icon,
    // });
    eventGroup.matches.push(item);
  }

  return NextResponse.json(groupedData);
}
