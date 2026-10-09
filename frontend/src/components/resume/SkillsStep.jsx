import FormField from '../FormField'

const SkillsStep = ({ data, form }) => (
  <div className='space-y-2'>
    <FormField
      id='skills'
      label='Skills (comma separated)'
      multiline
      rows={4}
      placeholder='JavaScript, TypeScript, React, Node.js, Express, MongoDB, Redis, Docker, AWS, Git'
      value={data.skills}
      onChange={(value) => form.setValue('skills', value)}
    />
    <p className='text-[11px] text-black/40'>Separate each skill with a comma.</p>
  </div>
)

export default SkillsStep   