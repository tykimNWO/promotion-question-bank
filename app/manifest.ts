import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "승진시험 문제은행",
    short_name: "문제은행",
    description: "개인 승진시험 공부용 문제은행",
    start_url: "/",
    display: "standalone",
    background_color: "#fcf9f4",
    theme_color: "#ff4800",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
