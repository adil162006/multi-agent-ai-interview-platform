import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Code2, BrainCog, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import CodeEditor from './CodeEditor'
import Timer from './Timer'
import { submitInterviewAnswer } from '../../apis/interview.api'
import { useNavigate } from 'react-router-dom'
import interviewerVideo from '../../assets/female-ai.mp4'

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

const PREFERRED_VOICE_NAMES = [
  'Microsoft Aria',
  'Microsoft Jenny',
  'Microsoft Zira',
  'Microsoft Heera',
  'Google UK English Female',
  'Samantha',
  'Victoria',
  'Karen',
]

const pickInterviewerVoice = (voices) => {
  const englishVoices = voices
    .filter((voice) => voice.lang.toLowerCase().startsWith('en'))
    .sort((a, b) => a.name.localeCompare(b.name))

  for (const name of PREFERRED_VOICE_NAMES) {
    const matches = englishVoices.filter((voice) =>
      voice.name.toLowerCase().includes(name.toLowerCase())
    )
    if (matches.length) return matches.find((voice) => voice.localService) || matches[0]
  }

  return englishVoices.find((voice) =>
    /female|woman|zira|aria|jenny|heera/i.test(voice.name)
  ) || englishVoices[0] || null
}

const splitIntoChunks = (text) => {
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) || [text]
  return sentences.flatMap((sentence) => {
    const parts = sentence.length > 180 ? sentence.split(/(?<=[,;:])\s+/) : [sentence]
    return parts.flatMap((part) => {
      if (part.length <= 180) return [part.trim()].filter(Boolean)

      const chunks = []
      let chunk = ''
      part.split(/\s+/).forEach((word) => {
        if (chunk && `${chunk} ${word}`.length > 180) {
          chunks.push(chunk)
          chunk = word
        } else {
          chunk = chunk ? `${chunk} ${word}` : word
        }
      })
      if (chunk) chunks.push(chunk)
      return chunks
    })
  }).filter(Boolean)
}

const appendRecognizedText = (answer, recognizedText) => {
  const recognized = recognizedText.trim()
  if (!recognized) return answer

  const separator = answer && !/\s$/.test(answer) ? ' ' : ''
  return `${answer}${separator}${recognized}`
}

