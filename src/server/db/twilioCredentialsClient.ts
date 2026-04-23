'use server';

import { unstable_cache } from 'next/cache';
import { TwilioCredentials } from '@prisma/client';

import { twilioConfig } from '@/lib/config/twilio.config';
import prisma from '@/lib/prisma';
import { decrypt } from '@/lib/utils/encryption.utils';

export const getTwilioCredentialsByAssistantId = unstable_cache(
  async (assistantId: string): Promise<TwilioCredentials | null> => {
    try {
      const credentials = await prisma.twilioCredentials.findUnique({
        where: { assistantId, isActive: true },
        include: { assistant: false }, // Don't need full assistant data for this query
      });

      if (!credentials) {
        return null;
      }

      // Decrypt the auth token before returning
      const encryptionKey = twilioConfig.getEncryptionKey();
      const decryptedAuthToken = await decrypt<{ authToken: string }>(credentials.authToken, encryptionKey);

      return {
        ...credentials,
        authToken: decryptedAuthToken?.authToken || credentials.authToken,
      };
    } catch (error) {
      console.error(`[twilioCredentialsClient] Error fetching credentials for assistant ${assistantId}:`, error);
      return null;
    }
  },
  ['twilioCredentials'],
  twilioConfig.getCacheConfig()
);
