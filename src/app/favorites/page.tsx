"use client";

import { useBooks } from "../../../components/BooksProvider";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { DraggableBookItem } from "../../../components/DraggableBookItem";
import { FaBookDead, FaTrash, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function FavoritesPage() {
  const { favBooks, removeBook, reorderFavBooks } = useBooks();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleRemoveFromFavorites = (bookId: string) => {
    setBookToDelete(bookId);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (bookToDelete) {
      removeBook(bookToDelete);
      setBookToDelete(null);
    }
  };

  const handleMove = (dragIndex: number, hoverIndex: number) => {
    reorderFavBooks(dragIndex, hoverIndex);
  };

  return (
    <div className="h-screen flex items-center justify-center py-10 px-10">
      <div className="w-[900px] flex h-full flex-col">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span>Back to Search</span>
            </Link>
          </div>
          <h1 className="text-foreground text-3xl font-bold">
            My Favorite Books
          </h1>
          <div className="flex items-center gap-2 text-foreground">
            <FaTrash className="text-accent" />
            <span>{favBooks.length} books</span>
          </div>
        </div>

        {/* Books List */}
        {favBooks.length === 0 ? (
          <div className="flex items-center justify-center flex-1 bg-foreground/10 w-full rounded-lg">
            <div className="animate-bounce flex items-center justify-center gap-2">
              <FaBookDead className="text-lg text-foreground" />
              <h2 className="text-foreground">No favorite books yet</h2>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 w-full overflow-auto flex-1 bg-foreground/10 rounded-lg py-4 custom-scrollbar">
            {favBooks.map((book, index) => (
              <DraggableBookItem
                key={book.id}
                book={book}
                index={index}
                onRemove={handleRemoveFromFavorites}
                onMove={handleMove}
                type="favorite"
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setBookToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Remove from Favorites"
        message="Are you sure you want to remove this book from your favorites? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}
