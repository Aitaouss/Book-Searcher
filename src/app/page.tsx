import BookList from "../../components/BookList";
import SearchInbox from "../../components/SearchInbox";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center py-10 px-10">
      <div className="w-[900px] flex h-full flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center">
          <SearchInbox />
        </div>
        <BookList />
      </div>
    </div>
  );
}
