"use client";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  warning?: string;
  confirmLabel: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmActionModal = ({
  isOpen,
  title,
  message,
  warning,
  confirmLabel,
  isPending,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) => {
  const t = useTranslations("organization");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-exford-blue">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-gray hover:text-exford-blue transition-colors"
            disabled={isPending}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-gray mb-4">{message}</p>
          {warning && (
            <p className="text-red-500 font-semibold">{warning}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-3 bg-gray-100 text-exford-blue rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {t("dissolveCancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <LoadingSpinner size="sm" />
                {t("processing")}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
