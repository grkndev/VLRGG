import { getTeam } from "@/lib/getTeam";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  revalidatePath("/api/live");
  const res = await fetch("https://vlrggapi.vercel.app/match?q=live_score");
  const { data } = await res.json();
  let newData = data.segments;

  // Verileri event adlarına göre gruplamak ve {event:"", matches:[]} yapısına dönüştürmek
  const groupedData = newData.reduce((acc: any, item: any) => {
    const event = item.match_event;

    // Daha önce bu event var mı kontrol et
    let eventGroup = acc.find((group: any) => group.event === event);

    // Eğer event daha önce eklenmediyse, yeni bir event grubu oluştur
    if (!eventGroup) {
      eventGroup = { event: event, matches: [] };
      acc.push(eventGroup);
    }

    // Bu event grubuna maçı ekle
    eventGroup.matches.push(item);

    return acc;
  }, []);

  return NextResponse.json(groupedData);
}
