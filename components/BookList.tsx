"use client";

import { BookContext } from "./BookProvider";
import { useContext } from "react";

export default function BookList() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useContext must be used within a BookProvider");
  }

  const { books } = context;

  if (books.length === 0) {
    return <div className="mt-4 text-center">No books found</div>;
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <div key={book.id} className="border p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">{book.title}</h2>
          <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
          <p className="text-sm text-gray-600">Year: {book.year}</p>
        </div>
      ))}
    </div>
  );
}
