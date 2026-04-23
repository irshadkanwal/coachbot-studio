import { memo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { Message } from '@/lib/models/chat.models';
import Markdown from '@/shared/Markdown';
import EditableMessage from './EditableMessage';

export const CreateAssistantMessage = memo(function MessageItem() {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-x-4">
      <span className="cbi-cpu h-full shrink-0 self-start text-xl text-main"></span>
      <div className="flex w-full flex-col items-start gap-y-2 self-start p-5 text-main">
        <p className="text-base text-main">{t('General.createAssistantMessage.title')}</p>
        <p className="text-base text-main">{t('General.createAssistantMessage.subTitle')}</p>
        <Link
          href={'/create-agent'}
          className="mt-3 py-2 text-base font-bold text-dark-aquamarine underline underline-offset-4"
        >
          {t('General.createAssistantMessage.modalLink')}
        </Link>
      </div>
    </div>
  );
});

export const EditableAssistantMessage = memo(EditableMessage);

export const MessageItem = memo(function MessageItem({ message }: { message: Message }) {
  const t = useTranslations();

  return (
    <>
      {message.role === 'user' && message.isLoading && (
        <p className="flex w-full items-center gap-x-2 self-start p-5 text-dark-aquamarine">
          <i className="cbi-cpu-empty animate-spin-and-pulse !text-3xl" />
          <span className="before:animate-text-sequence before:content-['']"></span>
        </p>
      )}
      {message.role === 'user' && (
        <article
          className={twMerge(
            'relative flex w-4/5 items-center gap-x-5 self-end rounded-2xl bg-dark-aquamarine/[11%] p-5 text-main'
          )}
        >
          <span className="cbi-send shrink-0 self-start text-xl"></span>
          <div className="flex flex-1 flex-col break-words text-base font-normal">
            <Markdown content={message.content} />
            {message.error && (
              <p className="absolute bottom-2 right-5 self-end text-sm text-salmon">{t('Common.messageErrorText')}</p>
            )}
          </div>
        </article>
      )}
      {message.role === 'assistant' && <EditableAssistantMessage message={message} />}
      {message.role === 'noAssistant' && <CreateAssistantMessage />}
    </>
  );
});

export default function Messages({ className, messages = [] }: { className?: string; messages?: Message[] }) {
  return (
    <div
      className={twMerge(
        'flex w-full flex-grow flex-col-reverse gap-y-1 self-end overflow-y-auto overflow-x-hidden p-2 ps-0 [&>article:first-child>div]:flex',
        className
      )}
    >
      {messages.map((message: Message, i: number) => (
        <MessageItem key={message.id + i} message={message} />
      ))}
    </div>
  );
}
