import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/Header";

export const metadata: Metadata = {
  title: "Study App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-700 antialiased text-primary-100 min-h-screen flex flex-col relative">
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl mx-auto w-full ">{children}</main>
        </div>
      </body>
    </html>
  );
}
