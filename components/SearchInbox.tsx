"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { fetchBooks } from "../lib/fetchBooks";
import { useDebounce } from "@uidotdev/usehooks";
import { BookContext } from "./BookProvider";

export default function SearchInbox() {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(0);

  const context = useContext(BookContext);

  if (!context) {
    throw new Error("useContext must be used within a BookProvider");
  }

  const { books, setBooks, loadMore, setLoadMore } = context;

  const debouncedQuery = useDebounce<string>(query, 300);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(0);
  };

  // Effect for new searches (when query changes)
  useEffect(() => {
    console.log("New search effect triggered");
    const fetchData = async () => {
      if (debouncedQuery.trim() === "") {
        setBooks([]);
        setPage(0);
        return;
      }
      setIsSearching(true);
      try {
        const data = await fetchBooks(debouncedQuery, "intitle", 0, 10);
        setBooks(data?.items || []);

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
    if (!loadMore) return; // Only run when loadMore is true

    const fetchMoreData = async () => {
      if (query.trim() === "") return;

      setIsSearching(true);
      try {
        const data = await fetchBooks(query, "intitle", page, 10);
        setBooks((prev) => [...prev, ...(data?.items || [])]);
        setPage((prev) => prev + 1);

        if (data?.items) {
          console.log("More books fetched:", data.items[0].volumeInfo.title);
        }
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
