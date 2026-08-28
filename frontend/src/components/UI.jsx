import { useEffect } from 'react';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, error, hint, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
      {error ? <small className="field-error">{error}</small> : null}
      {!error && hint ? <small className="field-hint">{hint}</small> : null}
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...props}>{children}</select>
    </label>
  );
}

export function Rating({ value = 0, onChange, readonly = false }) {
  return (
    <div className="stars" aria-label={`Rating ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? 'star active' : 'star'}
          disabled={readonly}
          onClick={() => onChange?.(star)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function Badge({ children, tone = '' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function State({ type = 'empty', title, children }) {
  return (
    <div className={`state state-${type}`}>
      <div className="state-icon">{type === 'error' ? '!' : type === 'loading' ? '…' : '○'}</div>
      {title ? <h3>{title}</h3> : null}
      <p>{children}</p>
    </div>
  );
}

export function Modal({ title, children, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        {title ? <h2>{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}

export function PageNotice({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="alert">
      <span>{message}</span>
      {onClose ? <button onClick={onClose} type="button">×</button> : null}
    </div>
  );
}
