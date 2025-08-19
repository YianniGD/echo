'use client';
import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Strikethrough, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Undo, Redo, Minus } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

interface TiptapToolbarProps {
  editor: Editor | null;
}

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-outline-variant p-2 bg-surface-container">
      <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()} aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()} aria-label="Toggle italic"><Italic className="h-4 w-4" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()} aria-label="Toggle strikethrough"><Strikethrough className="h-4 w-4" /></Toggle>
      <div className="mx-1 h-6 w-px bg-outline-variant" />
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} aria-label="Toggle heading 1"><Heading1 className="h-4 w-4" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Toggle heading 2"><Heading2 className="h-4 w-4" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Toggle heading 3"><Heading3 className="h-4 w-4" /></Toggle>
      <div className="mx-1 h-6 w-px bg-outline-variant" />
      <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} aria-label="Toggle bullet list"><List className="h-4 w-4" /></Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Toggle ordered list"><ListOrdered className="h-4 w-4" /></Toggle>
      <div className="mx-1 h-6 w-px bg-outline-variant" />
      <Toggle size="sm" onPressedChange={() => editor.chain().focus().setHorizontalRule().run()} aria-label="Add horizontal rule"><Minus className="h-4 w-4" /></Toggle>
      <Toggle size="sm" onPressedChange={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} aria-label="Undo"><Undo className="h-4 w-4" /></Toggle>
      <Toggle size="sm" onPressedChange={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} aria-label="Redo"><Redo className="h-4 w-4" /></Toggle>
    </div>
  );
};

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
}

const RichTextEditor = React.forwardRef<Editor, RichTextEditorProps>(({ content, onChange, placeholder, className, editorClassName }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn('prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none flex-grow', editorClassName),
      },
    },
  });

  React.useImperativeHandle(ref, () => editor!, [editor]);

  // Ensure editor content is updated when the external content prop changes.
  React.useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className={cn("flex flex-col bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden", className)}>
      <TiptapToolbar editor={editor} />
      <div className="p-4 flex-grow min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;
