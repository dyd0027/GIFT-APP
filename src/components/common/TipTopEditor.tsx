'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useState } from 'react';

interface TiptapEditorProps {
  deliveryDt: string;
  setDeliveryDt: (val: string) => void;
}

export default function TiptapEditor({ deliveryDt, setDeliveryDt }: TiptapEditorProps) {
  const [showTextColor, setShowTextColor] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        hardBreak: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        italic: false,
        underline: false,
        strike: false,
        code: false,
      }),
      TextStyle,
      Color,
    ],
    content: deliveryDt || '<p></p>',
    onUpdate({ editor }) {
      setDeliveryDt(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };

  return (
    <div className="mx-auto w-full">
      <div className="flex gap-2 rounded border p-[5px]">
        <span className="flex items-center">TEXT 옵션</span>
        <button
          onClick={toggleBold}
          className="rounded border border-gray-300 bg-white px-2 py-1 font-bold"
        >
          Bold
        </button>
        <div className="relative">
          <button
            onClick={() => setShowTextColor(!showTextColor)}
            className="rounded border border-gray-300 bg-white px-2 py-1"
          >
            글자색
          </button>
          {showTextColor && (
            <input
              type="color"
              autoFocus
              onBlur={() => setShowTextColor(false)}
              onChange={(e) => {
                editor?.chain().focus().setColor(e.target.value).run();
                setShowTextColor(false);
              }}
              className="absolute left-0 top-full z-[10] mt-1"
            />
          )}
        </div>
      </div>

      <div className="rounded border bg-[white] p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
