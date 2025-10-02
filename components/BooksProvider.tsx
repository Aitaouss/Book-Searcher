"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { bookInterface } from "./BookProvider";
import { useLocalStorage } from "../hooks/useLocallStorage";

type BooksAction =
  | { type: "ADD_BOOK"; payload: bookInterface }
  | { type: "REMOVE_BOOK"; payload: string }; // payload is the book id

interface BooksContextType {
  favBooks: bookInterface[];
  dispatch: React.Dispatch<BooksAction>;
  addBook: (book: bookInterface) => void;
  removeBook: (bookId: string) => void;
  isBookFavorited: (bookId: string) => boolean;
}

function favBooksReducer(
  state: bookInterface[],
  action: BooksAction
): bookInterface[] {
  switch (action.type) {
    case "ADD_BOOK":
      if (state.some((book) => book.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];

    case "REMOVE_BOOK":
      return state.filter((book) => book.id !== action.payload);

    default:
      return state;
  }
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
}

export function BooksProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  const [storedFavBooks, setStoredFavBooks] = useLocalStorage<bookInterface[]>(
    "favorites",
    []
  );

  const [favBooks, dispatch] = useReducer(favBooksReducer, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && storedFavBooks && storedFavBooks.length > 0) {
      storedFavBooks.forEach((book) => {
        dispatch({ type: "ADD_BOOK", payload: book });
      });
    }
  }, [isClient, storedFavBooks]);

  useEffect(() => {
    if (isClient) {
      setStoredFavBooks(favBooks);
    }
  }, [favBooks, isClient, setStoredFavBooks]);

  const addBook = (book: bookInterface) => {
    dispatch({ type: "ADD_BOOK", payload: book });
  };

  const removeBook = (bookId: string) => {
    dispatch({ type: "REMOVE_BOOK", payload: bookId });
  };

  const isBookFavorited = (bookId: string): boolean => {
    return favBooks.some((book) => book.id === bookId);
  };

  const contextValue: BooksContextType = {
    favBooks,
    dispatch,
    addBook,
    removeBook,
    isBookFavorited,
  };

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
}
