import { getTranslations } from 'next-intl/server';

import { toBoolean } from '@/lib/utils/data.utils';
import { getFiles } from '@/server/actions/filesActions';
import FilesList from './_components/FilesList';
import FileUpload from './_components/FileUpload';

export default async function KnowledgeBasePage() {
  const t = await getTranslations();
  const files = await getFiles();
  const isUploadAvailable = toBoolean(process.env.KB_UPLOAD_ENABLED) ?? false;

  return (
    <div className="relative flex flex-grow flex-col gap-y-4 rounded-xl bg-white-opacity p-3.5">
      <div className="flex flex-col gap-y-1 py-1.5 ps-5">
        <p className="text-sm text-main">{t('KnowledgeBase.subTitile')}</p>
      </div>
      <div className="relative flex flex-grow flex-col gap-y-2">
        <FileUpload isUploadAvailable={isUploadAvailable} initialView={!files.length}>
          <FilesList files={files} />
        </FileUpload>
      </div>
    </div>
  );
}
