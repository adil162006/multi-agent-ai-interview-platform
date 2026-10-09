import { ArrowLeft, ArrowRight, Eye } from 'lucide-react'

const StepNavigation = ({ current, total, onPrevious, onNext, onPreview }) => {
  const isFirst = current === 1
  const isLast = current === total

  return (
    <div className='mt-8 flex items-center justify-between border-t border-black/8 pt-6'>
      <button
        type='button'
        onClick={onPrevious}
        disabled={isFirst}
        className='flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white'
      >
        <ArrowLeft size={14} /> Previous
      </button>

      <div className='flex items-center gap-1.5' aria-hidden='true'>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i + 1 === current ? 'w-4 bg-black' : 'w-1.5 bg-black/20'
            }`}
          />
        ))}
      </div>

      {isLast ? (
        <button
          type='button'
          onClick={onPreview}
          className='flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-black/85'
        >
          <Eye size={14} /> Preview Resume
        </button>
      ) : (
        <button
          type='button'
          onClick={onNext}
          className='flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-black/85'
        >
          Next <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}

export default StepNavigation