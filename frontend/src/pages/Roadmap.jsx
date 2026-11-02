import { useState } from 'react'
import { AnimatePresence,motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
    FiCheck,
    FiChevronDown,
    FiClock,
    FiSend,
    FiUploadCloud,
    FiX
} from 'react-icons/fi'
import { FaRocket } from 'react-icons/fa'
import Navbar from '../components/Navbar'
import { useCoins } from '../apis/user.api'
import { useDispatch, useSelector } from 'react-redux'
import api from '../utils/axios'
import { updateUser } from '../redux/userSlice'


const PACKAGE_OPTIONS = [
    "10 LPA",
    "15 LPA",
    "20 LPA",
    "30 LPA",
    "40 LPA"
];

const ROLE_OPTIONS = [
    { label: 'Frontend Dev', value: 'Frontend Developer' },
    { label: 'Backend Eng', value: 'Backend Engineer' },
    { label: 'ML Engineer', value: 'Machine Learning Engineer' }
];

function Roadmap() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const[historyOpen,setHistoryOpen] =useState(false);
    const[roadmap,setRoadmap] = useState(null);
    const [role,setRole] = useState(null);
    const [targetPackage,setTargetPackage]= useState(PACKAGE_OPTIONS[2]);
    const [packageOpen,setPackageOpen] = useState(false);
    const[useResume,setUseResume]= useState(false);
    const [loading,setLoading]=useState(false);
    const [historyLoading,setHistoryLoading]=useState(false);
    const [history,setHistory]=useState([]);
    const[error,setError] = useState("") 

    const {resume} = useSelector((state)=>state.resume)
    const includeResume = Boolean(resume && useResume)

    const getRoadmapById=async(id)=>{
        try {
            const response = await api.get(`/api/roadmap/${id}`)
            const selectedRoadmap = response.data?.data
            setRoadmap(selectedRoadmap)
            setHistoryOpen(false)
            navigate(`/roadmap/show/${id}`, { state: { roadmap: selectedRoadmap } })
        } catch (error) {
            setError("This roadmap could not be loaded. Please try again.")
        }
    }

    const getAllRoadmap = async()=>{
        setHistoryLoading(true)
        setError("")
        try {
            const response = await api.get("/api/roadmap/all")
            setHistory(response.data?.data ?? []);
        } catch (error) {
            setError("History could not be fetched. Please try again.")
        }finally{
            setHistoryLoading(false)
        }
    }
    const handleGenerate = async()=>{
        if(!role?.trim() || loading)return null;
        setLoading(true);
        setError("")
        try {
            try {
                const coinResponse = await useCoins({coins:20,action:"roadmap-builder"})
            if (coinResponse?.success) {
                dispatch(updateUser({ interviewCoin: coinResponse.interviewCoin }))
            }
            } catch (error) {
               alert("Failed to reduce coin") 
            }

            const response = await api.post("/api/roadmap/generate",{
                role:role.trim(),
                targetPackage,
                useResume: includeResume,
                resume: includeResume ? resume : null
            })
            const generatedRoadmap = response.data?.data ?? null
            setRoadmap(generatedRoadmap)
            if (generatedRoadmap?._id) {
                navigate(`/roadmap/show/${generatedRoadmap._id}`, { state: { roadmap: generatedRoadmap } })
            }

        } catch (error) {
            console.error("Failed to generate roadmap:",error)
            setError("something went wrong")
        }finally{
            setLoading(false)
        }
    }

    const historyAction = (
        <button
            type="button"
            onClick={() => {
                if (historyOpen) setHistoryOpen(false)
                else {
                    setHistoryOpen(true)
                    getAllRoadmap()
                }
            }}
            aria-expanded={historyOpen}
            className="flex h-9 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 text-xs font-medium text-black/65 shadow-sm transition hover:border-black/20 hover:text-black"
        >
            {historyOpen ? <FiX size={14} /> : <FiClock size={14} />}
            <span>{historyOpen ? 'Close' : 'History'}</span>
        </button>
    );

  return (
    <div className="min-h-screen bg-white font-sans text-[#111]">
        <Navbar label="Roadmap Builder" action={historyAction} />

        <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-44 pt-20">
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="flex w-full max-w-2xl flex-col items-center text-center"
            >
                <div className="mb-5 flex h-14 w-14 items-center justify-center text-[#273347]">
                    <FaRocket className="-rotate-12" size={42} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    AI Roadmap Generator
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-black/45 sm:text-base">
                    Generate a personalised roadmap for your dream job.
                    <br className="hidden sm:block" />
                    Choose a role and let AI build a complete learning path.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {ROLE_OPTIONS.map((option, index) => {
                        const selected = role === option.value;

                        return (
                            <motion.button
                                key={option.value}
                                type="button"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    setRole(option.value);
                                    setError("");
                                }}
                                aria-pressed={selected}
                                className={`min-w-32 rounded-2xl px-6 py-3 text-sm font-medium shadow-lg shadow-black/10 transition ${
                                    selected
                                        ? 'bg-[#273347] text-white ring-2 ring-[#273347]/20'
                                        : 'bg-[#111] text-white hover:-translate-y-0.5 hover:bg-[#292929]'
                                }`}
                            >
                                {option.label}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="mt-5 w-full max-w-md text-left">
                    <label htmlFor="custom-role" className="mb-2 block text-sm font-medium text-black/60">
                        Or enter your own role
                    </label>
                    <input
                        id="custom-role"
                        type="text"
                        value={ROLE_OPTIONS.some((option) => option.value === role) ? '' : role ?? ''}
                        onChange={(event) => {
                            setRole(event.target.value);
                            setError("");
                        }}
                        placeholder="e.g. Data Analyst, Product Manager"
                        className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm shadow-sm outline-none transition placeholder:text-black/35 focus:border-[#273347] focus:ring-2 focus:ring-[#273347]/10"
                    />
                </div>

                {roadmap && (
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 w-full rounded-2xl border border-black/10 bg-white p-5 text-left shadow-sm sm:p-6"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-black/40">Your roadmap</p>
                                <h2 className="mt-1 text-xl font-bold">{roadmap.title}</h2>
                            </div>
                            <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold">{roadmap.targetPackage}</span>
                        </div>
                        <p className="mt-2 text-sm text-black/55">{roadmap.duration} · {roadmap.level}</p>
                        {roadmap.modules?.length > 0 && (
                            <div className="mt-5 space-y-3">
                                {roadmap.modules.map((module, index) => (
                                    <article key={`${module.title}-${index}`} className="rounded-xl bg-[#f7f7f7] p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="font-semibold">{index + 1}. {module.title}</h3>
                                            <span className="text-xs text-black/45">{module.duration} · {module.difficulty}</span>
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-black/60">{module.description}</p>
                                        {(module.youtube || module.articles) && (
                                            <div className="mt-3 flex gap-4 text-xs font-medium text-[#273347]">
                                                {module.youtube && <a href={module.youtube} target="_blank" rel="noreferrer" className="hover:underline">YouTube resource</a>}
                                                {module.articles && <a href={module.articles} target="_blank" rel="noreferrer" className="hover:underline">Article</a>}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        )}
                    </motion.section>
                )}

                {error && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </motion.section>
        </main>

        <AnimatePresence>
            {historyOpen && (
                <>
                    <motion.button
                        type="button"
                        aria-label="Close roadmap history"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setHistoryOpen(false)}
                        className="fixed inset-0 z-30 cursor-default bg-black/15 backdrop-blur-sm"
                    />
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        aria-label="Roadmap history"
                        className="fixed inset-y-0 right-0 z-40 flex w-[min(24rem,92vw)] flex-col border-l border-black/10 bg-white shadow-2xl"
                    >
                        <div className="flex h-16 shrink-0 items-center justify-between border-b border-black/5 px-5">
                            <h2 className="text-base font-bold">Previous Roadmaps</h2>
                            <button
                                type="button"
                                onClick={() => setHistoryOpen(false)}
                                aria-label="Close history"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-black/50 transition hover:bg-black/5 hover:text-black"
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                        {historyLoading ? (
                            <p className="py-8 text-center text-sm text-black/45">Loading history...</p>
                        ) : error ? (
                            <div className="py-8 text-center">
                                <p role="alert" className="text-sm text-red-600">{error}</p>
                                <button type="button" onClick={getAllRoadmap} className="mt-3 text-sm font-semibold underline">Try again</button>
                            </div>
                        ) : history.length ? (
                            <div className="space-y-2">
                                {history.map((item, index) => (
                                    <button
                                        key={item._id || index}
                                        type="button"
                                        onClick={() => {
                                            getRoadmapById(item._id)
                                        }}
                                        className="w-full rounded-2xl bg-[#171717] p-4 text-left text-white transition hover:bg-[#292929]"
                                    >
                                        <span className="block truncate text-sm font-semibold">{item.title || 'Career Roadmap'}</span>
                                        <span className="mt-2 flex items-center justify-between gap-2 text-xs text-white/50">
                                            <span className="text-violet-300">{item.targetPackage}</span>
                                            <span>{item.duration}</span>
                                        </span>
                                        <span className="mt-1 block text-xs text-white/40">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="py-8 text-center text-sm text-black/45">
                                Your generated roadmaps will appear here.
                            </p>
                        )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>

        <div className="fixed inset-x-0 bottom-0 z-20 px-3 pb-3 sm:px-5 sm:pb-5">
            <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-[1.4rem] bg-[#111] p-3 text-white shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-3">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-semibold text-white/90">
                        {role?.trim()
                            ? ROLE_OPTIONS.find((option) => option.value === role)?.label || role.trim()
                            : 'Choose a role'}
                    </span>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setPackageOpen((open) => !open)}
                            aria-expanded={packageOpen}
                            aria-label={`Target package: ${targetPackage}`}
                            className="flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-medium text-white transition hover:bg-white/15"
                        >
                            {targetPackage}
                            <FiChevronDown size={14} className={`transition-transform ${packageOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {packageOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    className="absolute bottom-12 right-0 z-30 w-32 overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 text-[#111] shadow-xl"
                                >
                                    {PACKAGE_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => {
                                                setTargetPackage(option);
                                                setPackageOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition hover:bg-black/5 ${
                                                targetPackage === option ? 'font-semibold' : 'font-normal'
                                            }`}
                                        >
                                            {option}
                                            {targetPackage === option && <FiCheck size={13} />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="button"
                        disabled={!resume}
                        onClick={() => setUseResume((enabled) => !enabled)}
                        aria-pressed={includeResume}
                        title={resume ? 'Use your saved resume' : 'Score a resume first to use it here'}
                        className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        includeResume
                            ? 'border-white/30 bg-white/20 text-white'
                            : 'border-white/15 bg-white/10 text-white/80 hover:bg-white/15'
                    }`}>
                        {includeResume ? <FiCheck size={14} /> : <FiUploadCloud size={14} />}
                        <span className="hidden sm:inline">
                            {includeResume ? 'Resume added' : resume ? 'Use resume' : 'No resume'}
                        </span>
                        <span className="sm:hidden">{includeResume ? 'Added' : 'Resume'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={!role?.trim() || loading}
                        className="flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-[#111] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <FiSend size={14} />
                        <span>{loading ? 'Generating...' : 'Generate'}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Roadmap
