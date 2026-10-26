import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, Code2, BrainCog } from 'lucide-react'
import CodeEditor from './CodeEditor'
import Timer from './Timer'

const getQuestionDuration = (question) => {
  const duration = Number(question?.timer ?? 60)
  return Number.isFinite(duration) ? Math.max(0, Math.floor(duration)) : 60
}

const buildQuestions = (interviewData) => {
  if (Array.isArray(interviewData?.questions) && interviewData.questions.length) {
    return interviewData.questions
  }
  return interviewData?.question ? [interviewData.question] : []
}

function Step2interview({ interviewData }) {
  const questions = buildQuestions(interviewData)
  const questionIndex = interviewData?.currentQuestionIndex ?? 0
  const totalQuestions = interviewData?.totalQuestions ?? questions.length
  const currentQuestion = questions[questionIndex] ?? interviewData?.question
  const questionKey = currentQuestion?._id != null
    ? String(currentQuestion._id)
    : `${questionIndex}:${currentQuestion?.question ?? currentQuestion?.text ?? ''}`
  const previousQuestionKey = useRef(questionKey)

  const [timeLeft, setTimeLeft] = useState(() =>
    getQuestionDuration(currentQuestion)
  )
  const [timerActive, setTimerActive] = useState(
    () => getQuestionDuration(currentQuestion) > 0
  )

  // Answer + toolbar state
  const [answer, setAnswer] = useState('')
  const [isCodeOn, setIsCodeOn] = useState(false)
  const[feedback,setFeedback]=useState(null)

  const questionText = currentQuestion?.question || currentQuestion?.text || 'Question unavailable'
  const difficulty = currentQuestion?.difficulty || 'easy'
  const progress = totalQuestions ? ((questionIndex + 1) / totalQuestions) * 100 : 0

  // The question schema has no stable ID, so its index and text identify transitions.
  useEffect(() => {
    if (previousQuestionKey.current === questionKey) return
    previousQuestionKey.current = questionKey
    const duration = getQuestionDuration(currentQuestion)
    setAnswer('')
    setTimeLeft(duration)
    setTimerActive(duration > 0)
  }, [questionKey, currentQuestion])

  useEffect(() => {
    if (!timerActive) return

    const intervalId = window.setInterval(() => {
      setTimeLeft((remaining) => Math.max(0, remaining - 1))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [timerActive])

  useEffect(() => {
    if (timeLeft === 0) setTimerActive(false)
  }, [timeLeft])

  const handleSubmit = () => {
    if (!answer.trim()) return
    setFeedback('Answer is ready. Submission is not connected yet.')
  }

  const handleSubmitCode = (code, language) => {
    setAnswer((previous) => {
      const separator = previous.trim() ? '\n\n' : ''
      return previous + separator + '```' + language + '\n' + code + '\n```'
    })
    setIsCodeOn(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0f14] p-6 text-white sm:p-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col">
        {/* Header */}
        <header className="mb-6 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black">
            <BrainCog size={22} />
          </span>
          <div>
            <h1 className="text-xl font-semibold">AI Interview</h1>
            <p className="mt-0.5 text-sm text-white/50">{difficulty}</p>
          </div>
          {timerActive && <Timer timeLeft={timeLeft} />}
        </header>

        {/* Question */}
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <span className="mb-3 inline-block rounded-md bg-white/10 px-3 py-1 text-sm text-white/80">
            Question {questionIndex + 1}
          </span>
          <p className="max-w-3xl text-lg leading-relaxed">{questionText}</p>
        </article>

        {/* Progress */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm text-white/50">
            <span>Progress</span>
            <span>
              {questionIndex + 1}/{totalQuestions}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Answer */}
        <label htmlFor="interview-answer" className="mb-2 mt-6 text-sm text-white/70">
          Your Answer
        </label>
        <textarea
          id="interview-answer"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your answer here..."
          className={`min-h-52 flex-1 resize-y rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white outline-none placeholder:text-white/35 focus:border-white/25 ${
            isCodeOn ? 'font-mono text-sm' : ''
          }`}
        />

        {/* Footer: tools + submit */}
        <footer className="mt-5 flex items-start justify-between gap-4">
          <div>
            <button
              type="button"
              aria-label="Code"
              aria-pressed={isCodeOn}
              onClick={() => setIsCodeOn(true)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                isCodeOn
                  ? 'border-white/40 bg-white/20 text-white'
                  : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10'
              }`}
            >
              <Code2 size={19} />
            </button>
            <p className="mt-3 text-sm text-white/40">
              Coding question? Use &lt; &gt; to write &amp; add code
            </p>
            {feedback && <p className="mt-2 text-sm text-white/60">{feedback}</p>}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-white/25 px-6 py-3 font-medium text-white transition enabled:bg-white enabled:text-black disabled:cursor-not-allowed"
          >
            Submit Answer <ArrowRight size={18} />
          </button>
        </footer>
      </section>
      {isCodeOn && (
        <CodeEditor
          onClose={() => setIsCodeOn(false)}
          onSubmitCode={handleSubmitCode}
        />
      )}
    </main>
  )
}

export default Step2interview
