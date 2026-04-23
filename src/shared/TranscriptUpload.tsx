'use client';

import { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FileRejection, useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

import type { AssistantChat } from '@/lib/models/assistant.models';
// import { uploadTranscript } from '@/server/actions/filesActions';
import { Button } from './Button';
import TranscriptUploadModal from './TranscriptUploadModal';

interface TranscriptUploadProps {
  assistantId: string;
  onUploadSuccess?: (fileId: string) => void;
  onUploadError?: (message: string) => void;
  className?: string;
  data: AssistantChat[];
  onLoadMore: () => Promise<void>;
  hasMore?: boolean;
  isLoading?: boolean;
}

type UploadFile = {
  content: File;
  id: string;
  name: string;
  status: 'uploading' | 'success' | 'error';
  message?: string;
};

enum UploadStatus {
  uploading = 'uploading',
  success = 'success',
  error = 'error',
}

const acceptedFileTypes = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
};

export const TranscriptDropZone = memo(function TranscriptDropZone({
  onBrowseClick,
  t,
  isDragActive,
}: {
  open: () => void;
  onBrowseClick: () => void;
  t: any;
  isDragActive: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={twMerge(
          'flex flex-1 items-center gap-x-4 rounded-xl p-4 transition-colors',
          'dashed-border',
          isDragActive && 'dashed-border-active'
        )}
      >
        <Image src="/images/document-upload.svg" alt="Upload" width={45} height={45} />

        {/* Text Content */}
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-main">{t('CoachDetails.Conversations.uploadSection.title')}</p>
          <p className="text-sm text-light-gray">{t('CoachDetails.Conversations.uploadSection.subtitle')}</p>
        </div>
      </div>

      {/* Browse Button - Outside dashed border */}
      <Button
        onClick={onBrowseClick}
        className="h-[-webkit-fill-available] w-3/12 rounded-xl bg-dark-aquamarine px-6 py-2 font-medium text-white hover:bg-dark-aquamarine/90"
      >
        {t('CoachDetails.Conversations.uploadSection.browseButton')}
      </Button>
    </div>
  );
});

export default function TranscriptUpload({
  assistantId,
  onUploadSuccess,
  onUploadError,
  className,
  data,
  onLoadMore,
  hasMore,
  isLoading,
}: TranscriptUploadProps) {
  const t = useTranslations();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectedFileObjects: UploadFile[] = rejectedFiles.map(({ file, errors }) => ({
        content: file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        status: UploadStatus.error,
        message: errors[0]?.message || 'Invalid file type or size',
      }));
      setFiles((prev) => [...prev, ...rejectedFileObjects]);
    }

    // Handle accepted files - show modal for first file
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  }, []);

  const handleBrowseClick = useCallback(() => {
    // Open file input programmatically
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx,.txt';
    input.multiple = false;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];
        if (!allowedTypes.includes(file.type)) {
          alert('Invalid file type. Only PDF, DOCX, and TXT files are allowed.');
          return;
        }
        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          alert('File size too large. Maximum size is 10MB.');
          return;
        }
        setSelectedFile(file);
        setIsModalOpen(true);
      }
    };
    input.click();
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const handleModalUpload = useCallback(
    async (data: { userEmail: string; conversationDate: string; userName?: string }) => {
      if (!selectedFile) {
        onUploadError?.('No file selected');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('assistantId', assistantId);
        formData.append('userEmail', data.userEmail);
        // formData.append('conversationDate', data.conversationDate);
        if (data.userName) {
          formData.append('userName', data.userName);
        }

        const response = await fetch('/api/transcript/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          onUploadSuccess?.(result.fileId!);
          // Clear selected file and close modal
          setSelectedFile(null);
          setIsModalOpen(false);
        } else {
          onUploadError?.(result.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
      }
    },
    [assistantId, onUploadSuccess, onUploadError, selectedFile]
  );

  return (
    <div className={twMerge('flex flex-col gap-y-3', className)}>
      <div {...getRootProps()} className="relative">
        <input {...getInputProps()} />
        <TranscriptDropZone open={open} onBrowseClick={handleBrowseClick} t={t} isDragActive={isDragActive} />
      </div>

      {/* Upload Progress - Positioned below the drop zone */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-x-3 rounded-lg bg-storm-gray px-3 py-2">
              <div className="flex items-center justify-center">
                <div
                  className={twMerge(
                    'size-8 rounded-full p-1',
                    file.status === UploadStatus.uploading && 'animate-spin bg-yellow-spinner',
                    file.status === UploadStatus.success && 'bg-green-500',
                    file.status === UploadStatus.error && 'bg-red-500'
                  )}
                >
                  <i
                    className={twMerge(
                      'cbi-document-upload text-sm text-white',
                      file.status === UploadStatus.error && 'cbi-close-circle'
                    )}
                  />
                </div>
              </div>

              <div className="min-w-0 flex-grow">
                <p className="truncate text-sm font-medium text-main">{file.name}</p>
                {file.status === UploadStatus.success && <p className="text-xs text-green-500">Upload successful</p>}
                {file.message && (
                  <p
                    className={twMerge(
                      'text-xs',
                      file.status === UploadStatus.error ? 'text-red-500' : 'text-green-500'
                    )}
                  >
                    {file.message}
                  </p>
                )}
              </div>

              {(file.status === UploadStatus.error || file.status === UploadStatus.success) && (
                <button
                  onClick={() => removeFile(file.id)}
                  className={twMerge(
                    'hover:opacity-70',
                    file.status === UploadStatus.error ? 'text-red-500' : 'text-green-500'
                  )}
                >
                  <i className="cbi-close-circle" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <TranscriptUploadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFile(null);
        }}
        onUpload={handleModalUpload}
        fileName={selectedFile?.name}
        fileSize={selectedFile?.size}
        data={data}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    </div>
  );
}
