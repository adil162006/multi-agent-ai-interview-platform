import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  Sparkles,
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import { motion } from 'motion/react'

/* ---------- Animation variants ---------- */
const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

/* ---------- Helpers ---------- */
const titleCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1)

const scoreColor = (score) =>
  score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600'

const scoreHex = (score) => (score >= 75 ? '#059669' : score >= 50 ? '#d97706' : '#e11d48')

const scoreBg = (score) =>
  score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'

const clampScore = (value) => Math.max(0, Math.min(100, Number(value) || 0))

const METRICS = [
  ['correctness', 'Correctness'],
  ['clarity', 'Clarity'],
  ['relevance', 'Relevance'],
  ['detail', 'Detail'],
  ['efficiency', 'Efficiency'],
  ['communication', 'Communication'],
  ['problemSolving', 'Problem solving'],
  ['creativity', 'Creativity'],
]

const RING_RADIUS = 42
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const SECTIONS = (report) => [
  [CheckCircle2, 'Strengths', report?.strengths, 'text-emerald-600'],
  [AlertTriangle, 'Areas to improve', report?.weaknesses, 'text-amber-600'],
  [Lightbulb, 'Recommended next steps', report?.recommendations, 'text-blue-600'],
]

function Step3report({ report }) {
  const navigate = useNavigate()
  const score = clampScore(report?.overallScore)
  const questions = report?.questions || []

  const qScores = questions.map((q) => clampScore(q.feedback?.score))
  const avgScore = qScores.length
    ? Math.round(qScores.reduce((sum, s) => sum + s, 0) / qScores.length)
    : 0
  const bestScore = qScores.length ? Math.max(...qScores) : 0
  const worstScore = qScores.length ? Math.min(...qScores) : 0

  /* ---------- PDF export ---------- */
  const downloadReport = () => {
    const pdf = new jsPDF()
    let y = 18

    const line = (text, size = 10, bold = false) => {
      pdf.setFont('helvetica', bold ? 'bold' : 'normal')
      pdf.setFontSize(size)
      const lines = pdf.splitTextToSize(String(text || '-'), 175)
      if (y + lines.length * 6 > 280) {
        pdf.addPage()
        y = 18
      }
      pdf.text(lines, 18, y)
      y += lines.length * 6 + 3
    }

    line('Interview Report', 20, true)
    line(`${titleCase(report?.type)} interview - ${report?.role || 'Interview'}`, 11)
    line(`Overall score: ${score}/100`, 14, true)
    line(
      `Completed ${report?.updatedAt ? new Date(report.updatedAt).toLocaleDateString() : ''}`
    )

    line('Summary', 13, true)
    line(report?.summary || 'No summary available.')

    ;[
      ['Strengths', report?.strengths],
      ['Areas to improve', report?.weaknesses],
      ['Recommended next steps', report?.recommendations],
    ].forEach(([heading, items]) => {
      line(heading, 13, true)
      ;(items?.length ? items : ['No items available.']).forEach((item) => line(`- ${item}`))
    })

    questions.forEach((item, index) => {
      line(`Question ${index + 1}: ${item.question}`, 13, true)
      line(`Your answer: ${item.userAnswer || 'No answer recorded.'}`)
      line(
        `Score: ${Number(item.feedback?.score) || 0}/100 - Difficulty: ${titleCase(
          item.difficulty || 'easy'
        )}`
      )
      const breakdown = METRICS.filter(([key]) => item.feedback?.[key] !== undefined)
        .map(([key, label]) => `${label}: ${clampScore(item.feedback[key])}`)
        .join(' | ')
      if (breakdown) line(`Breakdown: ${breakdown}`)
      line(`Feedback: ${item.feedback?.feedback || 'No feedback available.'}`)
      if (item.feedback?.improvements?.length) {
        line(`Suggestions: ${item.feedback.improvements.join('; ')}`)
      }
    })

    pdf.save(`interview-report-${report?._id || 'results'}.pdf`)
  }

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-[#111] sm:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* ---------- Top bar ---------- */}
        <motion.header
          variants={reveal}
          className="mb-7 flex flex-wrap items-center justify-between gap-4"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-black/[.03]"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>

          <button
            onClick={downloadReport}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
          >
            <Download size={16} /> Download report
          </button>
        </motion.header>

        {/* ---------- Title ---------- */}
        <motion.div variants={reveal} className="mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-gray-500">
            Interview results
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Interview Report</h1>
          <p className="mt-2 text-sm text-gray-500">
            {titleCase(report?.type)} interview <span className="mx-1">·</span>{' '}
            {report?.role || 'Role'} <span className="mx-1">·</span> {questions.length} questions
          </p>
        </motion.div>

        {/* ---------- Score + question count ---------- */}
        <motion.section variants={stagger} className="grid gap-4 sm:grid-cols-3">
          <motion.div
            variants={reveal}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:col-span-2"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
              <Target size={15} /> Final assessment
            </div>

            <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row">
              {/* Circular progress ring */}
              <div className="relative h-28 w-28 shrink-0">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r={RING_RADIUS}
                    fill="none"
                    stroke={scoreHex(score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={RING_CIRCUMFERENCE * (1 - score / 100)}
                    style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                  />
                </svg>
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center ${scoreColor(score)}`}
                >
                  <span className="text-3xl font-black leading-none">{score}</span>
                  <span className="mt-1 text-[10px] font-semibold text-gray-500">/ 100</span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold">
                  {score >= 75 ? 'Strong performance' : score >= 50 ? 'Good progress' : 'Keep practicing'}
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-gray-600">
                  {report?.summary ||
                    'Your interview is complete. Review the question feedback below to see what went well and where to focus next.'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={reveal}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Questions answered
            </div>
            <div className="mt-3 text-4xl font-black">{questions.length}</div>
            <p className="mt-1 text-sm capitalize text-gray-500">
              {report?.type} · {report?.role || 'Interview'}
            </p>

            {questions.length > 0 && (
              <dl className="mt-5 space-y-3 border-t border-black/5 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Average</dt>
                  <dd className={`font-bold ${scoreColor(avgScore)}`}>{avgScore}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Best answer</dt>
                  <dd className={`font-bold ${scoreColor(bestScore)}`}>{bestScore}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Weakest answer</dt>
                  <dd className={`font-bold ${scoreColor(worstScore)}`}>{worstScore}</dd>
                </div>
              </dl>
            )}
          </motion.div>
        </motion.section>

        {/* ---------- Strengths / weaknesses / recommendations ---------- */}
        <motion.section variants={stagger} className="mt-4 grid gap-4 md:grid-cols-3">
          {SECTIONS(report).map(([Icon, heading, items, color]) => (
            <motion.div
              variants={reveal}
              key={heading}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <h3 className="flex items-center gap-2 font-bold">
                <Icon size={17} className={color} />
                {heading}
              </h3>

              {items?.length ? (
                <ul className="mt-4 space-y-2.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-5 text-gray-600">
                      <span className={`mt-1 ${color}`}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No items provided for this report.</p>
              )}
            </motion.div>
          ))}
        </motion.section>

        {/* ---------- Detailed review heading ---------- */}
        <motion.div variants={reveal} className="mb-3 mt-9 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-gray-500">
              Detailed review
            </p>
            <h2 className="mt-1 text-2xl font-extrabold">Question-by-Question Evaluation</h2>
          </div>
          <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 sm:block">
            {questions.length} questions
          </span>
        </motion.div>

        {/* ---------- Per-question cards ---------- */}
        <motion.section variants={stagger} className="space-y-4">
          {questions.map((item, index) => {
            const feedback = item.feedback || {}
            const qScore = clampScore(feedback.score)

            return (
              <motion.article
                variants={reveal}
                key={index}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold leading-6">{item.question}</h3>
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-500">
                        <span className="rounded-full bg-gray-100 px-2 py-1">
                          {titleCase(item.difficulty || 'easy')}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-1">
                          {item.timer || 60}s
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`shrink-0 text-right ${scoreColor(qScore)}`}>
                    <div className="text-2xl font-black">{qScore}</div>
                    <div className="text-[10px] font-bold uppercase text-gray-400">Score</div>
                  </div>
                </div>

                {/* User answer */}
                <div className="mt-5 rounded-xl bg-[#f7f7f5] p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Your answer
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {item.userAnswer || 'No answer recorded.'}
                  </p>
                </div>

                {/* Score bar */}
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs font-semibold text-gray-500">
                    <span>Question score</span>
                    <span>{qScore}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${scoreBg(qScore)}`}
                      style={{ width: `${qScore}%` }}
                    />
                  </div>
                </div>

                {/* Metric breakdown */}
                {METRICS.some(([key]) => feedback[key] !== undefined) && (
                  <div className="mt-4">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Score breakdown
                    </p>
                    <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      {METRICS.filter(([key]) => feedback[key] !== undefined).map(([key, label]) => {
                        const value = clampScore(feedback[key])
                        return (
                          <div key={key}>
                            <div className="mb-1 flex justify-between text-xs">
                              <span className="font-medium text-gray-600">{label}</span>
                              <span className={`font-bold ${scoreColor(value)}`}>{value}</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full ${scoreBg(value)}`}
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* AI feedback */}
                <div className="mt-4 rounded-xl border border-black/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    AI feedback
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {feedback.feedback || 'No specific feedback was provided.'}
                  </p>

                  {feedback.improvements?.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-1 text-xs font-bold text-gray-600">Suggestions to improve</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                        {feedback.improvements.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })}

          {questions.length === 0 && (
            <motion.div
              variants={reveal}
              className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-gray-500"
            >
              Question details are not available for this interview.
            </motion.div>
          )}
        </motion.section>

        {/* ---------- Next steps ---------- */}
        {report?.recommendations?.length > 0 && (
          <motion.section variants={reveal} className="mt-8 rounded-2xl bg-[#0a0a0a] p-6 text-white">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Sparkles size={18} className="text-amber-300" /> Your next steps
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {report.recommendations.map((item, i) => (
                <div key={i} className="rounded-xl bg-white/10 p-4 text-sm leading-5 text-white/85">
                  <span className="mr-2 font-bold text-amber-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.main>
  )
}

export default Step3report