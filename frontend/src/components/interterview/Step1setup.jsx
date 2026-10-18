import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CloudUpload, FileText } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useCoins } from '../../apis/user.api'
import { useDispatch, useSelector } from 'react-redux'
import { setResume } from '../../redux/resumeSlice'
import api from '../../utils/axios'
import { startInterview } from '../../apis/interview.api'

const benefits = [
  'Personalized AI Questions',
  'Resume Based Interview',
  'Detailed Performance Report',
  'Real Interview Experience',
]

function Step1setup({ user, setUser }) {
  const navigate = useNavigate()
  const dispatch =  useDispatch()
  const {resume}  = useSelector((state)=> state.resume)
  const [targetRole, setTargetRole] = useState('')
  const [interviewType, setInterviewType] = useState('Technical')
  const [useResume, setUseResume] = useState(false)
  const [selectedResume, setSelectedResume] = useState(null)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [starting,setStarting] = useState(false)

  const canStart = !useResume || resumeUploaded



 const uploadResume = async () => {
        if(!selectedResume){
            alert("please select a pdf ")
            return
        }
        try {
            setUploading(true);

            const coinResponse = await useCoins({coins:10,action:"resume-scorer"})
            setUser((prev)=>({
                ...prev,
                interviewCoin:coinResponse?.interviewCoin
            }))

            const formData = new FormData();
            formData.append("resume",selectedResume)
            const response = await api.post("/api/resume/",formData)

            dispatch(setResume(response?.data?.data))
            setResumeUploaded(true)
            console.log(response.data)
        } catch (error) {
            console.log(error);
            alert(error.response?.status === 403
                ? "Low interview coins. Please purchase more."
                : error.response?.data?.message ?? "upload failed")
        } finally {
            setUploading(false)
        }
    }
    const start = async()=>{
        setStarting(true)
        try {
            const response = await startInterview({
                role: targetRole,
                type: interviewType.toLowerCase(),
                useResume,
                resume
            })
            if(response){
                 const coinResponse = await useCoins({coins:50,action:"interview"})
            setUser((prev)=>({
                ...prev,
                interviewCoin:coinResponse?.interviewCoin
            }))

            }
            navigate(`/interview/${response.interviewId}`)

        } catch (error) {
            console.log(error)
        }finally{
            setStarting(false)

        }
    }

  return (
    <main className="min-h-screen bg-white px-4 py-5 font-sans text-white sm:px-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101116] shadow-2xl shadow-black/30 md:min-h-[calc(100vh-4rem)] md:grid-cols-[0.82fr_1.18fr]"
      >
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
          className="border-b border-white/[0.08] p-6 sm:p-8 md:border-b-0 md:border-r md:p-10"
        >
          <motion.button
            type="button"
            onClick={() => navigate(-1)}
            whileHover={{ x: -3, backgroundColor: 'rgba(255,255,255,0.09)' }}
            whileTap={{ scale: 0.97 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300 transition hover:bg-white/[0.09]"
          >
            <ArrowLeft size={15} />
            Back
          </motion.button>

          <h1 className="max-w-sm text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            Welcome back,
            <br />
            {user?.name || 'there'}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.4 }}
            className="mt-3 max-w-sm text-sm leading-6 text-gray-400"
          >
            Practice realistic AI interviews, receive instant feedback, and improve before your next job interview.
          </motion.p>

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2 md:grid-cols-1">
            {benefits.map((benefit, index) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.08, duration: 0.35 }}
                whileHover={{ x: 4, borderColor: 'rgba(255,255,255,0.14)' }}
                className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-[#191a20] px-3 py-3.5 text-sm text-gray-200"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[#101116]">
                  <Check size={15} strokeWidth={3} />
                </span>
                {benefit}
              </motion.li>
            ))}
          </ul>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
          className="flex flex-col justify-center p-6 sm:p-8 md:p-10"
        >
          <header className="mb-7">
            <h2 className="text-2xl font-bold tracking-tight">Start Interview</h2>
            <p className="mt-1 text-sm text-gray-500">Configure your interview preferences.</p>
          </header>

          <div className="space-y-5">
            <div>
              <label htmlFor="target-role" className="mb-2 block text-xs font-medium text-gray-400">
                Target Role
              </label>
              <input
                id="target-role"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="e.g. Backend Developer"
                className="w-full rounded-xl border border-white/[0.08] bg-[#191a20] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/25"
              />
            </div>

            <fieldset>
              <legend className="mb-2 block text-xs font-medium text-gray-400">Interview Type</legend>
              <div className="grid grid-cols-2 rounded-xl border border-white/[0.08] bg-[#191a20] p-1">
                {['Technical', 'HR'].map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    aria-pressed={interviewType === type}
                    onClick={() => setInterviewType(type)}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      backgroundColor: interviewType === type ? '#ffffff' : 'rgba(255,255,255,0)',
                      color: interviewType === type ? '#101116' : '#9ca3af',
                    }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      interviewType === type
                        ? 'bg-white text-[#101116] shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </fieldset>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#191a20] px-4 py-4">
              <div>
                <p className="text-sm font-semibold">Use Resume</p>
                <p className="mt-1 text-xs text-gray-500">
                  AI will personalize questions using your resume.
                </p>
              </div>
              <motion.button
                type="button"
                role="switch"
                aria-checked={useResume}
                aria-label="Use Resume"
                onClick={() => setUseResume((enabled) => !enabled)}
                whileTap={{ scale: 0.92 }}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  useResume ? 'bg-emerald-500' : 'bg-gray-600'
                }`}
              >
                <motion.span
                  animate={{ x: useResume ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow"
                />
              </motion.button>
            </div>

            <AnimatePresence initial={false}>
              {useResume && (
                <motion.div
                  key="resume-upload"
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-5 overflow-hidden"
                >
                  {selectedResume && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3.5"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
                        <FileText size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-100">Resume Ready</p>
                        <p className="truncate text-xs text-gray-400">{selectedResume.name}</p>
                      </div>
                      <CheckCircle2 className="shrink-0 text-emerald-400" size={19} />
                    </motion.div>
                  )}

                  <motion.label
                    whileHover={{ scale: 1.01, borderColor: 'rgba(255,255,255,0.3)' }}
                    whileTap={{ scale: 0.99 }}
                    className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-[#17181e] px-5 py-5 text-center transition hover:border-white/30 hover:bg-white/[0.03]"
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(event) => {
                        setSelectedResume(event.target.files?.[0] || null)
                        setResumeUploaded(false)
                      }}
                      className="sr-only"
                      aria-label="Upload resume"
                    />
                    <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#101116]">
                      <CloudUpload size={20} />
                    </span>
                    <span className="text-sm font-semibold">
                      {selectedResume ? 'Upload a different resume' : 'Upload Resume'}
                    </span>
                    <span className="mt-1.5 text-xs leading-5 text-gray-500">
                      {selectedResume
                        ? 'Choose a new file to replace your current resume.'
                        : 'PDF or Word document'}
                    </span>
                  </motion.label>
                </motion.div>
              )}
            </AnimatePresence>

            {useResume && selectedResume && (
              <motion.button
                type="button"
                onClick={uploadResume}
                disabled={uploading}
                whileHover={!uploading ? { scale: 1.015 } : undefined}
                whileTap={!uploading ? { scale: 0.985 } : undefined}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#191a20] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-wait disabled:opacity-60"
              >
                <CloudUpload size={17} />
                {uploading ? 'Uploading Resume...' : 'Upload Resume'}
              </motion.button>
            )}

            <motion.button
            onClick={start}
              type="button"
              disabled={!canStart}
              whileHover={canStart ? { scale: 1.015 } : undefined}
              whileTap={canStart ? { scale: 0.985 } : undefined}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#101116] transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-900"
            >
              Start Interview
              <ArrowRight size={17} />
            </motion.button>
          </div>
        </motion.section>
      </motion.div>
    </main>
  )
}

export default Step1setup
