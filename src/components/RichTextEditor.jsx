import { useEffect, useState } from 'react'
import { EditorContent, Extension, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import Paragraph from '@tiptap/extension-paragraph'
import { TextStyle } from '@tiptap/extension-text-style'
import './RichTextEditor.css'

const listStyles = [
  { value: 'disc', label: 'Disc' },
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
]

const numberStyles = [
  { value: 'decimal', label: '1. 2. 3.' },
  { value: 'lower-alpha', label: 'a. b. c.' },
  { value: 'upper-alpha', label: 'A. B. C.' },
  { value: 'lower-roman', label: 'i. ii. iii.' },
  { value: 'upper-roman', label: 'I. II. III.' },
]

const ParagraphWithClass = Paragraph.extend({
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => (
          attributes.class ? { class: attributes.class } : {}
        ),
      },
    }
  },
})

const ListStyleType = Extension.create({
  name: 'listStyleType',

  addGlobalAttributes() {
    return [
      {
        types: ['bulletList', 'orderedList'],
        attributes: {
          listStyleType: {
            default: null,
            parseHTML: (element) => element.style.listStyleType || null,
            renderHTML: (attributes) => (
              attributes.listStyleType
                ? { style: `list-style-type: ${attributes.listStyleType}` }
                : {}
            ),
          },
        },
      },
    ]
  },
})

const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => (
              attributes.fontSize
                ? { style: `font-size: ${attributes.fontSize}` }
                : {}
            ),
          },
        },
      },
    ]
  },
})

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function initialHtml(value) {
  if (!value) return ''
  if (String(value).includes('<')) return value

  return String(value)
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function getCurrentFontSize(editor) {
  const value = editor.getAttributes('textStyle').fontSize
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 16
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write your content…' }) {
  const [fontSize, setFontSize] = useState(16)
  const [textColor, setTextColor] = useState('#000000')
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ paragraph: false }),
      ParagraphWithClass,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      ListStyleType,
      FontSize,
    ],
    content: initialHtml(value),
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML())
      setFontSize(getCurrentFontSize(currentEditor))
    },
    onSelectionUpdate: ({ editor: currentEditor }) => {
      setFontSize(getCurrentFontSize(currentEditor))
      setTextColor(currentEditor.getAttributes('textStyle').color || '#000000')
    },
  })

  useEffect(() => {
    if (!editor) return
    const html = initialHtml(value)
    if (html !== editor.getHTML()) {
      editor.commands.setContent(html || '', false)
    }
  }, [editor, value])

  function setBlockStyle(style) {
    if (!editor) return

    if (style === 'normal') {
      editor.chain().focus().setParagraph({ class: null }).run()
    } else if (style === 'no-spacing') {
      editor.chain().focus().setParagraph({ class: 'no-spacing' }).run()
    } else {
      editor.chain().focus().setHeading({ level: Number(style) }).run()
    }
  }

  function setListStyle(type, style) {
    if (!editor) return

    const chain = editor.chain().focus()
    if (type === 'bulletList') {
      if (!editor.isActive('bulletList')) chain.toggleBulletList()
      chain.updateAttributes('bulletList', { listStyleType: style }).run()
    } else {
      if (!editor.isActive('orderedList')) chain.toggleOrderedList()
      chain.updateAttributes('orderedList', { listStyleType: style }).run()
    }
  }

  function changeFontSize(amount) {
    if (!editor) return
    const next = Math.min(48, Math.max(12, fontSize + amount))
    editor.chain().focus().setMark('textStyle', { fontSize: `${next}px` }).run()
    setFontSize(next)
  }

  function clearFormatting() {
    if (!editor) return
    editor.chain().focus().clearNodes().unsetAllMarks().run()
    setFontSize(16)
    setTextColor('#000000')
  }

  if (!editor) {
    return <div className="rich-text-editor rich-text-editor--loading" />
  }

  const blockStyle = editor.isActive('heading', { level: 1 })
    ? '1'
    : editor.isActive('heading', { level: 2 })
      ? '2'
      : editor.isActive('heading', { level: 3 })
        ? '3'
        : editor.isActive('paragraph', { class: 'no-spacing' })
          ? 'no-spacing'
          : 'normal'

  const listStyle = editor.getAttributes('bulletList').listStyleType || 'disc'
  const numberStyle = editor.getAttributes('orderedList').listStyleType || 'decimal'

  return (
    <div className="rich-text-editor">
      <div className="rich-text-editor__toolbar" role="toolbar" aria-label="Text formatting">
        <label className="rich-text-editor__select-label">
          <span className="sr-only">Paragraph style</span>
          <select
            aria-label="Paragraph style"
            value={blockStyle}
            onChange={(event) => setBlockStyle(event.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="no-spacing">No spacing</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>
        </label>

        <button
          type="button"
          className={editor.isActive('bold') ? 'is-active' : ''}
          aria-label="Bold"
          aria-pressed={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={editor.isActive('italic') ? 'is-active' : ''}
          aria-label="Italic"
          aria-pressed={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={editor.isActive('underline') ? 'is-active' : ''}
          aria-label="Underline"
          aria-pressed={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </button>

        <button
          type="button"
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          aria-label="Bullet list"
          aria-pressed={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </button>
        <select
          aria-label="Bullet type"
          value={listStyle}
          onChange={(event) => setListStyle('bulletList', event.target.value)}
        >
          {listStyles.map((style) => (
            <option key={style.value} value={style.value}>{style.label}</option>
          ))}
        </select>

        <button
          type="button"
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          aria-label="Numbered list"
          aria-pressed={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </button>
        <select
          aria-label="Numbering type"
          value={numberStyle}
          onChange={(event) => setListStyle('orderedList', event.target.value)}
        >
          {numberStyles.map((style) => (
            <option key={style.value} value={style.value}>{style.label}</option>
          ))}
        </select>

        <label className="rich-text-editor__color">
          <span className="sr-only">Text color</span>
          <input
            type="color"
            aria-label="Text color"
            value={textColor}
            onChange={(event) => {
              setTextColor(event.target.value)
              editor.chain().focus().setColor(event.target.value).run()
            }}
          />
        </label>
        <button
          type="button"
          aria-label="Remove color"
          onClick={() => {
            editor.chain().focus().unsetColor().run()
            setTextColor('#000000')
          }}
        >
          Remove color
        </button>

        <button type="button" aria-label="Decrease font size" onClick={() => changeFontSize(-2)}>
          A-
        </button>
        <span className="rich-text-editor__font-size" aria-live="polite">{fontSize}px</span>
        <button type="button" aria-label="Increase font size" onClick={() => changeFontSize(2)}>
          A+
        </button>
        <button type="button" aria-label="Clear formatting" onClick={clearFormatting}>
          Clear
        </button>
      </div>

      <div
        className="rich-text-editor__surface"
        data-placeholder={placeholder}
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
