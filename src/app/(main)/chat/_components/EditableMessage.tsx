'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Message } from '@/lib/models/chat.models';
import { toBoolean } from '@/lib/utils/data.utils';
import { editMessage } from '@/server/actions/messagesAction';
import { Button } from '@/shared/Button';
import Markdown from '@/shared/Markdown';

export default function EditableMessage({ message }: { message: Message }) {
  const t = useTranslations();
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(message.content);

  const handleSaveMessage = useCallback(
    async (reset?: boolean) => {
      const { id, content, originalContent } = message;
      const payload = reset
        ? { content: originalContent || content, originalContent: null }
        : { content: updatedContent, originalContent: originalContent || content };

      const updatedMessage = await editMessage(id, payload);
      updatedMessage?.content && setUpdatedContent(updatedMessage.content);
      setIsEditMode(false);
    },
    [updatedContent, message]
  );

  return (
    <article className={twMerge('group relative mb-5 flex flex-col', isEditMode && 'gap-y-1')}>
      <section
        className={twMerge(
          'flex w-full items-center gap-x-4 self-start p-5 text-main',
          isEditMode && 'rounded-xl border border-dashed border-storm-gray bg-white-opacity'
        )}
      >
        <span className="cbi-cpu shrink-0 text-xl text-main"></span>
        <div className="flex flex-1 flex-col break-words text-base font-normal outline-none">
          <Markdown content={updatedContent} isEditMode={isEditMode} onChange={setUpdatedContent} />
        </div>
      </section>
      {toBoolean(process.env.NEXT_PUBLIC_MESSAGE_EDIT_ENABLED) && (
        <div className={twMerge('justify-end gap-x-2', isEditMode ? 'flex' : 'hidden group-hover:flex')}>
          {isEditMode ? (
            <>
              <Button
                variant="solid"
                color="dark"
                className={'py-1.5 font-medium disabled:opacity-60'}
                onClick={() => handleSaveMessage(true)}
              >
                <i className="cbi-arrow-left" />
                {t('General.resetToOriginButton')}
              </Button>
              <Button
                variant="outline"
                color="darkGray"
                className={'py-1.5 font-medium'}
                onClick={() => setIsEditMode(false)}
              >
                {t('General.cancelButton')}
              </Button>
              <Button
                variant="solid"
                color="primary"
                className={'py-1.5 font-medium'}
                onClick={() => handleSaveMessage()}
              >
                <i className="cbi-tick-circle" />
                {t('General.saveButton')}
              </Button>
            </>
          ) : (
            <Button
              className={
                'cbi-edit-2 absolute -bottom-1.5 right-5 aspect-square w-7 rounded-full border border-background-border/[18%] bg-graphic/[10%] p-0 !text-sm text-light-gray hover:border-background-border group-hover:text-main'
              }
              onClick={() => setIsEditMode(true)}
            />
          )}
        </div>
      )}
    </article>
  );
}
