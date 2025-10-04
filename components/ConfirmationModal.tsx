"use client";

import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "warning":
        return {
          icon: "text-yellow-500",
          button: "bg-yellow-500 hover:bg-yellow-600",
        };
      default:
        return {
          icon: "text-accent",
          button: "bg-accent hover:bg-accent/50",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 "
        onClick={onClose}
      />

      <div className="relative bg-background rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className={`w-6 h-6 ${styles.icon}`} />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>

        {/* Message */}
        <p className="text-foreground/80 mb-6">{message}</p>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-foreground border border-foreground/20 rounded-md hover:bg-foreground/10 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-md transition-colors ${styles.button} cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
