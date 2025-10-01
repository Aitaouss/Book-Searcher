"use client";

import { createContext, useState, ReactNode } from "react";

interface BookContextType {
  books: any[];
  setBooks: (books: any[]) => void;
}

export const BookContext = createContext<BookContextType | undefined>(
  undefined
);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<any[]>([]);

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      {children}
    </BookContext.Provider>
  );
};
