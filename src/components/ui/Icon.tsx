import type { CSSProperties } from 'react';

export function Icon({ name, size, className, style }: { name: string; size?: number; className?: string; style?: CSSProperties }) {
  return (
    <span className={'material-symbols-rounded' + (className ? ' ' + className : '')} style={size ? { fontSize: size, ...style } : style} aria-hidden="true">
      {name}
    </span>
  );
}
