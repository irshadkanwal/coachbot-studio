'use client';

import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

export default function Markdown({
  content,
  isEditMode,
  onChange,
}: {
  content: string;
  isEditMode?: boolean;
  onChange?: (text: string) => any;
}) {
  return isEditMode ? (
    <MDEditor
      value={content}
      preview="edit"
      height="auto"
      hideToolbar={true}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
      onChange={(text?: string) => onChange?.(text || '')}
      className="md-editor-custom !bg-transparent !text-main !shadow-none"
    />
  ) : (
    <MDEditor.Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      source={content}
      className="whitespace-pre-wrap !bg-transparent !text-main"
    />
  );
}
