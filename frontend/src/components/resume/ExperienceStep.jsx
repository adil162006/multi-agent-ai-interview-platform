import EntryList from '../EntryList'
import { EXPERIENCE_FIELDS } from '../../../constants/resume'

const ExperienceStep = ({ data, form }) => (
  <EntryList
    section='experience'
    fields={EXPERIENCE_FIELDS}
    entries={data.experience}
    addLabel='Add Experience'
    emptyMessage='No experience added yet.'
    form={form}
  />
)

export default ExperienceStep