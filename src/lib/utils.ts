import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getTeamLogo(teamName: string): Promise<string> {
  try {
    const response = await axios.get(
      `https://www.vlr.gg/search/auto/?term=${teamName}`
    );
    const data = response.data;

    const filtered = data.filter((item: any) => item.type === "team");
    if (filtered.length > 0 && filtered[0].logo_url) {
      return filtered[0].logo_url;
    } else {
      return "//owcdn.net/img/604be13d01964.png"; // Varsayılan logo
    }
  } catch (error) {
    console.error("Error fetching team logo:", error);
    return "//owcdn.net/img/604be13d01964.png"; // Hata durumunda varsayılan logo
  }
}
