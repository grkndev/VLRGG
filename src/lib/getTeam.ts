/* eslint-disable @typescript-eslint/no-explicit-any */
export function getTeam(teamName: string, callback: (logoUrl: string) => void): void {
  fetch("https://www.vlr.gg/search/auto/?term=" + teamName)
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter((item: any) => item.type === "team");
      filtered.forEach((element: any) => {
        if (!element.logo_url || element.logo_url.length < 1) {
          element.logo_url = "/owcdn.net/img/604be13d01964.png";
        }
      });

      if (filtered.length > 0) {
        callback(`https:${filtered[0].logo_url}`);
      } else {
        callback("/owcdn.net/img/604be13d01964.png");
      }
    })
    .catch(error => {
      console.error("Error fetching team data:", error);
      callback("/owcdn.net/img/604be13d01964.png");
    });
}