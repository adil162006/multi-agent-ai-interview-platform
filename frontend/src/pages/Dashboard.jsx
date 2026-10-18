import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { motion } from 'motion/react'
import { FiMenu } from 'react-icons/fi'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

/* ---------- SAMPLE DATA (replace with API data later) ---------- */
const statsData = [
  { label: 'Total Interviews', value: 21, badge: 'All Time', sub: 'Interviews Created' },
  { label: 'Questions Solved', value: 126, badge: 'Answered', sub: 'Across All Interviews' },
  { label: 'Completed', value: 15, badge: '21 Total', sub: 'Interviews Finished' },
  { label: 'Average Score', value: '23/100', badge: 'Completed Only', sub: 'Average Performance', subBelow: true },
]

const technicalData = [
  { skill: 'Correctness', score: 8 },
  { skill: 'Clarity', score: 7 },
  { skill: 'Relevance', score: 9 },
  { skill: 'Detail', score: 6 },
  { skill: 'Efficiency', score: 7 },
  { skill: 'Communication', score: 8 },
  { skill: 'Problem solving', score: 9 },
  { skill: 'Creativity', score: 6 },
]

const hrData = [
  { skill: 'Correctness', score: 7 },
  { skill: 'Clarity', score: 8 },
  { skill: 'Relevance', score: 9 },
  { skill: 'Detail', score: 7 },
  { skill: 'Efficiency', score: 8 },
  { skill: 'Communication', score: 9 },
  { skill: 'Problem solving', score: 8 },
  { skill: 'Creativity', score: 7 },
]

const historyCharts = [
  { title: 'Technical Interviews', count: 13, data: technicalData },
  { title: 'HR Interviews', count: 2, data: hrData },
]

/* ---------- SMALL COMPONENTS ---------- */
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

function RadarCard({ title, count, data, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
      className='rounded-2xl bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] border border-white/5 shadow-xl shadow-black/20 p-4 md:p-6 flex flex-col'
    >
      <div className='w-full h-[260px] sm:h-[300px] md:h-[320px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <RadarChart data={data} outerRadius='65%'>
            <PolarGrid stroke='rgba(255,255,255,0.12)' />
            <PolarAngleAxis
              dataKey='skill'
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
            />
            <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              dataKey='score'
              stroke='#e5e5e5'
              strokeWidth={2}
              fill='#ffffff'
              fillOpacity={0.12}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className='text-white text-center text-sm md:text-base font-semibold mt-2'>
        {title} ({count})
      </p>
    </motion.div>
  )
}

/* ---------- PAGE ---------- */
function Dashboard({ user, setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await api.post('/api/auth/logout')
      if (response.data.success) {
        setUser(null)
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='bg-white min-h-screen font-sans flex text-[#0a0a0a]'>
      <Sidebar
        user={user}
        onNewInterview={() => navigate('/interview')}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <motion.main
        className={`flex flex-col flex-1 min-w-0 min-h-screen px-3 sm:px-4 md:px-6 py-4 md:py-6 transition-[margin] duration-300 ${
          sidebarOpen ? 'md:ml-[260px]' : 'md:ml-[72px]'
        }`}
      >
        {/* top area */}
        <div className='flex items-center justify-between pb-5 md:pb-6 border-b border-black/10'>
          <div className='flex items-center gap-2.5'>
            {/* mobile menu button (opens sidebar drawer) */}
            <motion.button
              onClick={() => setMobileOpen(true)}
              whileTap={{ scale: 0.92 }}
              aria-label='Open menu'
              className='md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-black/10 text-[#0a0a0a] shadow-md shadow-black/10 cursor-pointer'
            >
              <FiMenu size={20} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className='text-black/40 text-[11px] md:text-xs font-medium mb-1'>Overview</p>
              <h2 className='text-[#0a0a0a] text-xl md:text-2xl font-bold tracking-tight'>
                Hello, {user?.name?.split(' ')[0] || 'Adil'} <span className='inline-block'>👋</span>
              </h2>
            </motion.div>
          </div>
        </div>

        {/* stat cards */}
        <section className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6'>
          {statsData.map((stat, i) => (
            <StatCard key={stat.label} index={i} {...stat} />
          ))}
        </section>

        {/* interview history */}
        <section className='mt-8'>
          <p className='text-black/40 text-[11px] md:text-xs font-medium uppercase tracking-wider mb-1'>
            Performance
          </p>
          <h3 className='text-[#0a0a0a] text-lg md:text-xl font-semibold tracking-tight mb-4'>
            Interview History
          </h3>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {historyCharts.map((chart, i) => (
              <RadarCard key={chart.title} index={i} {...chart} />
            ))}
          </div>
        </section>
      </motion.main>
    </div>
  )
}

export default Dashboard