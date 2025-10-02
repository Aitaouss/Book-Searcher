import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import { BookProvider } from "../../components/BookProvider";
import { fetchBooks } from "../../lib/fetchBooks";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Book Search",
  description: "Search for books using the Google Books API",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await fetchBooks("harry", "intitle", 0, 10);

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${nunito.variable} antialiased h-screen`}
      >
        <BookProvider initialBooks={data?.items || []}>{children}</BookProvider>
      </body>
    </html>
  );
}
