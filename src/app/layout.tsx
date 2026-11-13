import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClickTracker } from "@/components/ClickTracker";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name}: AI engineering, summarised`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d1a" },
  ],
};

// Off Vercel the analytics script 404s and logs a console error, so it is only added there.
const onVercel = Boolean(process.env.VERCEL);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        {children}
        <ClickTracker />
        {onVercel && <SiteAnalytics />}
      </body>
    </html>
  );
}
