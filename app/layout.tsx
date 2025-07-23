import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/lib/Providers";
import ReactQueryProvider from "./providers/ReactQueryProvider";
  import { TooltipProvider } from "@/components/ui/tooltip";


export const metadata: Metadata = {
  title: "Vaishno Vastra Vibhag",
  description:
    "Complete shop management application with analytics, inventory, and billing",
  manifest: "/manifest.json",
  icons: {
    icon: "/FavIcon.png",
    apple: "/FavIcon.png",
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
        <link rel="apple-touch-icon" href="/FAVICON1212.png" />
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
              <Providers>{children}</Providers>
            </TooltipProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
