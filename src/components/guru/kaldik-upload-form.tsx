// src/components/guru/kaldik-upload-form.tsx
'use client';

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface UploadProgress {
  status: "idle" | "uploading" | "processing" | "completed" | "error";
  fileName: string;
  progress: number;
  error?: string;
}

interface Props {
  onSuccess?: () => void;
}

export function KaldikUploadForm({ onSuccess }: Props) {
  const { data: session } = useSession();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: "idle",
    fileName: "",
    progress: 0,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]; // ← ini yang benar
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadProgress({
        status: "error",
        fileName: file.name,
        progress: 0,
        error: "File terlalu besar. Maksimal 10MB",
      });
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setUploadProgress({
        status: "error",
        fileName: file.name,
        progress: 0,
        error: "Format file tidak didukung. Gunakan PDF, JPG, atau PNG",
      });
      return;
    }

    setUploadProgress({
      status: "uploading",
      fileName: file.name,
      progress: 30,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/kaldik/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.error ?? "Upload failed");
      }

      const { fileId } = await uploadRes.json();

      setUploadProgress({
        status: "processing",
        fileName: file.name,
        progress: 60,
      });

      const extractRes = await fetch("/api/kaldik/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });

      if (!extractRes.ok) {
        const err = await extractRes.json().catch(() => ({}));
        throw new Error(err.error ?? "Gagal mengekstrak data");
      }

      setUploadProgress({
        status: "completed",
        fileName: file.name,
        progress: 100,
      });

      setTimeout(() => {
        setUploadProgress({
          status: "idle",
          fileName: "",
          progress: 0,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onSuccess?.();
      }, 1500);
    } catch (error) {
      setUploadProgress({
        status: "error",
        fileName: file.name,
        progress: 0,
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat upload",
      });
    }
  };

  return (
    <div className="w-full max-w-xl">
      {/* status bar + UI sama seperti sebelumnya */}
      <label className="block cursor-pointer">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Unggah Kalender Pendidikan
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PDF, JPG, atau PNG (Max 10MB)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          disabled={
            uploadProgress.status === "uploading" ||
            uploadProgress.status === "processing"
          }
        />
      </label>
    </div>
  );
}
