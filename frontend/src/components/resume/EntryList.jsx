import { Plus, Trash2 } from 'lucide-react'
import FormField from './FormField'

const EntryList = ({ section, fields, entries, addLabel, emptyMessage, form }) => (
  <div className='space-y-4'>
    {entries.length === 0 && (
      <p className='py-4 text-center text-sm text-black/40'>{emptyMessage}</p>
    )}

    {entries.map((entry) => (
      <div
        key={entry.id}
        className='relative space-y-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 pr-5 shadow-sm'
      >
        <button
          type='button'
          onClick={() => form.removeEntry(section, entry.id)}
          aria-label={`Remove ${section} entry`}
          className='absolute right-3 top-3 text-black/30 transition hover:text-red-500'
        >
          <Trash2 size={14} />
        </button>
        {fields.map((field) => (
          <FormField
            key={field.name}
            id={`${section}-${entry.id}-${field.name}`}
            label={field.label}
            placeholder={field.placeholder}
            multiline={field.multiline}
            rows={field.rows}
            value={entry[field.name]}
            onChange={(value) => form.updateEntry(section, entry.id, field.name, value)}
          />
        ))}
      </div>
    ))}

    <button
      type='button'
      onClick={() => form.addEntry(section)}
      className='flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white py-3 text-sm text-black/50 transition hover:bg-black/5 hover:text-black'
    >
      <Plus size={14} /> {addLabel}
    </button>
  </div>
)

export default EntryList