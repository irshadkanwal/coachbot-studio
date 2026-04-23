'use client';

import { memo, ReactNode, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileRejection, useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

import { ACCEPTED_FILE_TYPES } from '@/lib/constants';
import { filterArray } from '@/lib/utils/array.utils';
import { mapFiles } from '@/lib/utils/data.utils';
import { revalidateFilesTag, uploadFile } from '@/server/actions/filesActions';
import { Button } from '@/shared/Button';

type NewFile = {
  content: File;
  id: string;
  name: string;
  status?: string;
  message?: string;
};

enum Status {
  uploading = 'uploading',
  error = 'error',
}

export const DropZonePreview = memo(function MessageItem({
  open,
  t,
  onlyText,
}: {
  open: () => void;
  t: any;
  onlyText: boolean;
}) {
  return (
    <div
      className={twMerge(
        'absolute inset-0 z-10 mx-auto flex flex-grow flex-col items-center justify-center rounded-xl'
      )}
    >
      <div
        className={twMerge(
          'flex flex-col items-center justify-center gap-y-3 rounded-xl px-9 py-3',
          onlyText ? '' : 'border border-dashed border-storm-gray'
        )}
      >
        <span className="cbi-document-upload text-6xl text-main"></span>
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-main">{t('KnowledgeBase.dropzoneLabel')}</p>
          <p className="text-xs uppercase text-light-gray">
            {[...new Set(Object.values(ACCEPTED_FILE_TYPES).flat())].join(', ')}
          </p>
        </div>

        {!onlyText && (
          <>
            <p className="flex w-full items-center gap-2 text-main before:flex-grow before:border-b before:border-storm-gray before:content-[''] after:flex-grow after:border-b after:border-storm-gray after:content-['']">
              {t('KnowledgeBase.dropzoneDivider')}
            </p>
            <Button variant="solid" color="dark" onClick={open} className="hover:bg-main hover:text-background">
              {t('KnowledgeBase.browseButton')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
});

export default function FileUpload({
  initialView,
  children,
  isUploadAvailable,
}: {
  initialView: boolean;
  children: ReactNode;
  isUploadAvailable?: boolean;
}) {
  const t = useTranslations();
  const [files, setFiles] = useState<NewFile[]>([]);

  const handleFileUpload = useCallback(async (file: NewFile) => {
    const uploadedFileId = await uploadFile(file);

    setFiles((prev: NewFile[]) =>
      uploadedFileId
        ? filterArray(prev, uploadedFileId)
        : prev.map((f: NewFile) => (f.id === file.id ? { ...file, status: Status.error } : f))
    );
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiled: FileRejection[]) => {
      if (!isUploadAvailable) {
        return alert('This fuctional is not available yet.');
      }

      const newFiles: NewFile[] = mapFiles(acceptedFiles, Status.uploading);
      const unsuportedFiles = mapFiles(
        rejectedFiled.map(({ file }) => file),
        'error',
        'KnowledgeBase.errors.unsupportedFormat'
      );

      setFiles((prevFiles: NewFile[]) => [...prevFiles, ...newFiles, ...unsuportedFiles]);

      newFiles.forEach(handleFileUpload);
      await revalidateFilesTag();
    },
    [isUploadAvailable]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  const handleOpen = useCallback(() => {
    if (!isUploadAvailable) return alert('This functional is not available yet.');

    open();
  }, [isUploadAvailable]);

  return (
    <>
      <div
        className={twMerge(
          'relative z-0 flex min-h-64 w-full shrink-0 flex-grow flex-col gap-y-2 rounded-xl bg-graphic/[14%] p-3',
          isDragActive && 'z-20 bg-dark-aquamarine/[10%]'
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {(isDragActive || initialView) && <DropZonePreview t={t} open={handleOpen} onlyText={isDragActive} />}

        {children}

        <div className="sticky bottom-0 z-[11] ms-auto flex w-fit max-w-[40%] flex-col items-end justify-end gap-y-3">
          {!!files.length && (
            <ul className="absolute bottom-12 flex h-[60vh] w-max max-w-96 flex-grow flex-col-reverse gap-y-1 overflow-y-auto px-1 will-change-scroll">
              {files.map((file: NewFile, index: number) => (
                <li
                  key={`${file.name}-${index}`}
                  className="relative flex min-w-64 shrink-0 items-center gap-x-3 rounded-2xl bg-storm-gray px-3 py-2.5"
                >
                  {file.status === Status.error && (
                    <span
                      className="cbi-close-circle absolute right-0 top-2 -translate-x-[22%] px-1 text-light-gray"
                      onClick={() => setFiles((prev) => filterArray(prev, file.id))}
                    ></span>
                  )}
                  <div className="relative inline-flex items-center justify-center">
                    <span
                      className={twMerge(
                        "size-12 rounded-[50%] p-1 after:inline-block after:size-full after:rounded-[50%] after:bg-storm-gray after:content-['']",
                        file.status === Status.uploading && 'animate-spin bg-yellow-spinner'
                      )}
                    />
                    <i
                      className={twMerge(
                        'cbi-document-upload absolute text-main',
                        file.status === Status.error && '!text-2xl text-salmon'
                      )}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="line-clamp-3 break-words pe-3 text-base font-medium text-main">{file.name}</p>

                    {file.message && t.has(file.message) && <p className="text-xs text-salmon">{t(file.message)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!initialView && (
            <Button
              onClick={handleOpen}
              variant="solid"
              color="dark"
              className="sticky ms-auto self-end hover:bg-main hover:text-background"
            >
              <i className="cbi-paperclip" />
              {t('KnowledgeBase.addDocumentButton')}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
