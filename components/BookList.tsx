"use client";

import { BookContext } from "../providers/BookProvider";
import { useContext } from "react";
import { FaBookDead } from "react-icons/fa";
import dynamic from "next/dynamic";

// Dynamically import the client component with no SSR
const BookListClient = dynamic(() => import("./BookListClient"), {
  ssr: false,
  loading: () => (
    <div className="mt-4 flex items-center justify-center text-center flex-1 bg-foreground/10 w-full rounded-lg">
      <div className="animate-pulse flex items-center justify-center gap-2 p-8">
        <div className="text-lg text-foreground">Loading books...</div>
      </div>
    </div>
  ),
});

export default function BookList() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useContext must be used within a BookProvider");
  }

  const { books } = context;

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

  return <BookListClient />;
}
