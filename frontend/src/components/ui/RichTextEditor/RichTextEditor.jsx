import { forwardRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Mention from '@tiptap/extension-mention';
import Toolbar from './Toolbar';
import './RichTextEditor.css';

// Créer l'instance lowlight pour la coloration syntaxique
const lowlight = createLowlight(common);

/**
 * Label underline decoration (consistent with Input component)
 */
const LabelUnderline = () => (
  <svg
    className="input-label-underline"
    viewBox="0 0 100 2"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0 1 L25 1 M30 1 L45 1 M50 1 L65 1 M70 1 L100 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.3"
    />
    <circle cx="27.5" cy="1" r="0.8" fill="currentColor" opacity="0.4" />
    <circle cx="47.5" cy="1" r="0.8" fill="currentColor" opacity="0.4" />
    <circle cx="67.5" cy="1" r="0.8" fill="currentColor" opacity="0.4" />
  </svg>
);

/**
 * Warning icon for error state (consistent with Input component)
 */
const WarningIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="input-error-icon"
  >
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 4.5 L8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    <path d="M5 4 L6.5 8 L5 12" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

/**
 * RichTextEditor - Éditeur de texte riche tribal avec TipTap
 * Thème : Tablette gravée post-apocalyptique
 *
 * @param {string} content - Contenu HTML initial (controlled)
 * @param {function} onChange - Callback appelé quand le contenu change, reçoit HTML string
 * @param {string} placeholder - Texte placeholder
 * @param {boolean} editable - Si l'éditeur est éditable
 * @param {string} minHeight - Hauteur minimale de l'éditeur (CSS value)
 * @param {string} label - Label au-dessus de l'éditeur
 * @param {string} hint - Texte d'aide en bas
 * @param {string} error - Message d'erreur (active l'état error si présent)
 * @param {boolean} disabled - Si l'éditeur est désactivé
 * @param {string} className - Classes CSS supplémentaires
 * @param {string} id - ID optionnel pour l'accessibilité
 * @param {object} mentionSuggestions - Configuration pour les mentions (optionnel)
 */
const RichTextEditor = forwardRef(({
  content = '',
  onChange,
  placeholder = 'Écris ton message...',
  editable = true,
  minHeight = '200px',
  label,
  hint,
  error,
  disabled = false,
  className = '',
  id,
  mentionSuggestions,
  ...props
}, ref) => {
  const editorId = id || `rte-${Math.random().toString(36).slice(2, 9)}`;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3], // Only H2 and H3 as per spec
        },
        // Disable default code block since we use CodeBlockLowlight
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false, // Don't open links on click in editor
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'editor-code-block',
        },
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: mentionSuggestions || {
          // Configuration par défaut - liste vide
          items: ({ query }) => {
            return [];
          },
          render: () => {
            let component;
            let popup;

            return {
              onStart: (props) => {
                component = document.createElement('div');
                component.className = 'mention-suggestions';
                component.innerHTML = '<div class="mention-empty">Aucune suggestion disponible</div>';

                popup = props.clientRect?.();
                if (popup) {
                  component.style.top = `${popup.bottom}px`;
                  component.style.left = `${popup.left}px`;
                }

                document.body.appendChild(component);
              },
              onUpdate: (props) => {
                popup = props.clientRect?.();
                if (popup && component) {
                  component.style.top = `${popup.bottom}px`;
                  component.style.left = `${popup.left}px`;
                }
              },
              onExit: () => {
                if (component) {
                  component.remove();
                }
              },
            };
          },
        },
      }),
    ],
    content,
    editable: editable && !disabled,
    onUpdate: ({ editor }) => {
      // Output HTML on content change
      onChange?.(editor.getHTML());
    },
  });

  // Synchronize controlled content with editor (controlled component)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false); // false = don't trigger onUpdate
    }
  }, [content, editor]);

  // Update editable state when props change
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable && !disabled);
    }
  }, [editable, disabled, editor]);

  const containerClasses = [
    'rich-text-editor-container',
    error && 'rich-text-editor-container--error',
    disabled && 'rich-text-editor-container--disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className={`w-full input-wrapper ${className}`} ref={ref} {...props}>
      {/* Label with tribal underline (consistent with Input) */}
      {label && (
        <label
          htmlFor={editorId}
          className="block font-ui text-sm text-primary-700 mb-1.5 input-label-tribal"
        >
          {label}
          <LabelUnderline />
        </label>
      )}

      {/* Editor container with toolbar and content */}
      <div className={containerClasses} id={editorId}>
        {/* Toolbar with formatting buttons (only renders when editor is ready) */}
        {editor && <Toolbar editor={editor} disabled={disabled} />}

        {/* Editable content area */}
        <div
          className="rich-text-editor-content"
          style={{ minHeight }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Error or hint message (consistent with Input) */}
      {(error || hint) && (
        <p
          className={[
            'mt-1.5 text-sm font-ui flex items-center gap-1.5 input-helper-text',
            error ? 'text-error' : 'text-neutral-500'
          ].join(' ')}
        >
          {error && <WarningIcon />}
          {error || hint}
        </p>
      )}
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
