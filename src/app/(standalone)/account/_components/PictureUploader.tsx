'use client';

import React, { ChangeEvent, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { uploadPicture } from '@/server/actions/filesActions';
import { Button } from '@/shared/Button';

type PictureUploaderProps = {
  children?: React.ReactNode;
  buttonVariant?: string;
  buttonColor?: string;
  buttonClassName?: string;
  onUploadSuccess?: (filePath?: string | null) => void;
};

const PictureUploader: React.FC<PictureUploaderProps> = ({
  children,
  buttonClassName,
  buttonColor,
  buttonVariant,
  onUploadSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      try {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
          console.error('[PictureUploader] Invalid file type. Only image files are allowed.');
          alert('Invalid file type. Only image files are allowed.');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          console.error('[PictureUploader] File size too large. Maximum size is 10MB.');
          alert('File size too large. Maximum size is 10MB.');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          return;
        }

        const location = await uploadPicture(file);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        if (location) {
          await onUploadSuccess?.(location);
          router.refresh();
        } else {
          console.error('[PictureUploader] Upload failed - no location returned');
        }
      } catch (error) {
        console.error('[PictureUploader] Error uploading picture:', error);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onUploadSuccess, router]
  );

  return (
    <div className="flex">
      <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />

      <Button
        variant={(buttonVariant as any) || 'solid'}
        color={(buttonColor as any) || 'gray'}
        className={twMerge('w-max text-sm', buttonClassName)}
        onClick={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
      >
        {children}
      </Button>
    </div>
  );
};

export default PictureUploader;
