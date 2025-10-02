"use client";

import { bookInterface } from "../../../components/BookProvider";
import { useState, useEffect } from "react";
import { FaBookDead, FaTrash, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function FavoritesPage() {
  const [favBooks, setFavBooks] = useState<bookInterface[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = window.localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavBooks(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        setFavBooks([]);
      }
    }
  }, []);

  const handleRemoveFromFavorites = (bookId: string) => {
    const updatedFavorites = favBooks.filter((book) => book.id !== bookId);
    setFavBooks(updatedFavorites);
    if (isClient) {
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  if (!isClient) {
    return (
      <div className="h-screen flex items-center justify-center py-10 px-10">
        <div className="w-[900px] flex h-full flex-col items-center justify-center">
          <div className="animate-pulse text-foreground">
            Loading favorites...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center py-10 px-10">
      <div className="w-[900px] flex h-full flex-col">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span>Back to Search</span>
            </Link>
          </div>
          <h1 className="text-foreground text-3xl font-bold">
            My Favorite Books
          </h1>
          <div className="flex items-center gap-2 text-foreground">
            <FaTrash className="text-red-500" />
            <span>{favBooks.length} books</span>
          </div>
        </div>

        {/* Books List */}
        {favBooks.length === 0 ? (
          <div className="flex items-center justify-center flex-1 bg-foreground/10 w-full rounded-lg">
            <div className="animate-bounce flex items-center justify-center gap-2">
              <FaBookDead className="text-lg text-foreground" />
              <h2 className="text-foreground">No favorite books yet</h2>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 w-full overflow-auto flex-1 bg-foreground/10 rounded-lg py-4">
            {favBooks.map((book) => (
              <div
                key={book.id}
                className="border-t border-b p-4 shadow flex gap-4 relative bg-background/50 "
              >
                <div className="absolute right-4 top-4">
                  <button
                    className="w-7 h-7 border bg-red-500 border-red-500 hover:bg-red-600 transition-all duration-300 rounded flex items-center justify-center cursor-pointer"
                    onClick={() => handleRemoveFromFavorites(book.id)}
                    title="Remove from favorites"
                  >
                    <FaTrash className="m-1 text-white transition-colors duration-300" />
                  </button>
                </div>

                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <Image
                    className="w-[80px] h-[120px] bg-red-300 rounded object-cover"
                    src={book.volumeInfo.imageLinks?.thumbnail || ""}
                    alt={book.volumeInfo.title}
                    width={80}
                    height={120}
                    unoptimized
                  />
                ) : (
                  <Image
                    className="w-[80px] h-[120px] bg-red-300 rounded object-cover"
                    src={"https://i.ibb.co/5gQxn3PS/image.png"}
                    alt={book.volumeInfo.title}
                    width={80}
                    height={120}
                    unoptimized
                  />
                )}

                <div className="flex flex-col justify-between flex-1 pr-12">
                  <h2 className="text-foreground text-lg font-bold">
                    {book.volumeInfo.title && book.volumeInfo.title.length > 50
                      ? book.volumeInfo.title.substring(0, 50) + "..."
                      : book.volumeInfo.title}
                  </h2>
                  <p className="text-sm text-foreground">
                    {book.volumeInfo.description
                      ? book.volumeInfo.description.length > 100
                        ? book.volumeInfo.description.substring(0, 100) + "..."
                        : book.volumeInfo.description
                      : "No description available."}
                  </p>
                  <p className="text-sm text-foreground mb-1 font-semibold">
                    {book.volumeInfo.authors
                      ? book.volumeInfo.authors.join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
