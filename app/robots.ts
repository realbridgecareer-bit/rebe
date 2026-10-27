import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/api/", "/review", "/success/submit", "/login", "/signup", "/forgot-password", "/reset-password", "/callback"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
