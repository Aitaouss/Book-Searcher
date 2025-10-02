"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { fetchBooks } from "../lib/fetchBooks";
import { useDebounce } from "@uidotdev/usehooks";
import { BookContext } from "./BookProvider";

export default function SearchInbox() {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>("harry");
  const refQuery = useRef<boolean>(true);

  const context = useContext(BookContext);

  if (!context) {
    throw new Error("useContext must be used within a BookProvider");
  }

  const { books, setBooks, loadMore, setLoadMore } = context;

  const debouncedQuery = useDebounce<string>(query, 300);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(0); // Reset page when query changes
  };

  // Effect for new searches (when query changes)
  useEffect(() => {
    if (refQuery.current) {
      refQuery.current = false;
      return;
    }
    console.log("New search effect triggered");
    const fetchData = async () => {
      if (debouncedQuery.trim() === "") {
        setBooks([]);
        return;
      }
      setIsSearching(true);
      try {
        const data = await fetchBooks(debouncedQuery, "intitle", 0, 10);
        setBooks(data?.items || []);
        setCurrentSearchQuery(debouncedQuery);
        setPage(1);

        if (data?.items) {
          console.log("Books fetched:", data.items[0].volumeInfo.title);
        }
        if (data.items?.length === 0) {
          console.log("No books found");
          return;
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
        setPage(0);
      } finally {
        setIsSearching(false);
      }
    };
    fetchData();
  }, [debouncedQuery]);

  // Effect for load more (when loadMore flag changes)
  useEffect(() => {
    if (!loadMore) return;

    const fetchMoreData = async () => {
      if (currentSearchQuery.trim() === "") return;

      setIsSearching(true);
      try {
        const data = await fetchBooks(currentSearchQuery, "intitle", page, 10);

        const newBooks = data?.items || [];
        const existingIds = new Set(books.map((book: any) => book.id));
        const filteredNewBooks = newBooks.filter(
          (book: any) => !existingIds.has(book.id)
        );

        setBooks((prev) => [...prev, ...filteredNewBooks]);
        setPage((prev) => prev + 1);
      } catch (error) {
        console.error("Error fetching more books:", error);
      } finally {
        setIsSearching(false);
        setLoadMore(false);
      }
    };
    fetchMoreData();
  }, [loadMore]);
  return (
    <div className="mt-4 w-full flex items-center justify-center gap-3 h-full">
      <input
        type="text"
        placeholder="Search..."
        className=" p-2 border border-foreground rounded-md w-full"
        value={query}
        onChange={handleChange}
      />
      <button className="bg-foreground p-2 text-background rounded w-auto cursor-pointer">
        {isSearching ? "..." : "Search"}
      </button>
    </div>
  );
}
