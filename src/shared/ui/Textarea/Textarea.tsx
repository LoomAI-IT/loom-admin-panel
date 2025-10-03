import { type TextareaHTMLAttributes, useRef, useEffect } from 'react';
import './Textarea.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
}

export const Textarea = ({ label, error, className = '', autoResize = true, ...props }: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoResize) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustHeight();

    textarea.addEventListener('input', adjustHeight);
    return () => {
      textarea.removeEventListener('input', adjustHeight);
    };
  }, [autoResize, props.value]);

  return (
    <div className="textarea-wrapper">
      {label && <label className="textarea-label">{label}</label>}
      <textarea
        ref={textareaRef}
        className={`textarea ${error ? 'textarea-error' : ''} ${autoResize ? 'textarea-auto-resize' : ''} ${className}`}
        {...props}
      />
      {error && <span className="textarea-error-message">{error}</span>}
    </div>
  );
};
