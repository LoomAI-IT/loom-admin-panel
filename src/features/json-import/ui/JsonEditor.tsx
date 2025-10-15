import {useState, useRef, useEffect, useCallback} from 'react';
import {syntaxHighlight} from '../lib/syntaxHighlight';
import './JsonEditor.css';

interface JsonEditorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const JsonEditor = ({value, onChange, error}: JsonEditorProps) => {
    const [highlightedCode, setHighlightedCode] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const highlightRef = useRef<HTMLPreElement>(null);

    const updateHighlight = useCallback((text: string) => {
        if (!text.trim()) {
            setHighlightedCode('');
            return;
        }

        // Экранируем HTML и применяем подсветку синтаксиса
        const escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        setHighlightedCode(syntaxHighlight(escaped));
    }, []);

    useEffect(() => {
        updateHighlight(value);
    }, [value, updateHighlight]);

    const handleScroll = () => {
        if (textareaRef.current && highlightRef.current) {
            const scrollTop = textareaRef.current.scrollTop;
            const scrollLeft = textareaRef.current.scrollLeft;
            highlightRef.current.style.transform = `translate(-${scrollLeft}px, -${scrollTop}px)`;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="json-editor">
            <div className="json-editor-container">
                <div className="json-editor-highlight-wrapper">
                    <pre
                        ref={highlightRef}
                        className="json-editor-highlight"
                        dangerouslySetInnerHTML={{__html: highlightedCode || ''}}
                    />
                </div>
                <textarea
                    ref={textareaRef}
                    className="json-editor-textarea"
                    value={value}
                    onChange={handleChange}
                    onScroll={handleScroll}
                    placeholder="Вставьте JSON данные..."
                    spellCheck={false}
                />
            </div>
            {error && <div className="json-editor-error">{error}</div>}
        </div>
    );
};
