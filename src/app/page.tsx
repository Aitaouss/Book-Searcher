import BookList from "../../components/BookList";
import SearchInbox from "../../components/SearchInbox";
import Link from "next/link";
import { FaHeart, FaList } from "react-icons/fa";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center py-4 sm:py-10 px-4 sm:px-10">
      <div className="w-full max-w-[900px] flex h-full flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center">
          {/* Navigation Buttons */}
          <div className="w-full flex justify-end mb-4 sm:mb-6 gap-2 sm:gap-4">
            <Link
              href="/favorites"
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
              title="View Favorites"
            >
              <FaHeart className="text-sm sm:text-base" />
              <span className="text-xs sm:text-sm font-medium">Favorites</span>
            </Link>
            <Link
              href="/queue"
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
              title="View Queue"
            >
              <FaList className="text-sm sm:text-base" />
              <span className="text-xs sm:text-sm font-medium">Queue</span>
            </Link>
          </div>

          <SearchInbox />
        </div>
        <BookList />
      </div>
    </div>
  );
}
