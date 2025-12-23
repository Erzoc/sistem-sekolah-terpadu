'use client';

import { useEffect, useState } from 'react';
import { File, Trash2, Eye, Loader2 } from 'lucide-react';

interface KaldikFile {
  fileId: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: number;
  extractedData?: string;
}

interface Props {
  refresh?: boolean;
}

export function KaldikList({ refresh }: Props) {
  const [files, setFiles] = useState<KaldikFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/kaldik/list');
      if (res.ok) {
        const { files } = await res.json();
        setFiles(files);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Belum ada file Kaldik yang diunggah</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file.fileId}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <div className="flex-1">
            <p className="font-medium text-gray-800">{file.fileName}</p>
            <p className="text-xs text-gray-500">
              {new Date(file.createdAt).toLocaleDateString('id-ID')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                file.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : file.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : file.status === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {file.status === 'completed' && '✓ Selesai'}
              {file.status === 'processing' && '⏳ Proses...'}
              {file.status === 'failed' && '✗ Gagal'}
              {file.status === 'pending' && '◯ Menunggu'}
            </span>

            {file.status === 'completed' && (
              <button className="p-2 hover:bg-gray-200 rounded transition">
                <Eye className="w-4 h-4 text-blue-600" />
              </button>
            )}

            <button className="p-2 hover:bg-gray-200 rounded transition">
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
