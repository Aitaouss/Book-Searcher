"use client";

import { BookContext } from "./BookProvider";
import { useContext } from "react";
import { FaBookDead } from "react-icons/fa";
import Image from "next/image";
import { bookInterface } from "./BookProvider";

export default function BookList() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useContext must be used within a BookProvider");
  }

  const { books, loadMore, setLoadMore } = context;

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

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 w-full overflow-auto flex-1 bg-foreground/10 rounded-lg">
      {booksToRender.map((book) => (
        <div key={book.id} className="border p-4 rounded shadow flex gap-4">
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
              src={"https://i.ibb.co/5WvdCfCq/l-OGO-BOOK-SEARCH.png"}
              alt={book.volumeInfo.title}
              width={80}
              height={120}
              unoptimized
            />
          )}

          <div className="flex flex-col justify-between">
            <h2 className="text-foreground text-lg font-bold">
              {book.volumeInfo.title}
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
      <button
        className="w-full flex justify-center"
        onClick={handleOnclickLoadMore}
      >
        <h1 className="cursor-pointer font-medium bg-foreground w-[20%] py-2 text-background text-center mb-4 rounded">
          Load more
        </h1>
      </button>
    </div>
  );
}
