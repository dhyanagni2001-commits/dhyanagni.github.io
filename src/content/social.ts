export const social = [
  { url: "mailto:sureshag@usc.edu", name: "mail" },
  { url: "https://github.com/dhyanagni2001-commits", name: "github" },
  { url: "https://www.linkedin.com/in/dhyan-agni/", name: "linkedin" },
  //{ url: "https://www.instagram.com/davidhckh/", name: "instagram" },
] as const satisfies { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "x" }[];
