import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Code2, BrainCog } from 'lucide-react'
import CodeEditor from './CodeEditor'
import Timer from './Timer'
import { submitInterviewAnswer } from '../../apis/interview.api'
import { useNavigate } from 'react-router-dom'

const FEEDBACK_DURATION_SECONDS = 10

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
  const navigate = useNavigate()

  const questions = useMemo(() => buildQuestions(interviewData), [interviewData])
  const [questionIndex, setQuestionIndex] = useState(
    interviewData?.currentQuestionIndex ?? 0
  )
  const [currentQuestion, setCurrentQuestion] = useState(
    questions[questionIndex] ?? interviewData?.question
  )
  const totalQuestions = interviewData?.totalQuestions ?? questions.length
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(() =>
    getQuestionDuration(currentQuestion)
  )
  const [timerActive, setTimerActive] = useState(
    () => getQuestionDuration(currentQuestion) > 0
  )

  // Answer + toolbar state
  const [answer, setAnswer] = useState('')
  const [isCodeOn, setIsCodeOn] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [submissionError, setSubmissionError] = useState('')
  const [feedbackTimeLeft, setFeedbackTimeLeft] = useState(null)
  const [pendingTransition, setPendingTransition] = useState(null)
  const isShowingFeedback = pendingTransition !== null

  const questionText = currentQuestion?.question || currentQuestion?.text || 'Question unavailable'
  const difficulty = currentQuestion?.difficulty || 'easy'
  const progress = totalQuestions ? ((questionIndex + 1) / totalQuestions) * 100 : 0
  const feedbackText = typeof feedback === 'string' ? feedback : feedback?.feedback

  useEffect(() => {
    const duration = getQuestionDuration(currentQuestion)
    setAnswer('')
    setFeedback(null)
    setTimeLeft(duration)
    setTimerActive(duration > 0)
  }, [currentQuestion, questionIndex])

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

  useEffect(() => {
    if (!isShowingFeedback) return

    const intervalId = window.setInterval(() => {
      setFeedbackTimeLeft((remaining) => Math.max(0, remaining - 1))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isShowingFeedback])

  useEffect(() => {
    if (!pendingTransition || feedbackTimeLeft !== 0) return

    if (pendingTransition.completed) {
      navigate(`/interview/${interviewData.interviewId}/report`)
    } else {
      setQuestionIndex(pendingTransition.questionIndex)
      setCurrentQuestion(pendingTransition.question)
      setIsCodeOn(false)
    }

    setFeedbackTimeLeft(null)
    setPendingTransition(null)
  }, [feedbackTimeLeft, interviewData.interviewId, navigate, pendingTransition])

  const handleSubmit = useCallback(async (automatic = false) => {
    if ((!answer.trim() && !automatic) || loading || isShowingFeedback) return

    setTimerActive(false)
    setLoading(true)
    setSubmissionError('')

    try {
      const response = await submitInterviewAnswer(interviewData.interviewId, answer)

      if (!response?.success) {
        setSubmissionError(response?.message || 'Unable to submit your answer. Please try again.')
        setTimerActive(timeLeft > 0)
        return
      }

      let transition
      if (response.completed) {
        transition = { completed: true }
      } else {
        const nextQuestionIndex = response.currentQuestion
        const nextQuestion = response.question ?? questions[nextQuestionIndex]
        if (!Number.isInteger(nextQuestionIndex) || !nextQuestion) {
          setSubmissionError('The next question could not be loaded. Please try again.')
          return
        }
        transition = {
          completed: false,
          questionIndex: nextQuestionIndex,
          question: nextQuestion,
        }
      }

      setFeedback(response.feedback ?? null)
      setFeedbackTimeLeft(FEEDBACK_DURATION_SECONDS)
      setPendingTransition(transition)
    } catch (error) {
      console.error('Failed to submit interview answer:', error)
      setSubmissionError('Unable to submit your answer. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [answer, interviewData.interviewId, isShowingFeedback, loading, questions, timeLeft])

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

  useEffect(() => {
    if (timeLeft === 0 && timerActive && !loading && !isShowingFeedback) {
      handleSubmit(true)
    }
  }, [handleSubmit, isShowingFeedback, loading, timeLeft, timerActive])

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
          {isShowingFeedback ? (
            <div
              role="timer"
              aria-label={`Next question in ${feedbackTimeLeft} seconds`}
              className="relative ml-auto flex h-16 w-16 items-center justify-center"
            >
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="150.8"
                  strokeDashoffset={150.8 * (1 - feedbackTimeLeft / FEEDBACK_DURATION_SECONDS)}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-1000"
                />
              </svg>
              <span className="text-xl font-medium tabular-nums text-red-400">
                {feedbackTimeLeft}s
              </span>
            </div>
          ) : timerActive ? <Timer timeLeft={timeLeft} /> : null}
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
          readOnly={loading || isShowingFeedback}
          className={`min-h-52 flex-1 resize-y rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white outline-none placeholder:text-white/35 focus:border-white/25 ${
            isCodeOn ? 'font-mono text-sm' : ''
          }`}
        />
        {isShowingFeedback && (
          <section
            aria-live="polite"
            className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-950/30 p-5"
          >
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-400">
              AI Feedback
            </h2>
            <p className="text-sm leading-relaxed text-white/80">
              {feedbackText || 'Your answer has been reviewed.'}
            </p>
          </section>
        )}

        {/* Footer: tools + submit */}
        <footer className="mt-5 flex items-start justify-between gap-4">
          <div>
            <button
              type="button"
              aria-label="Code"
              aria-pressed={isCodeOn}
              onClick={() => setIsCodeOn(true)}
              disabled={loading || isShowingFeedback}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                isCodeOn
                  ? 'border-white/40 bg-white/20 text-white'
                  : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50'
              }`}
            >
              <Code2 size={19} />
            </button>
            <p className="mt-3 text-sm text-white/40">
              Coding question? Use &lt; &gt; to write &amp; add code
            </p>
            {submissionError && (
              <p role="alert" className="mt-2 text-sm text-red-300">
                {submissionError}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!answer.trim() || loading || isShowingFeedback}
            className="inline-flex items-center gap-2 rounded-xl bg-white/25 px-6 py-3 font-medium text-white transition enabled:bg-white enabled:text-black disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Answer'} <ArrowRight size={18} />
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
