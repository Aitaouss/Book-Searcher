"use client";

import { BookContext } from "./BookProvider";
import { useContext, useState } from "react";
import { FaBookDead, FaHeart, FaList } from "react-icons/fa";
import Image from "next/image";
import { bookInterface } from "./BookProvider";
import { BookModal } from "./BookModal";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function BookListClient() {
  const [selectedBook, setSelectedBook] = useState<bookInterface | null>(null);

  const [favBook, setFavBook] = useLocalStorage<bookInterface[]>(
    "favorites",
    []
  );

  const [queBook, setQueBook] = useLocalStorage<bookInterface[]>("queue", []);

  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useContext must be used within a BookProvider");
  }

  const { books, setLoadMore } = context;

  if (books.length === 0) {
    return (
      <div className=" flex items-center justify-center mt-4 text-center flex-1 bg-foreground/10 w-full rounded-lg">
        <div className="animate-bounce flex items-center justify-center gap-2">
          <FaBookDead className="text-lg text-foreground" />
          <h1 className=" text-foreground">No books found</h1>
        </div>
      </div>
    );
  }
  const booksToRender: bookInterface[] = books;

  const handleOnclickLoadMore = () => {
    console.log("Clicked");
    setLoadMore(true);
  };

  const handleClickFavBook = (book: bookInterface) => {
    setFavBook((prev) => {
      const isAlreadyFav = prev.some((b) => b.id === book.id);
      if (isAlreadyFav) {
        return prev.filter((b) => b.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const handleCLickQueBook = (book: bookInterface) => {
    setQueBook((prev) => {
      const isAlreadyQue = prev.some((b) => b.id === book.id);
      if (isAlreadyQue) {
        return prev.filter((b) => b.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  // Helper function to check if a book is favorited
  const isBookFavorited = (bookId: string): boolean => {
    return favBook && favBook.some((b) => b.id === bookId);
  };

  const isBookQueued = (bookId: string): boolean => {
    return queBook && queBook.some((b) => b.id === bookId);
  };

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 w-full overflow-auto flex-1 bg-foreground/10 rounded-lg">
      {booksToRender.map((book) => (
        <div
          key={book.id}
          className="border-t border-b p-4 shadow flex gap-4 relative cursor-pointer"
          onClick={() => setSelectedBook(book)}
        >
          <div className="absolute right-4 flex gap-2">
            <button
              className={`w-7 h-7 border transition-all duration-300 rounded flex items-center justify-center cursor-pointer ${
                isBookFavorited(book.id)
                  ? "bg-red-500 border-red-500 hover:bg-red-600"
                  : "border-foreground hover:bg-foreground"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleClickFavBook(book);
              }}
              title={
                isBookFavorited(book.id)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <FaHeart
                className={`m-1 transition-colors duration-300 ${
                  isBookFavorited(book.id)
                    ? "text-white"
                    : "text-foreground hover:text-background"
                }`}
              />
            </button>
            <button
              className={`w-7 h-7 border transition-all duration-300 rounded flex items-center justify-center cursor-pointer ${
                isBookQueued(book.id)
                  ? "bg-blue-500 border-blue-500 hover:bg-blue-600"
                  : "border-foreground hover:bg-foreground"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleCLickQueBook(book);
              }}
            >
              <FaList className="text-foreground m-1 hover:text-background" />
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

          <div className="flex flex-col justify-between">
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
      <div className="w-full flex justify-center">
        <button
          className="cursor-pointer font-medium bg-foreground w-[20%] py-2 text-background text-center mb-4 rounded"
          onClick={handleOnclickLoadMore}
        >
          Load more
        </button>
      </div>
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
