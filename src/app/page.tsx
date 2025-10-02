import BookList from "../../components/BookList";
import SearchInbox from "../../components/SearchInbox";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center py-10">
      <div className="w-[800px] flex h-full flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-3xl font-semibold">Search For Your Book Now</h1>
          <SearchInbox />
        </div>
        <BookList />
      </div>
    </div>
  );
}
