import { motion } from 'motion/react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

function RadarCard({ title, count, data, index, isLoading, hasError }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
      className='rounded-2xl bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] border border-white/5 shadow-xl shadow-black/20 p-4 md:p-6 flex flex-col'
    >
      <div className='w-full h-[260px] sm:h-[300px] md:h-[320px]'>
        {isLoading ? (
          <div className='h-full flex items-center justify-center text-white/50 text-sm'>
            Loading performance data...
          </div>
        ) : hasError ? (
          <div className='h-full flex items-center justify-center text-white/50 text-sm text-center'>
            Performance data is unavailable.
          </div>
        ) : count > 0 && data.length > 0 ? (
          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart data={data} outerRadius='65%'>
              <PolarGrid stroke='rgba(255,255,255,0.12)' />
              <PolarAngleAxis
                dataKey='skill'
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                dataKey='score'
                stroke='#e5e5e5'
                strokeWidth={2}
                fill='#ffffff'
                fillOpacity={0.12}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className='h-full flex items-center justify-center text-white/50 text-sm text-center'>
            Complete a {title.toLowerCase().replace(' interviews', ' interview')} to see your skill breakdown.
          </div>
        )}
      </div>

      <p className='text-white text-center text-sm md:text-base font-semibold mt-2'>
        {title} ({count})
      </p>
    </motion.div>
  )
}

export default RadarCard
