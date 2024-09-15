import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidatePath("/api/upcoming");
  const res = await fetch("https://vlrggapi.vercel.app/match?q=upcoming");
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
    }[];
  }

  const groupedData = newData.reduce((acc: EventGroup[], item: { match_event: string, unix_timestamp: string, team1: string, team2: string, score1: string, score2: string, current_map: string, match_series: string }) => {
    const event = item.match_event;

    // Daha önce bu event var mı kontrol et
    let eventGroup = acc.find((group: EventGroup) => group.event === event);

    // Eğer event daha önce eklenmediyse, yeni bir event grubu oluştur
    if (!eventGroup) {
      eventGroup = { event: event, matches: [] };
      acc.push(eventGroup);
    }

    // Bu event grubuna maçı ekle
    eventGroup.matches.push(item);

    return acc;
  }, [] as EventGroup[]);

  return NextResponse.json(groupedData);
}
