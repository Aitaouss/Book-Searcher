"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaTrash, FaGripVertical } from "react-icons/fa";
import Image from "next/image";
import { bookInterface } from "../providers/BookProvider";

interface DraggableBookItemProps {
  book: bookInterface;
  index: number;
  onRemove: (bookId: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  type: "favorite" | "queue";
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function DraggableBookItem({
  book,
  index,
  onRemove,
  onMove,
  type,
}: DraggableBookItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: type,
    item: () => {
      return { id: book.id, index, type };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  drag(drop(ref));

  const accentColor = type === "favorite" ? "bg-red-500" : "bg-red-500";
  const hoverColor =
    type === "favorite" ? "hover:bg-red-600" : "hover:bg-red-600";

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={`border-t border-b p-4 shadow flex gap-4 relative bg-background/50 transition-all duration-200 ${
        isDragging ? "scale-105 shadow-lg" : ""
      }`}
    >
      {/* Drag Handle */}
      <div className="flex items-center justify-center cursor-grab active:cursor-grabbing">
        <FaGripVertical className="text-foreground/40 hover:text-foreground/60" />
      </div>

      {/* Remove Button */}
      <div className="absolute right-4 top-4">
        <button
          className={`w-7 h-7 border ${accentColor} border-foreground ${hoverColor} transition-all duration-300 rounded flex items-center justify-center cursor-pointer`}
          onClick={() => onRemove(book.id)}
          title={`Remove from ${type}s`}
        >
          <FaTrash className="m-1 text-white transition-colors duration-300" />
        </button>
      </div>

      {/* Book Image */}
      {book.volumeInfo.imageLinks?.thumbnail ? (
        <Image
          className="w-[80px] h-[120px] bg-red-300 rounded object-cover"
          src={book.volumeInfo.imageLinks?.thumbnail || ""}
          alt={book.volumeInfo.title}
          width={80}
          height={120}
          unoptimized
        />
      ) : (
        <Image
          className="w-[80px] h-[120px] bg-red-300 rounded object-cover"
          src={"https://i.ibb.co/5gQxn3PS/image.png"}
          alt={book.volumeInfo.title}
          width={80}
          height={120}
          unoptimized
        />
      )}

      {/* Book Details */}
      <div className="flex flex-col justify-between flex-1 pr-12">
        <h2 className="text-foreground text-lg font-bold">
          {book.volumeInfo.title && book.volumeInfo.title.length > 50
            ? book.volumeInfo.title.substring(0, 50) + "..."
            : book.volumeInfo.title}
        </h2>
        <p className="text-sm text-foreground">
          {book.volumeInfo.description
            ? book.volumeInfo.description.length > 100
              ? book.volumeInfo.description.substring(0, 100) + "..."
              : book.volumeInfo.description
            : "No description available."}
        </p>
        <p className="text-sm text-foreground mb-1 font-semibold">
          {book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "N/A"}
        </p>
      </div>
    </div>
  );
}
