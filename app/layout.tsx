import type { Metadata } from "next";
import { getSystemConfig } from "@/app/actions/settings";
import { Outfit } from "next/font/google"; // Removed Noto Sans JP
import "../styles/globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { GoogleAnalytics } from '@next/third-parties/google';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSystemConfig();

  return {
    title: config.siteTitle,
    description: config.siteDescription || "Drone School Reservation System",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSystemConfig();

  return (
    <html lang="ja">
      <body className={`${outfit.variable}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {config.gaTrackingId && <GoogleAnalytics gaId={config.gaTrackingId} />}
        <SiteHeader />
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  );
}
