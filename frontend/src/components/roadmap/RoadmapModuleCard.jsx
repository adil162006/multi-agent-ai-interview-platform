import { FiBookOpen, FiChevronDown, FiClock, FiYoutube } from 'react-icons/fi'

const difficultyStyle = {
  Easy: 'text-emerald-400',
  Medium: 'text-violet-400',
  Hard: 'text-rose-400',
}

function RoadmapModuleCard({ module, index }) {
  const difficulty = module.difficulty || 'Easy'
  const articleUrl = module.articles || module.article

  return (
    <details className="group overflow-hidden rounded-2xl border border-white/5 bg-[#171717] shadow-lg shadow-black/10 open:bg-[#191919]">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-emerald-400">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white sm:text-base">{module.title}</span>
          <span className="mt-1 flex items-center gap-1 text-xs text-white/45">
            <FiClock size={12} /> {module.duration}
          </span>
        </span>
        <span className={`hidden text-xs font-semibold sm:block ${difficultyStyle[difficulty] || 'text-white/60'}`}>
          {difficulty}
        </span>
        <FiChevronDown size={16} className="shrink-0 text-white/40 transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-white/5 px-4 pb-4 pt-3 sm:px-5">
        <p className="text-sm leading-6 text-white/60">{module.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {module.youtube && (
            <a
              href={module.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
            >
              <FiYoutube size={14} /> Watch Tutorial
            </a>
          )}
          {articleUrl && (
            <a
              href={articleUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-white/65 transition hover:bg-white/10"
            >
              <FiBookOpen size={14} /> Read Article
            </a>
          )}
        </div>
      </div>
    </details>
  )
}

export default RoadmapModuleCard
