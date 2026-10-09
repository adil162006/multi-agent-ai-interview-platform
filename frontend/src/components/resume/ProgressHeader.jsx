const ProgressHeader = ({ current, total }) => {
  const percent = Math.round(((current - 1) / (total - 1)) * 100)

  return (
    <div>
      <div className='flex items-center justify-between text-[11px] text-black/50'>
        <span className='uppercase'>Step {current} of {total}</span>
        <span>{percent}% complete</span>
      </div>
      <div className='mt-2 h-1 w-full overflow-hidden rounded-full bg-black/8'>
        <div
          className='h-full rounded-full bg-black transition-all duration-300'
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressHeader