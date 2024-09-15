/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getTeam(teamName: string) {
  const res = await fetch("https://www.vlr.gg/search/auto/?term=" + teamName);
  const data = await res.json();
  const filtered = data.filter((data: any) => data.type == "team");
  filtered.forEach((element: any) => {
    if (!element.logo_url || element.logo_url.length < 1) {
      element.logo_url = "/removed1.png";
    }
  });

  return `https:${filtered[0].logo_url}`;
}
