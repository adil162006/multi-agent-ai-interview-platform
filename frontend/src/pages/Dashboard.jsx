import React, { useEffect, useState } from 'react'
import RadarCard from '../components/dashboard/RadarCard'
import StatCard from '../components/dashboard/StatCard'
import { useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { FiMenu } from 'react-icons/fi'
import { getAllInterviews } from '../apis/interview.api'

/* ---------- PAGE ---------- */
function Dashboard() {
  const user = useSelector((state) => state.user.user)
  const { openMobileSidebar } = useOutletContext()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalQuestions: 0,
    completed: 0,
    averageScore: 0,
  })

  const [technicalData,setTechnicalData] = useState([])
  const [hrData,setHrData] = useState([])
  const [technicalCount,setTechnicalCount] = useState(0)
  const [hrCount,setHrCount] = useState(0)
  useEffect(() => {
    let isActive = true

    const fetchInterview = async () => {
      setIsLoading(true)
      setDashboardError('')

      const response = await getAllInterviews()
      if (!isActive) return

      if (!response?.success || !response.stats) {
        setDashboardError(response?.message || 'Unable to load dashboard data. Please try again.')
        setIsLoading(false)
        return
      }

      setStats({
        totalInterviews: response.stats.totalInterviews ?? 0,
        totalQuestions: response.stats.totalQuestions ?? 0,
        completed: response.stats.completed ?? 0,
        averageScore: response.stats.averageScore ?? 0,
      })
      setTechnicalData(Array.isArray(response.technicalData) ? response.technicalData : [])
      setHrData(Array.isArray(response.hrData) ? response.hrData : [])
      setTechnicalCount(response.technicalCount ?? 0)
      setHrCount(response.hrCount ?? 0)
      setIsLoading(false)
    }

    fetchInterview()

    return () => {
      isActive = false
    }
  }, [refreshKey])

  const statsData = [
    { label: 'Total Interviews', value: isLoading || dashboardError ? '—' : stats.totalInterviews, badge: 'All Time', sub: 'Interviews Created' },
    { label: 'Questions Asked', value: isLoading || dashboardError ? '—' : stats.totalQuestions, badge: 'All Interviews', sub: 'Across All Interviews' },
    { label: 'Completed', value: isLoading || dashboardError ? '—' : stats.completed, badge: `${stats.totalInterviews} Total`, sub: 'Interviews Finished' },
    { label: 'Average Score', value: isLoading || dashboardError ? '—' : `${stats.averageScore}/100`, badge: 'Completed Only', sub: 'Average Performance', subBelow: true },
  ]

  const historyCharts = [
    { title: 'Technical Interviews', count: technicalCount, data: technicalData },
    { title: 'HR Interviews', count: hrCount, data: hrData },
  ]

  return (
    <div className='bg-white min-h-screen font-sans flex text-[#0a0a0a]'>
      <motion.main
        className='flex flex-col flex-1 min-w-0 min-h-screen px-3 sm:px-4 md:px-6 py-4 md:py-6'
      >
        {/* top area */}
        <div className='flex items-center justify-between pb-5 md:pb-6 border-b border-black/10'>
          <div className='flex items-center gap-2.5'>
            {/* mobile menu button (opens sidebar drawer) */}
            <motion.button
              onClick={openMobileSidebar}
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

          {dashboardError && (
            <div className='mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
              <span>{dashboardError}</span>
              <button
                type='button'
                onClick={() => setRefreshKey((key) => key + 1)}
                className='font-semibold underline underline-offset-2'
              >
                Try again
              </button>
            </div>
          )}

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {historyCharts.map((chart, i) => (
              <RadarCard
                key={chart.title}
                index={i}
                isLoading={isLoading}
                hasError={Boolean(dashboardError)}
                {...chart}
              />
            ))}
          </div>
        </section>
      </motion.main>
    </div>
  )
}

export default Dashboard