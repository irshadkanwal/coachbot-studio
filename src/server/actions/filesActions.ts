'use server';

import { revalidateTag } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

import eventEmitter from '@/lib/eventEmitter';
import { FileStatus, FileType, KnowledgeFile } from '@/lib/models/common.models';
import prisma from '@/lib/prisma';
import { deleteGcpStorageFile, getGcpStorageSignedUrl, getSignedUrlForUpload } from '../db/gcpClient';
import { deleteUserFile, editUserFile, getUserFiles, updateUser, uploadUserFiles } from '../db/userClient';
import { getSessionUser } from './sessionActions';

export const uploadFileToGCP = async (
  userId: string,
  { file, name }: { file: File; name: string },
  bucketName?: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    const fileName = `${userId}/${name}`;
    const bucket = bucketName || process.env.GCP_KB_BUCKET_NAME || '';

    if (!bucket) {
      console.error('[uploadFileToGCP] No bucket name provided');
      return null;
    }

    try {
      const { url, fields } = await getSignedUrlForUpload(fileName, file.type, bucket);
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      const response = await fetch(url, { method: 'POST', body: formData });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[uploadFileToGCP] Failed to upload file: ${response.status} ${response.statusText}`, errorText);

        // If it's a permission error, return null to show the exact error
        if (response.status === 403 || response.status === 400) {
          console.error(`[uploadFileToGCP] Permission denied: ${response.status} ${response.statusText}`);
          return null;
        }

        return null;
      }

      return `${bucket}/${fileName}`;
    } catch (gcpError) {
      console.error(`[uploadFileToGCP] GCP upload failed:`, gcpError);
      return null;
    }
  } catch (error) {
    console.error(`[fileActions] Error uploading user ${userId} file "${file.name}":`, error);
    return null;
  }
};

export async function getFiles(): Promise<KnowledgeFile[]> {
  let userId;
  try {
    userId = await getSessionUser();

    return getUserFiles(userId || '');
  } catch (error) {
    console.error(`[filesActions] Error fetching user ${userId} files`, error);

    return [];
  }
}

export async function uploadFile({ id, content }: { id: string; content: File }): Promise<string | null> {
  let user_id: string | undefined;
  try {
    user_id = (await getSessionUser()) || '';

    if (!user_id) {
      console.error('[filesActions] User not authenticated');
      return null;
    }

    const fileId = uuidv4();
    const location = await uploadFileToGCP(user_id || '', { file: content, name: fileId });
    const uploadedFile = await uploadUserFiles({
      id: fileId,
      name: content.name,
      status: FileStatus.processing,
      location,
      user_id,
      fileType: FileType.knowledge,
    });

    eventEmitter.emit(`message:${user_id}`, { user_id, event: 'fileUploaded', data: uploadedFile });
    return id;
  } catch (error) {
    console.error(`[filesActions] Error updating account data for user ${user_id}`, error);

    return null;
  }
}

export async function revalidateFilesTag() {
  revalidateTag('files');
}

export async function editFile(
  id: string,
  data: Partial<KnowledgeFile>,
  user_id?: string
): Promise<KnowledgeFile | null> {
  let userId;
  try {
    userId = user_id || (await getSessionUser());

    if (!userId) {
      console.error('[filesActions] User not authenticated');
      return null;
    }

    const editedFile = await editUserFile(userId, id, data);
    revalidateTag('files');

    return editedFile;
  } catch (error) {
    console.error(`[filesActions] Error updating user ${userId} file ${id}`, error);
    return null;
  }
}

export async function deleteFile(file: KnowledgeFile): Promise<void> {
  let userId;
  try {
    userId = await getSessionUser();

    if (!userId) {
      return console.error('[filesActions] User not authenticated');
    }

    if (!file.location) {
      return console.error('[filesActions] File name or bucket is not set!');
    }

    const filename = file.location.replace(`${process.env.GCP_KB_BUCKET_NAME}/` || '', '');

    await deleteGcpStorageFile(process.env.GCP_KB_BUCKET_NAME || '', filename);
    await deleteUserFile(userId, file.id);
    revalidateTag('files');
  } catch (error) {
    console.error(`[filesActions] Error deleting user ${userId} file ${file.id}`, error);
  }
}

export async function getFileLink(file: KnowledgeFile): Promise<string | null> {
  let userId;
  try {
    userId = await getSessionUser();

    if (!userId) {
      console.error('[filesActions] User not authenticated');
      return null;
    }

    if (!file.location || !process.env.GCP_KB_BUCKET_NAME) {
      console.error('[filesActions] File name or bucket is not set!');
      return null;
    }

    const filename = file.location.replace(`${process.env.GCP_KB_BUCKET_NAME}/` || '', '');

    return getGcpStorageSignedUrl(filename, process.env.GCP_KB_BUCKET_NAME || '', file.name);
  } catch (error) {
    console.error(`[filesActions] Error getting link for user ${userId} file ${file.id}`, error);
    return null;
  }
}

export async function uploadPicture(file: File): Promise<string | null> {
  let user_id: string | undefined;
  try {
    user_id = (await getSessionUser()) || '';

    if (!user_id) {
      console.error('[filesActions] User not authenticated');
      return null;
    }

    const extension = file.name.slice(file.name.lastIndexOf('.'));
    const name = `profile-avatar-${new Date().getTime()}${extension.toLowerCase()}`;
    const location = await uploadFileToGCP(user_id || '', { file, name }, process.env.GCP_MEDIA_BUCKET_NAME);
    location && (await updateUser(user_id, { pictureUrl: location }));

    return location || '';
  } catch (error) {
    console.error(`[filesActions] Error uploading account picture for user ${user_id}`, error);

    return null;
  }
}

export async function uploadTranscript(
  file: File,
  assistantId: string,
  options?: {
    userEmail: string;
    conversationDate: string;
    userName?: string;
  }
): Promise<{ success: boolean; message?: string; fileId?: string; chatId?: string }> {
  let user_id: string | undefined;
  try {
    user_id = (await getSessionUser()) || '';

    if (!user_id) {
      console.error('[filesActions] User not authenticated');
      return { success: false, message: 'User not authenticated' };
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, message: 'Invalid file type. Only PDF, DOCX, and TXT files are allowed.' };
    }

    // Validate assistant ID
    if (!assistantId || assistantId.trim() === '') {
      return { success: false, message: 'Assistant ID is required.' };
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, message: 'File size too large. Maximum size is 10MB.' };
    }

    const fileId = uuidv4();
    const timestamp = new Date().getTime();
    const extension = file.name.slice(file.name.lastIndexOf('.'));
    const fileName = `transcripts/${assistantId}/${user_id}/${timestamp}-${fileId}${extension}`;

    const location = await uploadFileToGCP(user_id, { file, name: fileName }, process.env.GCP_TRANSCRIPT_BUCKET_NAME);

    if (!location) {
      console.error('[uploadTranscript] File upload failed, bucket:', process.env.GCP_TRANSCRIPT_BUCKET_NAME);
      return { success: false, message: 'Failed to upload file to storage. Please check your configuration.' };
    }

    // Store transcript metadata in database
    const transcriptFile = await uploadUserFiles({
      id: fileId,
      name: file.name,
      status: FileStatus.processing,
      location,
      user_id,
      fileType: 'transcript',
    });

    if (!transcriptFile) {
      return { success: false, message: 'Failed to save file metadata' };
    }

    // Create conversation record if options are provided
    let chatId: string | undefined;
    if (options) {
      try {
        // Find or create user by email
        let targetUserId = user_id;
        if (options.userEmail) {
          const existingUser = await prisma.user.findFirst({
            where: { email: options.userEmail },
            select: { id: true },
          });

          if (existingUser) {
            targetUserId = existingUser.id;
          } else {
            // Create a new user for the email
            const newUser = await prisma.user.create({
              data: {
                id: uuidv4(),
                email: options.userEmail,
                name: options.userName || 'Live Conversation User',
                accessAllowed: true,
                onboardingPassed: false,
              },
            });
            targetUserId = newUser.id;
          }
        }

        // Create conversation record
        const conversationDate = new Date();
        const chat = await prisma.chat.create({
          data: {
            name: options.userName || 'Live Conversation',
            userId: targetUserId,
            assistantId: assistantId,
            created_at: conversationDate,
            currentStage: 'transcript_uploaded',
            sessionSummary: {
              type: 'transcript_upload',
              fileName: file.name,
              fileId: fileId,
              uploadedAt: new Date().toISOString(),
            },
          },
        });

        chatId = chat.id;

        // Create a message indicating this is an uploaded transcript
        await prisma.message.create({
          data: {
            content: `Transcript uploaded: ${file.name}`,
            role: 'system',
            chatId: chat.id,
            type: 'transcript_upload',
            created_at: conversationDate,
          },
        });

        // Invalidate cache for conversations and chats
        revalidateTag('chats');
        revalidateTag('assistant-chats');
      } catch (conversationError) {
        console.error('[filesActions] Error creating conversation record:', conversationError);
        // Don't fail the upload if conversation creation fails
      }
    }

    // Emit event for real-time updates
    eventEmitter.emit(`message:${user_id}`, {
      user_id,
      event: 'transcriptUploaded',
      data: { fileId, assistantId, fileName: file.name, chatId },
    });

    return { success: true, fileId, chatId };
  } catch (error) {
    console.error(`[filesActions] Error uploading transcript for user ${user_id}`, error);
    return { success: false, message: 'An unexpected error occurred during upload' };
  }
}
