import BookList from "../../components/BookList";
import SearchInbox from "../../components/SearchInbox";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div>
        <h1 className="text-3xl font-semibold">Search For Your Book Now</h1>
        <SearchInbox />
        <BookList />
      </div>
    </div>
  );
}
