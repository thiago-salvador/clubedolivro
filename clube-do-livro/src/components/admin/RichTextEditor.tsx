import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Undo,
  Redo,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

interface FormatButton {
  icon: React.ReactNode;
  command: string;
  value?: string;
  tooltip: string;
  isActive?: () => boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Digite o conteúdo do exercício...',
  minHeight = '200px',
  maxHeight = '500px',
  error,
  label,
  required
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const formatButtons: FormatButton[] = [
    { icon: <Bold className="w-4 h-4" />, command: 'bold', tooltip: 'Negrito (Ctrl+B)' },
    { icon: <Italic className="w-4 h-4" />, command: 'italic', tooltip: 'Itálico (Ctrl+I)' },
    { icon: <Underline className="w-4 h-4" />, command: 'underline', tooltip: 'Sublinhado (Ctrl+U)' },
    { icon: <Heading1 className="w-4 h-4" />, command: 'formatBlock', value: 'h1', tooltip: 'Título 1' },
    { icon: <Heading2 className="w-4 h-4" />, command: 'formatBlock', value: 'h2', tooltip: 'Título 2' },
    { icon: <Heading3 className="w-4 h-4" />, command: 'formatBlock', value: 'h3', tooltip: 'Título 3' },
    { icon: <List className="w-4 h-4" />, command: 'insertUnorderedList', tooltip: 'Lista com marcadores' },
    { icon: <ListOrdered className="w-4 h-4" />, command: 'insertOrderedList', tooltip: 'Lista numerada' },
    { icon: <Quote className="w-4 h-4" />, command: 'formatBlock', value: 'blockquote', tooltip: 'Citação' },
    { icon: <Code className="w-4 h-4" />, command: 'formatBlock', value: 'pre', tooltip: 'Código' },
    { icon: <AlignLeft className="w-4 h-4" />, command: 'justifyLeft', tooltip: 'Alinhar à esquerda' },
    { icon: <AlignCenter className="w-4 h-4" />, command: 'justifyCenter', tooltip: 'Centralizar' },
    { icon: <AlignRight className="w-4 h-4" />, command: 'justifyRight', tooltip: 'Alinhar à direita' },
    { icon: <AlignJustify className="w-4 h-4" />, command: 'justifyFull', tooltip: 'Justificar' },
    { icon: <Undo className="w-4 h-4" />, command: 'undo', tooltip: 'Desfazer (Ctrl+Z)' },
    { icon: <Redo className="w-4 h-4" />, command: 'redo', tooltip: 'Refazer (Ctrl+Y)' }
  ];

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      if (content === '<br>') {
        onChange('');
      } else {
        onChange(content);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      handleInput();
    }
  };

  const handleLink = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
      setIsLinkModalOpen(true);
    } else {
      alert('Por favor, selecione um texto para adicionar o link');
    }
  };

  const insertLink = () => {
    if (linkUrl && selectedText) {
      document.execCommand('createLink', false, linkUrl);
      setIsLinkModalOpen(false);
      setLinkUrl('');
      setSelectedText('');
      handleInput();
    }
  };

  const isFormatActive = (format: string): boolean => {
    return document.queryCommandState(format);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2">
          <div className="flex flex-wrap items-center gap-1">
            {formatButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={() => execCommand(button.command, button.value)}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                  button.isActive?.() || isFormatActive(button.command)
                    ? 'bg-gray-200 dark:bg-gray-600'
                    : ''
                }`}
                title={button.tooltip}
              >
                {button.icon}
              </button>
            ))}
            
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            
            <button
              type="button"
              onClick={handleLink}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Adicionar link"
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          className="p-4 bg-white dark:bg-gray-800 focus:outline-none prose prose-sm max-w-none dark:prose-invert relative"
          style={{ 
            minHeight, 
            maxHeight, 
            overflowY: 'auto'
          }}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          dangerouslySetInnerHTML={{ __html: value }}
        />
        {!value && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Adicionar Link</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Texto selecionado
              </label>
              <p className="text-gray-600 dark:text-gray-400">{selectedText}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL do link
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-terracota focus:border-transparent bg-white dark:bg-gray-700"
                placeholder="https://exemplo.com"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkUrl('');
                  setSelectedText('');
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl}
                className="px-4 py-2 bg-terracota text-white rounded-lg hover:bg-terracota/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;