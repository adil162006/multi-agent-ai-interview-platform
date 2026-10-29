import { Clock3 } from 'lucide-react'

function Timer({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div
      role="timer"
      aria-label={`Time remaining ${minutes} minutes ${seconds} seconds`}
      className={`flex items-center gap-2 text-sm font-medium tabular-nums ${
        timeLeft <= 10 ? 'text-red-400' : 'text-white/70'
      }`}
    >
      <Clock3 size={16} aria-hidden="true" />
      <span>{formattedTime}</span>
    </div>
  )
}

export default Timer
