import { Assistant, AssistantChat, AssistantConfiguration } from '../models/assistant.models';
import { Message } from '../models/chat.models';
import { Stage } from '../models/instruction.models';
import { sortByCreatedAt } from './user-session.utils';

const getMessagesContent = (messages: Message[]) => {
  return messages.reduce(
    (text: string, { role, content }: Message) => text + `**[${role}]:** ${content}\n\n`,
    '## Chat Transcription:\n\n'
  );
};

const getBlobFromContent = (content: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });

  return URL.createObjectURL(blob);
};

export const handleFileDownload = (fileName: string, fileUrl: string, downloadLink: HTMLAnchorElement | null) => {
  if (!fileUrl || !downloadLink) return;

  downloadLink.href = fileUrl;
  downloadLink.download = fileName;
  downloadLink.click();
};

export const generateAssistantFile = ({ name }: Assistant, config: AssistantConfiguration | null) => {
  const { stages, instructions, onboarding } = config || {};
  const adjustMarkdownHeaders = (content?: string | null) => content?.replace(/#{1,5} /gm, (match) => `##${match}`);
  const stagesInstructions = stages?.map(
    ({ name, instructions, analyzer }: Stage) =>
      `### ${name}\n\n #### Instructions:\n\n${adjustMarkdownHeaders(instructions)}\n\n #### Analyzer:\n\n${adjustMarkdownHeaders(analyzer)}\n\n`
  );
  const onboardingInstructions = onboarding
    ? `\n\n ## Onboarding Instructions:\n\n ${adjustMarkdownHeaders(onboarding)}`
    : '';
  const content = `# ${name}\n\n ## Main Instructions:\n\n ${adjustMarkdownHeaders(instructions)}${onboardingInstructions}\n\n ## Stages:\n\n ${stagesInstructions?.join('\n\n')}`;

  return getBlobFromContent(content);
};

export const generateChatFile = (messages: Message[] = []) => {
  const sortedMessages = sortByCreatedAt(messages);
  const content = getMessagesContent(sortedMessages);

  return getBlobFromContent(content);
};

export const generateSessionFile = (chats: AssistantChat[]) => {
  if (!chats?.length) return null;

  const content = chats
    .map(({ name, messages }: AssistantChat) => {
      const sortedMessages = sortByCreatedAt(messages || []);

      return `# ${name}\n ${getMessagesContent(sortedMessages)}`;
    })
    .filter(Boolean)
    .join('\n\n\n');

  return getBlobFromContent(content);
};
