import { KnowledgeFile, Prisma, Subscription, User } from '@prisma/client';

import prisma from '@/lib/prisma';

export async function getUserData(id: string): Promise<(User & { subscription: Subscription | null }) | null> {
  try {
    return prisma.user.findUnique({ where: { id }, include: { subscription: true } });
  } catch (error) {
    console.error(`[userClient] Error fetching user ${id}:`, error);

    return null;
  }
}

export async function createUser(newUserData: Partial<User>): Promise<User | null> {
  try {
    return await prisma.user.create({
      data: {
        ...newUserData,
        id: newUserData.id!,
      },
    });
  } catch (error) {
    console.error(`[userClient] Error during creating user ${newUserData.id}:`, error);
    return null;
  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  try {
    return prisma.user.update({ where: { id }, data });
  } catch (error) {
    console.error(`[userClient] Error during updating user ${id}:`, error);

    return null;
  }
}

export async function upsertUser(
  id: string,
  data: Partial<User>
): Promise<Prisma.UserGetPayload<{ include: { assistants: true; subscription: true } }> | null> {
  try {
    const user = await prisma.user.upsert({
      where: { id },
      update: { ...data },
      create: {
        ...data,
        id,
      },
      include: {
        assistants: {
          orderBy: {
            created_at: 'asc',
          },
        },
        subscription: true,
      },
    });

    return user;
  } catch (error) {
    console.error(`[userClient] Error during upsert user ${id}:`, error);

    return null;
  }
}

export async function deleteUserData(id: string) {
  try {
    const user = await prisma.user.delete({ where: { id } });

    return user;
  } catch (error) {
    console.error(`[userClient] Error during deleting user ${id}:`, error);

    return null;
  }
}

export const getUserFiles = async (id: string): Promise<KnowledgeFile[]> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        KnowledgeFile: {
          orderBy: {
            uploaded_at: 'desc',
          },
        },
      },
    });

    return (user as { KnowledgeFile?: KnowledgeFile[] } | null)?.KnowledgeFile || [];
  } catch (error) {
    console.error(`[userClient] Error fetching user ${id}:`, error);

    return [];
  }
};

export async function uploadUserFiles(
  data: Pick<KnowledgeFile, 'id' | 'name' | 'status' | 'location' | 'user_id' | 'fileType'>
): Promise<KnowledgeFile | null> {
  try {
    return prisma.knowledgeFile.create({ data });
  } catch (error) {
    console.error(`[userClient] Error during uploading user files:`, error);

    return null;
  }
}

export async function editUserFile(
  user_id: string,
  id: string,
  data: Partial<KnowledgeFile>
): Promise<KnowledgeFile | null> {
  try {
    return prisma.knowledgeFile.update({ where: { user_id, id }, data });
  } catch (error) {
    console.error(`[userClient] Error during editing user ${user_id} file ${id}:`, error);

    return null;
  }
}

export async function deleteUserFile(user_id: string, id: string): Promise<KnowledgeFile | null> {
  try {
    return prisma.knowledgeFile.delete({ where: { user_id, id } });
  } catch (error) {
    console.error(`[userClient] Error during deleting user ${user_id} file ${id}:`, error);

    return null;
  }
}

export async function getUserSubscription(customerId: string, subscriptionId?: string) {
  try {
    return prisma.subscription.findUnique({ where: { customerId, subscriptionId } });
  } catch (error) {
    console.error(`[userClient] Error get subscription for customer ${customerId}:`, error);

    return null;
  }
}

export async function createUserSubscription(
  userId: string,
  data: Pick<Subscription, 'customerId' | 'status'>
): Promise<Subscription | null> {
  try {
    return await prisma.subscription.create({ data: { ...data, userId } });
  } catch (error) {
    console.error(`[userClient] Error during creating user ${userId} subscription:`, error);

    return null;
  }
}

export async function updateUserSubscription(
  customerId: string,
  data: Partial<Subscription>
): Promise<Subscription | null> {
  try {
    return prisma.subscription.update({ where: { customerId }, data });
  } catch (error) {
    console.error(`[userClient] Error during updating customer ${customerId} subscription:`, error);

    return null;
  }
}

export async function deleteUserSubscription(
  customerId: string,
  subscriptionId?: string
): Promise<Subscription | null> {
  try {
    return prisma.subscription.delete({ where: { customerId, subscriptionId } });
  } catch (error) {
    console.error(`[userClient] Error during deleting customer ${customerId} subscription:`, error);

    return null;
  }
}
