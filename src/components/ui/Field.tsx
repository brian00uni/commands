export function Field({
  label,
  hint,
  value,
  onChange,
  placeholder = '',
  wide = false,
  multiline = false,
  required = false,
  conditional = false,
  list,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  wide?: boolean;
  multiline?: boolean;
  required?: boolean;
  conditional?: boolean;
  list?: string;
}) {
  return (
    <label
      className={`field ${wide ? 'wide' : ''} ${required ? 'field-required' : conditional ? 'field-conditional' : 'field-optional'}`}
    >
      <span>
        {label}
        <span
          className={`field-badge ${required ? 'is-required' : conditional ? 'is-conditional' : 'is-optional'}`}
        >
          {required ? '필수' : conditional ? '조건부' : '선택'}
        </span>
      </span>
      {multiline ? (
        <textarea
          aria-required={required || undefined}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          aria-required={required || undefined}
          list={list}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
        />
      )}{' '}
      {hint && <small>{hint}</small>}
    </label>
  );
}
