'use client'

import { useMemo } from "react"
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';

interface RichTextEditorProps {
    value: Descendant[];
    onChange: (value: Descendant[]) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const editor = useMemo(() => withReact(createEditor()), []);

    return (
        <Slate editor={editor} initialValue={value} onChange={onChange}>
            <Editable placeholder="Enter your content..." />
        </Slate>
    )
}

export default RichTextEditor;