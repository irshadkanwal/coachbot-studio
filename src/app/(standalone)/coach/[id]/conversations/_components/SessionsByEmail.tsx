'use client';

import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { AssistantChat, AssistantUser } from '@/lib/models/assistant.models';
import { debounce } from '@/lib/utils/debounce.utils';
import { getAssistantClientUsers } from '@/server/actions/assistantActions';
import { Input } from '@/shared/Input';
import { Spinner } from '@/shared/Loaders';

interface SessionsByEmailProps {
  assistantId: string;
  sessions?: AssistantChat[];
  onEmailSelect?: (email: string) => void;
}

export const SessionsByEmail = ({ assistantId, onEmailSelect }: SessionsByEmailProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<AssistantUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const findUsersByEmail = async (email?: string) => {
    try {
      setIsLoading(true);
      const response = await getAssistantClientUsers(assistantId, { needle: email?.trim() ?? undefined });
      setIsLoading(false);
      setUsers(response.users);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFindUsers = useCallback(
    debounce((email?: string) => {
      findUsersByEmail(email);
    }, 300),
    [assistantId]
  );

  useEffect(() => {
    debouncedFindUsers(searchQuery);
  }, [searchQuery, debouncedFindUsers]);

  useEffect(() => {
    findUsersByEmail();
  }, []);

  return (
    <div className="max-w-md flex-grow">
      <div className="relative">
        <div
          className={twMerge(
            'absolute bottom-[40px] left-0 z-10 w-full rounded-t-lg border-x border-t border-storm-gray bg-background px-3.5 pt-3.5',
            !isOpen && 'hidden'
          )}
        >
          <div className="mb-3 border-b border-gray-700 pb-3">
            <h3 className="sm font-medium text-storm-gray">All Sessions</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className={`duration-15 cursor-pointer py-1.5 hover:text-main`}
                onClick={() => {
                  onEmailSelect?.(user.email);
                  setValue(user.email);
                  setSearchQuery('');
                  setIsOpen(false);
                }}
              >
                <div className="font-mono text-sm text-storm-gray hover:text-main">{user.email}</div>
              </div>
            ))}
            {users.length === 0 && <div className="flex py-2 text-main">No sessions found</div>}
          </div>
        </div>

        <div className="relative">
          <i className="cbi-search absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            id="all-session-list"
            initialValue={value}
            value={value}
            name="all-session-list"
            type="text"
            className="flex-grow"
            placeholder="Enter email address..."
            inputClassName={twMerge(
              'px-10 bg-white-opacity  rounded-b-lg !border-t-none rounded-t-lg border-storm-gray placeholder:text-light-gray text-base',
              isOpen && 'rounded-t-none bg-background'
            )}
            onChange={(e) => {
              setSearchQuery(e.target.value.trim());
              setValue(e.target.value.trim());
              setIsOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            onBlur={() => {
              if (value === '') {
                onEmailSelect?.('');
              }
            }}
          />
          {isLoading && <Spinner className="absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 transform" />}
          {!isLoading && (
            <i
              className={twMerge(
                'cbi-arrow-down absolute right-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 rotate-180 transform cursor-pointer text-gray-400',
                isOpen && 'rotate-0'
              )}
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
