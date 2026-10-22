import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Options Intelligence | India", description: "Provider-neutral Indian index options analytics dashboard" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
