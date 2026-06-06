import { useState, type ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  hint?: string;
}

export function Collapsible({ title, children, defaultOpen = false, hint }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      className={`collapsible ${open ? 'collapsible--open' : ''}`}
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="collapsible__summary">
        <span>{title}</span>
        {hint && <span className="collapsible__hint">{hint}</span>}
      </summary>
      <div className="collapsible__body">{children}</div>
    </details>
  );
}
