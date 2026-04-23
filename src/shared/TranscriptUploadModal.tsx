'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { AssistantChat } from '@/lib/models/assistant.models';
import { Button } from './Button';
import { Input } from './Input';
import { Spinner } from './Loaders';
import { Modal } from './Modal';

interface TranscriptUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: { userEmail: string; conversationDate: string; userName?: string }) => void;
  fileName?: string;
  fileSize?: number;
  data: AssistantChat[];
  onLoadMore: () => Promise<void>;
  hasMore?: boolean;
  isLoading?: boolean;
}

export default function TranscriptUploadModal({
  isOpen,
  onClose,
  onUpload,
  fileName,
  data,
  onLoadMore,
  hasMore,
  isLoading,
}: TranscriptUploadModalProps) {
  const t = useTranslations();
  const [userEmail, setUserEmail] = useState('');
  const [conversationDate, setConversationDate] = useState(new Date().toISOString().split('T')[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const { ref: loadMoreRef } = useInfiniteScroll(onLoadMore ?? (() => {}), {
    enabled: !!hasMore,
  });

  const emailInputRef = useRef<HTMLInputElement>(null);

  const emailSuggestions = useMemo(() => {
    return data.reduce<string[]>((acc, item) => {
      if (!item.userEmail || acc.includes(item.userEmail)) return acc;
      return [...acc, item.userEmail];
    }, []);
  }, [data]);

  useEffect(() => {
    const emailInput = emailInputRef.current;
    if (emailInput) {
      const handleFocus = () => {
        setShowEmailDropdown(true);
      };
      const handleBlur = (e: FocusEvent) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget && relatedTarget.closest('.email-dropdown')) {
          return;
        }
        setTimeout(() => setShowEmailDropdown(false), 150);
      };
      const handleInput = () => {
        setShowEmailDropdown(true);
      };

      emailInput.addEventListener('focus', handleFocus);
      emailInput.addEventListener('blur', handleBlur);
      emailInput.addEventListener('input', handleInput);

      return () => {
        emailInput.removeEventListener('focus', handleFocus);
        emailInput.removeEventListener('blur', handleBlur);
        emailInput.removeEventListener('input', handleInput);
      };
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showEmailDropdown && !target.closest('.email-dropdown') && !target.closest('.email-input-container')) {
        setShowEmailDropdown(false);
      }
    };

    if (showEmailDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmailDropdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    setIsUploading(true);

    try {
      await onUpload({
        userEmail: userEmail.trim(),
        conversationDate,
      });

      onClose();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      variant="default"
      titleKey="CoachDetails.Conversations.uploadModal.title"
      className="max-w-2xl"
      showButtons={false}
      titleClass="text-dark-aquamarine text-lg font-semibold uppercase flex items-center gap-2"
      titleIcon="cbi-document"
      closeModal={onClose}
    >
      <div className="p-4">
        {/* File Info - Horizontal Layout */}
        {fileName && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-storm-gray p-3">
            <div className="flex items-center gap-2">
              <i className="cbi-document text-dark-aquamarine"></i>
              <span className="font-medium text-main">{fileName}</span>
            </div>
            <div className="text-sm text-light-gray">
              {new Date(conversationDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Instructions */}
          <p className="text-sm text-light-gray">{t('CoachDetails.Conversations.uploadModal.instructions')}</p>

          {/* Email and Date Inputs - Same Row */}
          <div className="flex gap-3">
            {/* Email Input */}
            <div className="email-input-container relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray">
                <i className="cbi-search text-sm"></i>
              </div>
              <Input
                ref={emailInputRef}
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder={t('CoachDetails.Conversations.uploadModal.emailPlaceholder')}
                required
                className="w-full pl-10 pr-10"
                autoComplete="off"
                onFocus={() => setShowEmailDropdown(!showEmailDropdown)}
              />
              {/* <button
                type="button"
                onClick={() => setShowEmailDropdown(!showEmailDropdown)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-light-gray hover:text-main"
              >
                <i className="cbi-chevron-down text-sm"></i>
              </button> */}

              {/* Email Dropdown */}
              {showEmailDropdown && (
                <div className="email-dropdown absolute left-0 right-0 top-full z-50 mt-1 max-h-24 overflow-y-auto rounded-lg border border-storm-gray bg-background shadow-xl">
                  {emailSuggestions.map((email, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setUserEmail(email);
                        setShowEmailDropdown(false);
                        emailInputRef.current?.focus();
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-main transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg hover:bg-dark-aquamarine/20"
                    >
                      <div className="flex items-center gap-2">
                        <i className="cbi-user text-xs text-light-gray"></i>
                        <span>{email}</span>
                      </div>
                    </button>
                  ))}
                  {hasMore && (
                    <div ref={loadMoreRef} className="flex justify-center py-4">
                      {isLoading ? <Spinner withText={true} text="Loading more users..." /> : <div className="h-4" />}
                    </div>
                  )}
                  {emailSuggestions.filter((email) => email.toLowerCase().includes(userEmail.toLowerCase())).length ===
                    0 && (
                    <div className="px-3 py-2 text-sm text-light-gray">
                      <div className="flex items-center gap-2">
                        <i className="cbi-search text-xs"></i>
                        <span>No suggestions found</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Date Input */}
            <div className="relative flex-1">
              <Input
                id="conversationDate"
                type="date"
                value={conversationDate}
                onChange={(e) => setConversationDate(e.target.value)}
                className="w-full pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-light-gray">
                <i className="cbi-calendar text-sm"></i>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="solid"
              className="bg-dark-aquamarine text-white hover:bg-dark-aquamarine/90"
              disabled={isUploading || !userEmail.trim()}
            >
              {isUploading ? (
                <>
                  <i className="cbi-loading mr-2 animate-spin"></i>
                  {t('CoachDetails.Conversations.uploadModal.uploading')}
                </>
              ) : (
                t('CoachDetails.Conversations.uploadModal.uploadButton')
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
