import { Check, Coins } from 'lucide-react'

function PlanCard({ name, price, coinAmount, features, actionLabel, popular = false, claimed = false, onAction, disabled = false }) {
  return (
    <article className={`relative flex min-h-[394px] flex-col rounded-[22px] border border-white/10 bg-[#171719] p-6 text-white shadow-[0_22px_55px_rgba(17,12,30,0.16)] sm:p-7 ${popular ? 'ring-1 ring-violet-500/25' : ''}`}>
      {popular && <span className="absolute right-5 top-5 rounded-full bg-violet-600 px-3 py-1 text-[11px] font-semibold">Popular</span>}
      <p className="text-sm font-semibold text-white/90">{name}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-[30px] font-bold leading-none tracking-tight">{price}</span>
        {price !== 'Free' && <span className="text-xs font-medium text-white/45">INR</span>}
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.07] px-3 py-3 text-sm font-medium text-white/90">
        <Coins size={16} className="fill-amber-400 text-amber-400" />
        <span>{coinAmount} Interview Coins</span>
      </div>
      <ul className="mt-4 flex flex-1 flex-col gap-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-[13px] text-white/65">
            <Check size={15} strokeWidth={2.5} className="shrink-0 text-emerald-400" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={claimed || disabled}
        aria-disabled={claimed || disabled}
        onClick={onAction}
        tabIndex={claimed ? -1 : undefined}
        className={`mt-5 h-11 w-full rounded-xl text-sm font-semibold transition-colors ${
          claimed || disabled
            ? 'cursor-not-allowed bg-slate-600/70 text-white/55'
            : popular
              ? 'bg-violet-600 text-white shadow-[0_5px_18px_rgba(124,58,237,0.32)] hover:bg-violet-500'
              : 'bg-white/10 text-white/75 hover:bg-white/15'
        }`}
      >
        {actionLabel}
      </button>
    </article>
  )
}

export default PlanCard
