import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

const RichTextEditor = ({ content, onChange, placeholder = "Tell your story..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand-600 underline font-medium hover:text-brand-700",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl my-4 max-h-[500px] w-full object-cover",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[350px] p-4 text-slate-800",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt(
      "Enter Image URL (Unsplash or direct image URL):",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80"
    );
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("bold")
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("italic")
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("strike")
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("code")
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("bulletList")
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("orderedList")
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("blockquote")
              ? "bg-slate-200 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded-lg text-sm transition-colors ${
            editor.isActive("link")
              ? "bg-slate-200 text-brand-600 font-bold"
              : "text-slate-600 hover:bg-slate-200/60"
          }`}
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-lg text-sm text-slate-600 hover:bg-slate-200/60 transition-colors"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-sm text-slate-600 hover:bg-slate-200/60 disabled:opacity-30 transition-colors"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-sm text-slate-600 hover:bg-slate-200/60 disabled:opacity-30 transition-colors"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="tiptap-editor editorial-content bg-white min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
