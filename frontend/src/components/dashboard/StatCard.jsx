import { motion } from 'motion/react'

function StatCard({ label, value, badge, sub, subBelow, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className='rounded-2xl bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] border border-white/5 shadow-xl shadow-black/20 p-5 md:p-6 flex flex-col gap-2'
    >
      <p className='text-[11px] md:text-xs font-semibold uppercase tracking-wider text-white/50'>
        {label}
      </p>
      <h3 className='text-white text-2xl md:text-3xl font-bold tracking-tight'>{value}</h3>

      <div className={`flex ${subBelow ? 'flex-col items-start' : 'items-center flex-wrap'} gap-1.5`}>
        <span className='px-2 py-0.5 rounded-md bg-white/10 text-white/80 text-[10px] md:text-[11px] font-semibold'>
          {badge}
        </span>
        <span className='text-white/40 text-[11px] md:text-xs'>{sub}</span>
      </div>
    </motion.div>
  )
}

export default StatCard
