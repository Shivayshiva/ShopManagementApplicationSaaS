import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/lib/Providers";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashWrapper from "@/components/splashWrapper";

export const metadata: Metadata = {
  title: "Vaishno Vastra Vibhag",
  description:
    "Complete shop management application with analytics, inventory, and billing",
  manifest: "/manifest.json",
  icons: {
    icon: "/48IMAGE48.png",
    apple: "/48IMAGE48.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/48IMAGE48.png" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Shop Manager" />
      </head>
      <body>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <Providers>
                <SplashWrapper>{children}</SplashWrapper>
              </Providers>
            </TooltipProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
