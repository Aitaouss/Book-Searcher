import ReactDOM from "react-dom";
import { bookInterface } from "../providers/BookProvider";
import Image from "next/image";

export function BookModal({
  book,
  onClose,
}: {
  book: bookInterface;
  onClose: () => void;
}) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative ">
        <button
          className="absolute top-2 right-2 text-lg font-bold text-background cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        <Image
          className="w-full h-64 bg-red-300 rounded object-fill mb-4"
          src={
            book.volumeInfo.imageLinks?.thumbnail ||
            "https://i.ibb.co/5gQxn3PS/image.png"
          }
          alt={book.volumeInfo.title}
          width={300}
          height={400}
          unoptimized
        />
        <div className="overflow-y-auto h-[300px]">
          <h2 className="text-xl font-bold mb-2 text-background">
            {book.volumeInfo.title}
          </h2>
          <p className="mb-2 text-background">
            {book.volumeInfo.description || "No description available."}
          </p>
          <p className="font-semibold text-background">
            {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
