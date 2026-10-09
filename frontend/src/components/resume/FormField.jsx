const baseStyles =
  'w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black shadow-sm outline-none transition placeholder:text-black/30 focus:border-black focus:ring-2 focus:ring-black/10'

const FormField = ({ id, label, value, onChange, placeholder, type = 'text', multiline = false, rows = 4 }) => (
  <div className='space-y-1.5'>
    <label htmlFor={id} className='block text-[11px] font-semibold uppercase tracking-wide text-black/70'>
      {label}
    </label>
    {multiline ? (
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${baseStyles} resize-none`}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={baseStyles}
      />
    )}
  </div>
)

export default FormField