"use client";

import { createContext, useState, ReactNode } from "react";

interface BookContextType {
  books: any[];
  setBooks: React.Dispatch<React.SetStateAction<any[]>>;
  loadMore: boolean;
  setLoadMore: (loadMore: boolean) => void;
}

export const BookContext = createContext<BookContextType | undefined>(
  undefined
);
export interface bookInterface {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      smallThumbnail: string;
      thumbnail: string;
    };
    description?: string;
  };
}
export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<bookInterface[]>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);

  return (
    <BookContext.Provider value={{ books, setBooks, loadMore, setLoadMore }}>
      {children}
    </BookContext.Provider>
  );
};
