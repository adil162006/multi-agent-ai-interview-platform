import { useEffect, useState } from 'react'
import { FiArrowLeft, FiCheckCircle, FiClock, FiLayers } from 'react-icons/fi'
import { motion } from 'motion/react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import RoadmapModuleCard from '../components/roadmap/RoadmapModuleCard'
import api from '../utils/axios'

function ShowRoadmap() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [roadmap, setRoadmap] = useState(location.state?.roadmap ?? null)
  const [loading, setLoading] = useState(!location.state?.roadmap)
  const [error, setError] = useState('')

  useEffect(() => {
    if (location.state?.roadmap?._id === id) {
      setRoadmap(location.state.roadmap)
      setLoading(false)
      return
    }

    let active = true
    const fetchRoadmap = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get(`/api/roadmap/${id}`)
        if (active) setRoadmap(response.data?.data ?? null)
      } catch (fetchError) {
        if (active) setError('This roadmap could not be loaded.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchRoadmap()
    return () => { active = false }
  }, [id, location.state])

  const backAction = (
    <button
      type="button"
      onClick={() => navigate('/roadmap')}
      className="flex h-9 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 text-xs font-semibold text-black/65 shadow-sm transition hover:border-black/20 hover:text-black"
    >
      <FiArrowLeft size={14} /> Back to builder
    </button>
  )

  return (
    <div className="min-h-screen bg-[#f6f6f4] font-sans text-white">
      <Navbar label="Your Roadmap" action={backAction} />

      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-20 sm:px-6">
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-black" />
          </div>
        ) : error || !roadmap ? (
          <div className="rounded-2xl bg-[#171717] p-8 text-center">
            <p className="text-sm text-white/60">{error || 'Roadmap not found.'}</p>
            <button type="button" onClick={() => navigate('/roadmap')} className="mt-4 text-sm font-semibold text-white underline">
              Back to roadmap builder
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <section className="rounded-[1.75rem] bg-[#111] p-5 shadow-2xl shadow-black/15 sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">Your roadmap</p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{roadmap.title}</h1>
              <p className="mt-2 text-sm text-white/55">
                Target: <span className="font-semibold text-violet-300">{roadmap.targetPackage}</span>
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/[0.07] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/45"><FiCheckCircle size={14} /> Difficulty</p>
                  <p className="mt-2 text-sm font-semibold">{roadmap.level}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.07] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/45"><FiClock size={14} /> Duration</p>
                  <p className="mt-2 text-sm font-semibold">{roadmap.duration}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.07] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/45"><FiLayers size={14} /> Modules</p>
                  <p className="mt-2 text-sm font-semibold">{roadmap.modules?.length ?? 0} topics</p>
                </div>
              </div>
            </section>

            <section className="mt-7">
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                <FiLayers size={15} /> Learning Modules
              </h2>
              {roadmap.modules?.length ? (
                <div className="space-y-3">
                  {roadmap.modules.map((module, index) => (
                    <RoadmapModuleCard key={`${module.title}-${index}`} module={module} index={index} />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl bg-[#171717] p-5 text-sm text-white/55">No learning modules are available for this roadmap.</p>
              )}
            </section>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default ShowRoadmap
