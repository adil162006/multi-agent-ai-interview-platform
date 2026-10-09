import { useEffect, useState } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProgressHeader from '../components/resume/ProgressHeader'
import StepNavigation from '../components/resume/StepNavigation'
import ResumePreview from '../components/resume/ResumePreview'
import PersonalInfoStep from '../components/resume/PersonalInfoStep'
import SummaryStep from '../components/resume/SummaryStep'
import SkillsStep from '../components/resume/SkillsStep'
import ExperienceStep from '../components/resume/ExperienceStep'
import ProjectsStep from '../components/resume/ProjectStep'
import EducationStep from '../components/resume/EducationStep'
import { useResumeForm } from '../hooks/useResumeForm'
import { STEPS } from '../constants/resume'

const STEP_COMPONENTS = {
  personal: PersonalInfoStep,
  summary: SummaryStep,
  skills: SkillsStep,
  experience: ExperienceStep,
  projects: ProjectsStep,
  education: EducationStep,
}

const Resume = () => {
  const form = useResumeForm()
  const [stepIndex, setStepIndex] = useState(0)
  const [showPreview, setShowPreview] = useState(false)

  const step = STEPS[stepIndex]
  const StepComponent = STEP_COMPONENTS[step.id]

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [stepIndex, showPreview])

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  const goPrevious = () => setStepIndex((i) => Math.max(i - 1, 0))

  const previewToggle = (
    <button
      type='button'
      onClick={() => setShowPreview((v) => !v)}
      aria-label={showPreview ? 'Back to editing' : 'Preview resume'}
      className='flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black/70 shadow-sm transition hover:bg-black/5'
    >
      {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  )

  return (
    <div className='min-h-screen bg-white'>
      <Navbar label='Resume Builder' action={previewToggle} />

      <main className='mx-auto w-full max-w-2xl px-4 pb-16 pt-24 sm:px-6'>
        {showPreview ? (
          <>
            <button
              type='button'
              onClick={() => setShowPreview(false)}
              className='mb-4 flex items-center gap-2 text-sm text-black/60 transition hover:text-black'
            >
              <ArrowLeft size={14} /> Back to editing
            </button>
            <ResumePreview data={form.data} />
          </>
        ) : (
          <>
            <ProgressHeader current={stepIndex + 1} total={STEPS.length} />

            <header className='mt-6 border-b border-black/8 pb-4'>
              <h1 className='text-2xl font-extrabold text-black'>{step.title}</h1>
              <p className='mt-1 text-sm text-black/50'>{step.subtitle}</p>
            </header>

            <div className='mt-6'>
              <StepComponent data={form.data} form={form} />
            </div>

            <StepNavigation
              current={stepIndex + 1}
              total={STEPS.length}
              onPrevious={goPrevious}
              onNext={goNext}
              onPreview={() => setShowPreview(true)}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default Resume