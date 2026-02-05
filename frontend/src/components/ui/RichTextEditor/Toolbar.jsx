import { useState } from 'react';
import LinkModal from './LinkModal';
import ImageModal from './ImageModal';
import EmojiPicker from './EmojiPicker';

/**
 * ToolbarButton - Bouton de la toolbar avec icône tribal
 */
const ToolbarButton = ({ onClick, isActive, icon, title, disabled }) => {
  const buttonClasses = [
    'toolbar-button',
    isActive && 'toolbar-button--active',
    disabled && 'toolbar-button--disabled'
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      tabIndex={disabled ? -1 : 0}
    >
      {icon}
    </button>
  );
};

/**
 * Toolbar - Barre d'outils de formatage pour RichTextEditor
 * Icônes tribales gravées dans la pierre
 */
const Toolbar = ({ editor, disabled = false }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!editor) {
    return null;
  }

  const handleSetLink = (url) => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
    setShowLinkModal(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkModal(false);
  };

  const handleSetImage = ({ src, alt }) => {
    if (src) {
      editor.chain().focus().setImage({ src, alt }).run();
    }
    setShowImageModal(false);
  };

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleSelectEmoji = (emoji) => {
    editor.chain().focus().insertContent(emoji).run();
  };

  return (
    <>
      <div className="toolbar">
        {/* Groupe 1: Formatage de texte */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            disabled={disabled}
            icon={<BoldIcon />}
            title="Gras (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            disabled={disabled}
            icon={<ItalicIcon />}
            title="Italique (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            disabled={disabled}
            icon={<StrikeIcon />}
            title="Barré"
          />
        </div>

        <div className="toolbar-separator" />

        {/* Groupe 2: Titres */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            disabled={disabled}
            icon={<H2Icon />}
            title="Titre 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            disabled={disabled}
            icon={<H3Icon />}
            title="Titre 3"
          />
        </div>

        <div className="toolbar-separator" />

        {/* Groupe 3: Listes */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            disabled={disabled}
            icon={<ListBulletIcon />}
            title="Liste à puces"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            disabled={disabled}
            icon={<ListOrderedIcon />}
            title="Liste numérotée"
          />
        </div>

        <div className="toolbar-separator" />

        {/* Groupe 4: Citation et lien */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            disabled={disabled}
            icon={<QuoteIcon />}
            title="Citation"
          />
          <ToolbarButton
            onClick={() => setShowLinkModal(true)}
            isActive={editor.isActive('link')}
            disabled={disabled}
            icon={<LinkIcon />}
            title="Insérer un lien"
          />
        </div>

        <div className="toolbar-separator" />

        {/* Groupe 5: Alignement */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            disabled={disabled}
            icon={<AlignLeftIcon />}
            title="Aligner à gauche"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            disabled={disabled}
            icon={<AlignCenterIcon />}
            title="Aligner au centre"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            disabled={disabled}
            icon={<AlignRightIcon />}
            title="Aligner à droite"
          />
        </div>

        <div className="toolbar-separator" />

        {/* Groupe 6: Code */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            disabled={disabled}
            icon={<CodeIcon />}
            title="Code inline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            disabled={disabled}
            icon={<CodeBlockIcon />}
            title="Bloc de code"
          />
        </div>

        <div className="toolbar-separator" />

        {/* Groupe 7: Insertion */}
        <div className="toolbar-group">
          <ToolbarButton
            onClick={() => setShowImageModal(true)}
            isActive={false}
            disabled={disabled}
            icon={<ImageIcon />}
            title="Insérer une image"
          />
          <ToolbarButton
            onClick={handleInsertTable}
            isActive={editor.isActive('table')}
            disabled={disabled}
            icon={<TableIcon />}
            title="Insérer un tableau"
          />
          <div className="toolbar-emoji-wrapper">
            <ToolbarButton
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              isActive={showEmojiPicker}
              disabled={disabled}
              icon={<EmojiIcon />}
              title="Insérer un emoji"
            />
            <EmojiPicker
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              onSelectEmoji={handleSelectEmoji}
              editor={editor}
            />
          </div>
        </div>
      </div>

      {/* Modal pour les liens */}
      {showLinkModal && (
        <LinkModal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          onSetLink={handleSetLink}
          onRemoveLink={handleRemoveLink}
          currentUrl={editor.getAttributes('link').href || ''}
          hasLink={editor.isActive('link')}
        />
      )}

      {/* Modal pour les images */}
      {showImageModal && (
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          onSetImage={handleSetImage}
        />
      )}
    </>
  );
};

// ============================================
// ICÔNES SVG TRIBALES
// ============================================

const BoldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 4v16M6 12h7a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 5l1-1M7 19l1 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

const ItalicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 4h8M6 20h8M14 4l-4 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 5l-1-1M9 19l-1 1M17 5l1-1M13 19l1 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

const StrikeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 12h18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M17.5 7.5C17.5 5.5 15.5 4 12 4s-5.5 1.5-5.5 3.5S8.5 11 12 11m0 2c3.5 0 5.5 1.5 5.5 3.5S15.5 20 12 20s-5.5-1.5-5.5-3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="4" cy="12" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="20" cy="12" r="1" fill="currentColor" opacity="0.4" />
  </svg>
);

const H2Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 5v14M4 12h7M11 5v14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 12.5c0-1.5 1-2.5 2.5-2.5S21 11 21 12.5c0 2-4 3.5-4 5.5h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 6l-1-1M5 18l-1 1M10 6l1-1M10 18l1 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const H3Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 5v14M4 12h7M11 5v14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 10h4l-2.5 3.5c1.5 0 2.5 1 2.5 2.5S19 18 17.5 18 15 17 15 15.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 6l-1-1M5 18l-1 1M10 6l1-1M10 18l1 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const ListBulletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 6h12M9 12h12M9 18h12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" />
    <path
      d="M8 5l-1 1M8 11l-1 1M8 17l-1 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const ListOrderedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 6h10M12 12h10M12 18h10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 4v4h2M3 10v4h2.5M3 16v4h3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 5l-1 1M11 11l-1 1M11 17l-1 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 11H7a1 1 0 00-1 1v5a1 1 0 001 1h3V11zM10 11c0-2.5-1-4-3-5M18 11h-3a1 1 0 00-1 1v5a1 1 0 001 1h3V11zM18 11c0-2.5-1-4-3-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 7l-1-1M15 7l-1-1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="16" r="1" fill="currentColor" opacity="0.3" />
    <circle cx="16" cy="8" r="1" fill="currentColor" opacity="0.3" />
  </svg>
);

const AlignLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6h18M3 10h12M3 14h18M3 18h12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M2 5l1 1M2 17l1 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const AlignCenterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6h18M6 10h12M3 14h18M6 18h12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M5 5l1 1M5 17l1 1M18 5l1 1M18 17l1 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const AlignRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6h18M9 10h12M3 14h18M9 18h12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M21 5l1 1M21 17l1 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 8L4 12l4 4M16 8l4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 4l-4 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />
    <circle cx="7" cy="7" r="1" fill="currentColor" opacity="0.3" />
    <circle cx="17" cy="17" r="1" fill="currentColor" opacity="0.3" />
  </svg>
);

const CodeBlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M7 9l2 2-2 2M11 13h4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 8h18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.4"
    />
    <circle cx="5.5" cy="6.5" r="0.5" fill="currentColor" opacity="0.3" />
    <circle cx="7.5" cy="6.5" r="0.5" fill="currentColor" opacity="0.3" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="8.5"
      cy="9"
      r="1.5"
      fill="currentColor"
    />
    <path
      d="M3 16l5-5 4 4 5-6 4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 5l-1-1M18 5l1-1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const TableIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M3 9h18M3 14h18M9 4v16M15 4v16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M4 5l-1-1M20 5l1-1M4 19l-1 1M20 19l1 1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

const EmojiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="9" cy="10" r="1.5" fill="currentColor" />
    <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    <path
      d="M8 14.5c1 1.5 3 2.5 4 2.5s3-1 4-2.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 7l-1-1M18 7l1-1"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

export default Toolbar;
