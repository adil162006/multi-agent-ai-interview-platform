import React, { useEffect, useState } from 'react'
import { ArrowRight, CameraOff, Code2, Clock3, MessageSquare, Mic } from 'lucide-react'
import femaleAiVideo from '../../assets/female-ai.mp4'

function Step2interview({ interviewData, user, onInterviewUpdate }) {
  const [answer, setAnswer] = useState('')
  const questionIndex = interviewData.currentQuestionIndex ?? 0
  const totalQuestions = interviewData.totalQuestions ?? 0
  const progress = totalQuestions ? ((questionIndex + 1) / totalQuestions) * 100 : 0
  const userName = user?.name || user?.fullName || user?.username || 'You'

  useEffect(() => setAnswer(''), [questionIndex])

  const handleSubmit = async () => {
    if (!answer.trim()) return

    // Submission is intentionally disabled for now.
    // const result = await submitInterviewAnswer(interviewData.interviewId, answer.trim())
    // Handle the next question or completed interview here when submission is enabled.
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <main className="min-h-screen bg-slate-200 p-3 text-white sm:p-5">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[30px] border border-white/10 bg-[#101115] shadow-2xl lg:grid-cols-[36%_64%]">
        <aside className="flex flex-col border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r">
          <video className="aspect-video w-full rounded-2xl bg-black object-cover" src={femaleAiVideo} autoPlay muted loop playsInline />
          <div className="my-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl font-semibold">{userName.charAt(0).toUpperCase()}</div>
            <p className="mt-3 text-sm text-white/60">{userName}</p>
          </div>
          <div className="flex justify-center gap-3">
            {[Mic, CameraOff, Code2].map((Icon, index) => (
              <button key={index} type="button" aria-label={['Microphone', 'Camera', 'Code'][index]} className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70"><Icon size={19} /></button>
            ))}
          </div>
          <p className="mt-7 text-center text-xs text-white/40">Coding question? Use &lt;&gt; to write &amp; add code</p>
        </aside>

        <section className="flex flex-col p-5 sm:p-7 lg:p-9">
          <header className="mb-7">
            <h1 className="text-xl font-semibold">AI Interview</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-white/45"><Clock3 size={14} /> {interviewData.question?.difficulty || 'easy'}</p>
          </header>
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3 text-sm text-white/50"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black"><MessageSquare size={19} /></span>Question {questionIndex + 1}</div>
            <p className="text-lg leading-relaxed">{interviewData.question?.question || interviewData.question?.text || 'Question unavailable'}</p>
          </article>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-white/45"><span>Progress</span><span>{questionIndex + 1}/{totalQuestions}</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
          <label htmlFor="interview-answer" className="mb-2 mt-5 text-sm text-white/70">Your Answer</label>
          <textarea id="interview-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={handleKeyDown} placeholder="Write your answer here... or speak if mic is on" className="min-h-48 flex-1 resize-y rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-white outline-none placeholder:text-white/30 focus:border-white/25" />
          <footer className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
            <p className="text-sm text-white/40">Press <kbd className="rounded bg-white/10 px-2 py-1 text-xs text-white/70">Ctrl+Enter</kbd> to submit</p>
            <button type="button" onClick={handleSubmit} disabled={!answer.trim()} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-40">Submit Answer <ArrowRight size={18} /></button>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default Step2interview
