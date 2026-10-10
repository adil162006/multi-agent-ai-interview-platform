import { useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { IoMdDownload } from 'react-icons/io'

const SERIF = '"Times New Roman", Times, "Liberation Serif", serif'

const toBullets = (text = '') =>
  text
    .split('\n')
    .map((line) => line.replace(/^\s*[•\-*]\s*/, '').trim())
    .filter(Boolean)

const hasContent = (entry) =>
  Object.entries(entry).some(([key, value]) => key !== 'id' && value.trim())

const Section = ({ title, children }) => (
  <section className='mt-4'>
    <h2 className='border-b border-black pb-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-black'>
      {title}
    </h2>
    <div className='mt-2 space-y-3'>{children}</div>
  </section>
)

const Row = ({ left, right }) => (
  <div className='flex items-baseline justify-between gap-4'>
    <div className='min-w-0'>{left}</div>
    {right && <span className='shrink-0 text-[10px] text-black'>{right}</span>}
  </div>
)

const Bullets = ({ text }) => {
  const items = toBullets(text)
  if (!items.length) return null
  return (
    <ul className='mt-1 list-disc space-y-0.5 pl-6 text-[10px] leading-snug text-black'>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
const ResumePreview = ({ data }) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const { personal, summary, skills } = data
  const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean)
  const experience = data.experience.filter(hasContent)
  const projects = data.projects.filter(hasContent)
  const education = data.education.filter(hasContent)
  const contact = [personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean)

  const isEmpty =
    !personal.fullName && !contact.length && !summary.trim() && !skillList.length &&
    !experience.length && !projects.length && !education.length

  if (isEmpty) {
    return (
      <div className='rounded-2xl border border-dashed border-black/15 p-10 text-center text-sm text-black/40'>
        Nothing to preview yet. Go back and fill in a few sections.
      </div>
    )
  }

  const handleDownloadPDF = async () => {
    const input = document.getElementById('pdf-content')
    if (!input) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const imageData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imageHeight = (canvas.height * pageWidth) / canvas.width
      const pageCount = Math.ceil(imageHeight / pageHeight)

      for (let page = 0; page < pageCount; page += 1) {
        if (page > 0) pdf.addPage()
        pdf.addImage(imageData, 'PNG', 0, -page * pageHeight, pageWidth, imageHeight)
      }

      const filename = personal.fullName
        ? `${personal.fullName.trim().replace(/[^a-z0-9-_]+/gi, '-')}-resume.pdf`
        : 'resume.pdf'
      pdf.save(filename)
    } catch (error) {
      console.error('Failed to download resume PDF', error)
      window.alert('Could not download the resume. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className='mx-auto w-full'>
      <div className='mb-3 flex justify-end'>
        <button
          type='button'
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          aria-label='Download resume as PDF'
          className='inline-flex items-center gap-2 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-medium text-black transition hover:bg-black/5 disabled:cursor-wait disabled:opacity-60'
        >
          <IoMdDownload size={18} />
          {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
        </button>
      </div>
      <article
        id='pdf-content'
        className='mx-auto min-h-[820px] w-full bg-white px-8 py-10 text-black shadow-[0_2px_24px_rgba(0,0,0,0.12)] sm:px-12'
        style={{ fontFamily: SERIF }}
      >
      <header className='border-b-2 border-black pb-2 text-center'>
        {personal.fullName && (
          <h1 className='text-2xl font-bold uppercase tracking-[0.15em]'>{personal.fullName}</h1>
        )}
        {contact.length > 0 && (
          <p className='mt-1.5 text-[10px]'>{contact.join('  |  ')}</p>
        )}
      </header>

      {summary.trim() && (
        <Section title='Professional Summary'>
          <p className='text-[10px] leading-snug'>{summary}</p>
        </Section>
      )}

      {skillList.length > 0 && (
        <Section title='Technical Skills'>
          <ul className='list-disc columns-2 gap-8 pl-6 text-[10px] leading-relaxed'>
            {skillList.map((skill, i) => (
              <li key={i} className='break-inside-avoid'>{skill}</li>
            ))}
          </ul>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title='Work Experience'>
          {experience.map((exp) => (
            <div key={exp.id}>
              <Row
                left={<h3 className='text-[10px] font-bold'>{exp.company}</h3>}
                right={exp.duration}
              />
              {exp.role && <p className='text-[10px] italic'>{exp.role}</p>}
              <Bullets text={exp.description} />
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title='Projects'>
          {projects.map((project) => (
            <div key={project.id}>
              <Row
                left={<h3 className='text-[10px] font-bold'>{project.name}</h3>}
                right={project.github}
              />
              {project.techStack && (
                <p className='text-[10px]'>
                  <span className='font-bold'>Tech Stack:</span> {project.techStack}
                </p>
              )}
              <Bullets text={project.description} />
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title='Education'>
          {education.map((edu) => (
            <div key={edu.id}>
              <Row
                left={
                  <h3 className='text-[10px] font-bold'>
                    {[edu.degree, edu.branch].filter(Boolean).join(' in ')}
                  </h3>
                }
                right={edu.year}
              />
              <p className='text-[10px]'>
                {edu.college}
                {edu.college && edu.cgpa && '  |  '}
                {edu.cgpa && (
                  <>
                    CGPA: <span className='font-bold'>{edu.cgpa}</span>
                  </>
                )}
              </p>
            </div>
          ))}
        </Section>
      )}
      </article>
    </div>
  )
}

export default ResumePreview