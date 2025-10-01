"use client";

import { useContext, useEffect, useState } from "react";
import { fetchBooks } from "../lib/fetchBooks";
import { useDebounce } from "@uidotdev/usehooks";
import { BookContext } from "./BookProvider";

export default function SearchInbox() {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const context = useContext(BookContext);

  if (!context) {
    throw new Error("useContext must be used within a BookProvider");
  }

  const { setBooks } = context;

  const debouncedQuery = useDebounce<string>(query, 300);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === "") {
        setBooks([]);
        return;
      }
      setIsSearching(true);
      try {
        const data = await fetchBooks(query, "intitle");
        setBooks(data?.items || []);
        if (data.items?.length === 0) {
          console.log("No books found");
          return;
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setIsSearching(false);
      }
    };
    fetchData();
  }, [debouncedQuery]);

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
