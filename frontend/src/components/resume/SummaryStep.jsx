import FormField from './FormField'

const SummaryStep = ({ data, form }) => (
  <div className='space-y-2'>
    <FormField
      id='summary'
      label='Professional Summary'
      multiline
      rows={5}
      placeholder='Backend Developer with 2+ years of experience building scalable Node.js and MongoDB applications...'
      value={data.summary}
      onChange={(value) => form.setValue('summary', value)}
    />
    <p className='text-[11px] text-black/40'>Leave empty to skip this section.</p>
  </div>
)

export default SummaryStep