import EntryList from './EntryList'
import { EDUCATION_FIELDS } from '../../constants/resume'

const EducationStep = ({ data, form }) => (
  <EntryList
    section='education'
    fields={EDUCATION_FIELDS}
    entries={data.education}
    addLabel='Add Education'
    emptyMessage='No education added yet.'
    form={form}
  />
)

export default EducationStep