function Step2interview({ interviewData }) {
  const navigate = useNavigate()

  const recognitionRef = useRef(null)
  const isListeningRef = useRef(false)
  const utterancesRef = useRef([])
  const speechSessionRef = useRef(0)
  const spokenTextRef = useRef('')
  const spokenVoiceRef = useRef('')
  const answerRef = useRef('')
  const transcriptRef = useRef('')
  const sessionTextRef = useRef('')
  const selectedVoiceRef = useRef(null)
  const videoRef = useRef(null)
  const isSpeakingRef = useRef(false)

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

  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [speechError, setSpeechError] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [voicesReady, setVoicesReady] = useState(false)

  const questionText = currentQuestion?.question || currentQuestion?.text || 'Question unavailable'
  const difficulty = currentQuestion?.difficulty || 'easy'
  const progress = totalQuestions ? ((questionIndex + 1) / totalQuestions) * 100 : 0
  const feedbackText = typeof feedback === 'string' ? feedback : feedback?.feedback

  const updateTranscript = useCallback((value) => {
    transcriptRef.current = value
    setTranscript(value)
  }, [])

  const appendTranscript = useCallback((recognizedText) => {
    const updatedAnswer = appendRecognizedText(answerRef.current, recognizedText)
    answerRef.current = updatedAnswer
    setAnswer(updatedAnswer)
  }, [])

  const stopSpeaking = useCallback(() => {
    speechSessionRef.current += 1
    utterancesRef.current = []
    spokenTextRef.current = ''
    spokenVoiceRef.current = ''
    isSpeakingRef.current = false
    setIsSpeaking(false)

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const stopListening = useCallback((preserveInterim = false) => {
    if (preserveInterim && transcriptRef.current.trim()) {
      appendTranscript(transcriptRef.current)
    }
    sessionTextRef.current = ''
    updateTranscript('')
    isListeningRef.current = false
    setIsListening(false)

    const recognition = recognitionRef.current
    if (recognition) {
      try {
        recognition.stop()
      } catch (error) {
        if (error?.name !== 'InvalidStateError') {
          setSpeechError('Unable to stop speech recognition. Please try again.')
        }
      }
    }
  }, [appendTranscript, updateTranscript])

  const stopAllVoiceActivity = useCallback(() => {
    stopListening()
    stopSpeaking()
  }, [stopListening, stopSpeaking])

  const initializeSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined') return

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) {
      setSpeechSupported(false)
      return
    }

    setSpeechSupported(true)
    if (recognitionRef.current) return

    const recognition = new Recognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-IN'
    recognition.onresult = (event) => {
      if (!isListeningRef.current) return
      let interimText = ''

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const text = result[0]?.transcript || ''
        if (result.isFinal) {
          sessionTextRef.current = `${sessionTextRef.current} ${text}`.trim()
        } else interimText += text
      }

      updateTranscript(`${sessionTextRef.current} ${interimText}`.trim())
    }
    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return

      const messages = {
        'not-allowed': 'Microphone access was denied. Allow microphone access in your browser settings.',
        'service-not-allowed': 'Speech recognition is not allowed by this browser.',
        'audio-capture': 'No microphone was found. Connect a microphone and try again.',
        network: 'Speech recognition lost its connection. Check your internet and try again.',
      }
      isListeningRef.current = false
      setIsListening(false)
      setSpeechError(messages[event.error] || 'Speech recognition failed. Please try again.')
    }
    recognition.onend = () => {
      if (!isListeningRef.current) {
        setIsListening(false)
        return
      }

      window.setTimeout(() => {
        if (!isListeningRef.current) return

        try {
          recognition.start()
        } catch (error) {
          if (error?.name === 'InvalidStateError') return
          isListeningRef.current = false
          setIsListening(false)
          setSpeechError('Unable to restart speech recognition. Please try again.')
        }
      }, 250)
    }
    recognitionRef.current = recognition
  }, [updateTranscript])

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current
    if (!speechSupported || !recognition) {
      setSpeechError('Speech recognition is not supported in this browser. You can still type your answer.')
      return
    }
    if (isListeningRef.current) return

    stopSpeaking()
    setSpeechError('')
    sessionTextRef.current = ''
    updateTranscript('')
    isListeningRef.current = true
    setIsListening(true)

    try {
      recognition.start()
    } catch (error) {
      isListeningRef.current = false
      setIsListening(false)
      setSpeechError(error?.name === 'InvalidStateError'
        ? 'Speech recognition is already active. Stop it and try again.'
        : 'Unable to start speech recognition. Check your microphone permissions.')
    }
  }, [speechSupported, stopSpeaking, updateTranscript])

  const initializeVoices = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setVoicesReady(true)
      return
    }

    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) return

    const voice = pickInterviewerVoice(voices)
    selectedVoiceRef.current = voice
    setSelectedVoice(voice)
    setVoicesReady(true)
  }, [])

  const speakQuestion = useCallback((text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis
      || typeof window.SpeechSynthesisUtterance !== 'function') {
      setSpeechError('Text-to-speech is not supported in this browser.')
      return
    }

    const voice = selectedVoiceRef.current
    if (!voice) {
      setSpeechError('No English speech voice is available. You can continue by reading the question.')
      return
    }

    const voiceKey = `${voice.name}:${voice.lang}`
    if (isSpeakingRef.current
      && spokenTextRef.current === text
      && spokenVoiceRef.current === voiceKey) return
    stopSpeaking()

    const session = speechSessionRef.current
    const chunks = splitIntoChunks(text)
    if (!chunks.length) return

    spokenTextRef.current = text
    spokenVoiceRef.current = voiceKey
    isSpeakingRef.current = true
    setSpeechError('')

    const finish = () => {
      if (session !== speechSessionRef.current) return
      utterancesRef.current = []
      spokenTextRef.current = ''
      spokenVoiceRef.current = ''
      isSpeakingRef.current = false
      setIsSpeaking(false)
    }

    utterancesRef.current = chunks.map((chunk, index) => {
      const utterance = new window.SpeechSynthesisUtterance(chunk)
      if (voice) utterance.voice = voice
      utterance.lang = voice?.lang || 'en-US'
      utterance.rate = 0.95
      utterance.pitch = 1
      utterance.volume = 1
      utterance.onstart = () => {
        if (session === speechSessionRef.current) setIsSpeaking(true)
      }
      utterance.onend = () => {
        if (session === speechSessionRef.current && index === chunks.length - 1) finish()
      }
      utterance.onerror = (event) => {
        if (session !== speechSessionRef.current) return
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          setSpeechError('Unable to speak the interview question. You can continue by reading it.')
          stopSpeaking()
          return
        }
        finish()
      }
      return utterance
    })

    window.setTimeout(() => {
      if (session !== speechSessionRef.current) return
      utterancesRef.current.forEach((utterance) => window.speechSynthesis.speak(utterance))
    }, 60)
  }, [stopSpeaking])

  useEffect(() => {
    const duration = getQuestionDuration(currentQuestion)
    setAnswer('')
    answerRef.current = ''
    setFeedback(null)
    setTimeLeft(duration)
    setTimerActive(duration > 0)
  }, [currentQuestion, questionIndex])

  useEffect(() => {
    initializeSpeechRecognition()
    return () => {
      const recognition = recognitionRef.current
      if (recognition) {
        recognition.onresult = null
        recognition.onerror = null
        recognition.onend = null
        try {
          recognition.abort()
        } catch {
          // Recognition may already have stopped.
        }
        recognitionRef.current = null
      }
    }
  }, [initializeSpeechRecognition])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setVoicesReady(true)
      return undefined
    }

    const synthesis = window.speechSynthesis
    initializeVoices()
    synthesis.addEventListener('voiceschanged', initializeVoices)
    const fallback = window.setTimeout(() => setVoicesReady(true), 1500)
    return () => {
      synthesis.removeEventListener('voiceschanged', initializeVoices)
      window.clearTimeout(fallback)
    }
  }, [initializeVoices])

  useEffect(() => {
    stopListening()
    updateTranscript('')
  }, [questionText, questionIndex, stopListening, updateTranscript])

  useEffect(() => {
    if (!voicesReady) return
    if (voiceEnabled) speakQuestion(questionText)
    else stopSpeaking()
  }, [questionText, questionIndex, voicesReady, selectedVoice, speakQuestion, stopSpeaking, voiceEnabled])

  useEffect(() => {
    answerRef.current = answer
  }, [answer])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isSpeaking) {
      if (video.readyState > 0) video.currentTime = 0
      video.play().catch((error) => {
        if (error?.name !== 'AbortError') {
          setSpeechError('The interviewer video could not be played.')
        }
      })
    } else {
      video.pause()
      if (video.readyState > 0) video.currentTime = 0
    }
  }, [isSpeaking])

  useEffect(() => () => {
    const recognition = recognitionRef.current
    if (recognition) {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      try {
        recognition.abort()
      } catch {
        // Recognition may already have stopped.
      }
    }
    recognitionRef.current = null
    isListeningRef.current = false
    speechSessionRef.current += 1
    utterancesRef.current = []
    spokenTextRef.current = ''
    spokenVoiceRef.current = ''
    isSpeakingRef.current = false
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

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
      stopAllVoiceActivity()
      navigate(`/interview/${interviewData.interviewId}/report`)
    } else {
      setQuestionIndex(pendingTransition.questionIndex)
      setCurrentQuestion(pendingTransition.question)
      setIsCodeOn(false)
    }

    setFeedbackTimeLeft(null)
    setPendingTransition(null)
  }, [feedbackTimeLeft, interviewData.interviewId, navigate, pendingTransition, stopAllVoiceActivity])

  const handleSubmit = useCallback(async (automatic = false) => {
    const hasContent = answerRef.current.trim() || transcriptRef.current.trim()
    if ((!hasContent && automatic !== true) || loading || isShowingFeedback) return

    stopListening(true)
    stopSpeaking()
    setTimerActive(false)
    setLoading(true)
    setSubmissionError('')

    try {
      const response = await submitInterviewAnswer(interviewData.interviewId, answerRef.current)

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
  }, [interviewData.interviewId, isShowingFeedback, loading, questions, stopListening, stopSpeaking, timeLeft])

  const handleAnswerChange = (event) => {
    const nextAnswer = event.target.value
    answerRef.current = nextAnswer
    setAnswer(nextAnswer)
  }

  const handleSubmitCode = (code, language) => {
    setAnswer((previous) => {
      const separator = previous.trim() ? '\n\n' : ''
      const nextAnswer = previous + separator + '```' + language + '\n' + code + '\n```'
      answerRef.current = nextAnswer
      return nextAnswer
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
        <article className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="relative mx-auto w-32 shrink-0 sm:mx-0">
            <video
              ref={videoRef}
              src={interviewerVideo}
              muted
              playsInline
              loop
              preload="auto"
              aria-label="AI interviewer"
              className={`aspect-[3/4] w-full rounded-2xl border-2 object-cover transition ${
                isSpeaking ? 'border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.35)]' : 'border-white/10'
              }`}
            />
            <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
              isSpeaking ? 'bg-emerald-400 text-black' : 'bg-black/80 text-white/60'
            }`}>
              {isSpeaking ? 'Speaking' : 'AI Interviewer'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-block rounded-md bg-white/10 px-3 py-1 text-sm text-white/80">
                Question {questionIndex + 1}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={voiceEnabled}
                aria-label={`Toggle interviewer voice${selectedVoice ? ` (${selectedVoice.name})` : ''}`}
                onClick={() => setVoiceEnabled((enabled) => !enabled)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 transition hover:bg-white/10"
              >
                {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                Voice {voiceEnabled ? 'on' : 'off'}
              </button>
            </div>
            <p className="text-lg leading-relaxed">{questionText}</p>
          </div>
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
          onChange={handleAnswerChange}
          onKeyDown={handleKeyDown}
          placeholder="Write your answer here..."
          readOnly={loading || isShowingFeedback}
          className={`min-h-52 flex-1 resize-y rounded-2xl border border-white/10 bg-white/[0.03] p-5 pb-16 text-white outline-none placeholder:text-white/35 focus:border-white/25 ${
            isCodeOn ? 'font-mono text-sm' : ''
          }`}
        />
        <div className="relative -mt-16 mb-4 flex min-h-12 items-center justify-between gap-3 px-4">
          <div className="min-w-0 text-xs text-white/45" aria-live="polite">
            {transcript && <span className="block break-words">Hearing: ...{transcript.slice(-160)}</span>}
            {!speechSupported && <span>Voice input is unavailable; type your answer instead.</span>}
            {isListening && <span className="inline-flex items-center gap-2 text-red-300"><span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />Recording</span>}
          </div>
          <button
            type="button"
            onClick={() => (isListening ? stopListening(true) : startListening())}
            disabled={!speechSupported || loading || isShowingFeedback}
            aria-label={isListening ? 'Stop recording' : 'Start voice input'}
            aria-pressed={isListening}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
              isListening
                ? 'border-red-400/40 bg-red-500/15 text-red-200'
                : 'border-white/10 bg-white/[0.06] text-white/80 hover:bg-white/10'
            }`}
          >
            {isListening ? <MicOff size={17} /> : <Mic size={17} />}
            {isListening ? 'Stop' : 'Speak'}
          </button>
        </div>
        {speechError && (
          <p role="alert" className="mb-2 text-sm text-red-300">{speechError}</p>
        )}
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
            onClick={() => handleSubmit()}
            disabled={(!answer.trim() && !transcript.trim()) || loading || isShowingFeedback}
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
