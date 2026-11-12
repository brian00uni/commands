export function Field({
  label,
  hint,
  value,
  onChange,
  placeholder = '',
  wide = false,
  multiline = false,
  required = false,
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
  list?: string;
}) {
  return (
    <label className={`field ${wide ? 'wide' : ''}`}>
      <span>
        {label}
        {required && <b className="required"> *</b>}
      </span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
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
