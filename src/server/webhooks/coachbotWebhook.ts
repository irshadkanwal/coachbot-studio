/**
 * CoachBot Webhook Service
 *
 * Handles sending notifications to CoachBot when assistants are deleted or updated in Studio
 */

import { TIMEOUTS } from '@/lib/constants/pagination';

type WebhookAction = 'delete' | 'update';

interface WebhookPayload {
  assistantId: string;
  action: WebhookAction;
  timestamp?: string;
}

const COACHBOT_WEBHOOK_URL = process.env.COACHBOT_BASE_URL;

/**
 * Sends a webhook notification to CoachBot
 * @param payload - The webhook payload containing assistant ID and action
 * @returns Promise<boolean> - Returns true if webhook was sent successfully
 */
export async function notifyCoachBot(payload: WebhookPayload): Promise<boolean> {
  if (!COACHBOT_WEBHOOK_URL) {
    console.warn('[CoachBot Webhook] Missing COACHBOT_BASE_URL environment variable');
    return false;
  }

  try {
    const webhookUrl = `${COACHBOT_WEBHOOK_URL}/api/assistant/sync`;
    const webhookPayload = {
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString(),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.WEBHOOK);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[CoachBot Webhook] Failed to send webhook: ${response.status} ${errorText}`);
      return false;
    }

    await response.json();
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error && error.name === 'AbortError'
        ? 'Webhook request timed out'
        : error instanceof Error
          ? error.message
          : 'Unknown error';
    console.error(`[CoachBot Webhook] Error sending webhook: ${errorMessage}`);
    return false;
  }
}

/**
 * Notifies CoachBot when an assistant is deleted
 * @param assistantId - The ID of the deleted assistant
 */
export async function notifyAssistantDeletion(assistantId: string): Promise<void> {
  await notifyCoachBot({
    assistantId,
    action: 'delete',
  });
}

/**
 * Notifies CoachBot when an assistant is updated
 * @param assistantId - The ID of the updated assistant
 */
export async function notifyAssistantUpdate(assistantId: string): Promise<void> {
  await notifyCoachBot({
    assistantId,
    action: 'update',
  });
}
