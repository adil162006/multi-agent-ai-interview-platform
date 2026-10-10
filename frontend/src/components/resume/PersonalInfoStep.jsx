import FormField from './FormField'
import { PERSONAL_FIELDS } from '../../constants/resume'

const PersonalInfoStep = ({ data, form }) => (
  <div className='space-y-4'>
    {PERSONAL_FIELDS.map((field) => (
      <FormField
        key={field.name}
        id={`personal-${field.name}`}
        label={field.label}
        type={field.type}
        placeholder={field.placeholder}
        value={data.personal[field.name]}
        onChange={(value) => form.setPersonalField(field.name, value)}
      />
    ))}
  </div>
)

export default PersonalInfoStep