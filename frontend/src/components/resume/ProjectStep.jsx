import EntryList from '../EntryList'
import { PROJECT_FIELDS } from '../../../constants/resume'

const ProjectsStep = ({ data, form }) => (
  <EntryList
    section='projects'
    fields={PROJECT_FIELDS}
    entries={data.projects}
    addLabel='Add Project'
    emptyMessage='No projects added yet.'
    form={form}
  />
)

export default ProjectsStep