"use client";

import { createContext, useState, ReactNode } from "react";

interface volumeInfoInterface {
  title: string;
  authors?: string[];
  imageLinks?: {
    smallThumbnail: string;
    thumbnail: string;
  };
  description?: string;
}

export interface bookInterface {
  id: string;
  volumeInfo: volumeInfoInterface;
}

interface BookContextType {
  books: bookInterface[];
  setBooks: React.Dispatch<React.SetStateAction<bookInterface[]>>;
  loadMore: boolean;
  setLoadMore: (loadMore: boolean) => void;
}

export const BookContext = createContext<BookContextType | undefined>(
  undefined
);

export const BookProvider = ({
  children,
  initialBooks = [],
}: {
  children: ReactNode;
  initialBooks?: bookInterface[];
}) => {
  const [books, setBooks] = useState<bookInterface[]>(initialBooks);
  const [loadMore, setLoadMore] = useState<boolean>(false);

  return (
    <BookContext.Provider value={{ books, setBooks, loadMore, setLoadMore }}>
      {children}
    </BookContext.Provider>
  );
};
