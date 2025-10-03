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
  | { type: "ADD_FAV_BOOK"; payload: bookInterface }
  | { type: "REMOVE_FAV_BOOK"; payload: string }
  | { type: "ADD_QUEUE_BOOK"; payload: bookInterface }
  | { type: "REMOVE_QUEUE_BOOK"; payload: string }
  | {
      type: "REORDER_FAV_BOOKS";
      payload: { dragIndex: number; hoverIndex: number };
    }
  | {
      type: "REORDER_QUEUE_BOOKS";
      payload: { dragIndex: number; hoverIndex: number };
    };

interface BooksContextType {
  favBooks: bookInterface[];
  queueBooks: bookInterface[];
  dispatch: React.Dispatch<BooksAction>;
  addBook: (book: bookInterface) => void;
  removeBook: (bookId: string) => void;
  addQueueBook: (book: bookInterface) => void;
  removeQueueBook: (bookId: string) => void;
  reorderFavBooks: (dragIndex: number, hoverIndex: number) => void;
  reorderQueueBooks: (dragIndex: number, hoverIndex: number) => void;
  isBookFavorited: (bookId: string) => boolean;
  isBookQueued: (bookId: string) => boolean;
}

function favBooksReducer(
  state: bookInterface[],
  action: BooksAction
): bookInterface[] {
  switch (action.type) {
    case "ADD_FAV_BOOK":
      if (state.some((book) => book.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];

    case "REMOVE_FAV_BOOK":
      return state.filter((book) => book.id !== action.payload);

    case "REORDER_FAV_BOOKS":
      const newFavBooks = [...state];
      const [draggedItem] = newFavBooks.splice(action.payload.dragIndex, 1);
      newFavBooks.splice(action.payload.hoverIndex, 0, draggedItem);
      return newFavBooks;

    default:
      return state;
  }
}

function queueBooksReducer(
  state: bookInterface[],
  action: BooksAction
): bookInterface[] {
  switch (action.type) {
    case "ADD_QUEUE_BOOK":
      if (state.some((book) => book.id === action.payload.id)) {
        return state;
      }
      return [...state, action.payload];

    case "REMOVE_QUEUE_BOOK":
      return state.filter((book) => book.id !== action.payload);

    case "REORDER_QUEUE_BOOKS":
      const newQueueBooks = [...state];
      const [draggedItem] = newQueueBooks.splice(action.payload.dragIndex, 1);
      newQueueBooks.splice(action.payload.hoverIndex, 0, draggedItem);
      return newQueueBooks;

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

  const [storedQueueBooks, setStoredQueueBooks] = useLocalStorage<
    bookInterface[]
  >("queue", []);

  const [favBooks, favDispatch] = useReducer(favBooksReducer, []);
  const [queueBooks, queueDispatch] = useReducer(queueBooksReducer, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && storedFavBooks && storedFavBooks.length > 0) {
      storedFavBooks.forEach((book) => {
        favDispatch({ type: "ADD_FAV_BOOK", payload: book });
      });
    }
  }, [isClient, storedFavBooks]);

  useEffect(() => {
    if (isClient && storedQueueBooks && storedQueueBooks.length > 0) {
      storedQueueBooks.forEach((book) => {
        queueDispatch({ type: "ADD_QUEUE_BOOK", payload: book });
      });
    }
  }, [isClient, storedQueueBooks]);

  useEffect(() => {
    if (isClient) {
      setStoredFavBooks(favBooks);
    }
  }, [favBooks, isClient, setStoredFavBooks]);

  useEffect(() => {
    if (isClient) {
      setStoredQueueBooks(queueBooks);
    }
  }, [queueBooks, isClient, setStoredQueueBooks]);

  const addBook = (book: bookInterface) => {
    favDispatch({ type: "ADD_FAV_BOOK", payload: book });
  };

  const removeBook = (bookId: string) => {
    favDispatch({ type: "REMOVE_FAV_BOOK", payload: bookId });
  };

  const addQueueBook = (book: bookInterface) => {
    queueDispatch({ type: "ADD_QUEUE_BOOK", payload: book });
  };

  const removeQueueBook = (bookId: string) => {
    queueDispatch({ type: "REMOVE_QUEUE_BOOK", payload: bookId });
  };

  const reorderFavBooks = (dragIndex: number, hoverIndex: number) => {
    favDispatch({
      type: "REORDER_FAV_BOOKS",
      payload: { dragIndex, hoverIndex },
    });
  };

  const reorderQueueBooks = (dragIndex: number, hoverIndex: number) => {
    queueDispatch({
      type: "REORDER_QUEUE_BOOKS",
      payload: { dragIndex, hoverIndex },
    });
  };

  const isBookFavorited = (bookId: string): boolean => {
    return favBooks.some((book) => book.id === bookId);
  };

  const isBookQueued = (bookId: string): boolean => {
    return queueBooks.some((book) => book.id === bookId);
  };

  const contextValue: BooksContextType = {
    favBooks,
    queueBooks,
    dispatch: favDispatch,
    addBook,
    removeBook,
    addQueueBook,
    removeQueueBook,
    reorderFavBooks,
    reorderQueueBooks,
    isBookFavorited,
    isBookQueued,
  };

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
}
