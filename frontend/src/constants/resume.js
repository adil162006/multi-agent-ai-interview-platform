export const STEPS = [
  { id: 'personal', title: 'Personal Information', subtitle: 'Your basic contact details' },
  { id: 'summary', title: 'Professional Summary', subtitle: 'A quick intro about yourself' },
  { id: 'skills', title: 'Skills', subtitle: 'Your technical skills' },
  { id: 'experience', title: 'Work Experience', subtitle: 'Your past jobs & internships' },
  { id: 'projects', title: 'Projects', subtitle: 'Projects you have built' },
  { id: 'education', title: 'Education', subtitle: 'Your academic background' },
]

export const PERSONAL_FIELDS = [
  { name: 'fullName', label: 'Full Name', placeholder: 'Rahul Sharma' },
  { name: 'email', label: 'Email', placeholder: 'rahul@email.com', type: 'email' },
  { name: 'phone', label: 'Phone', placeholder: '+91 9876543210', type: 'tel' },
  { name: 'location', label: 'Location', placeholder: 'Jhansi, UP' },
  { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/rahul' },
  { name: 'github', label: 'GitHub URL', placeholder: 'github.com/rahul' },
]

export const EXPERIENCE_FIELDS = [
  { name: 'company', label: 'Company', placeholder: 'ABC Technologies' },
  { name: 'role', label: 'Role', placeholder: 'Backend Developer' },
  { name: 'duration', label: 'Duration', placeholder: 'Jan 2023 – Dec 2024' },
  {
    name: 'description',
    label: 'Description',
    placeholder: '• Built REST APIs\n• Improved performance by 40%',
    multiline: true,
    rows: 3,
  },
]

export const PROJECT_FIELDS = [
  { name: 'name', label: 'Project Name', placeholder: 'InterviewOS' },
  { name: 'techStack', label: 'Tech Stack', placeholder: 'React, Node.js, MongoDB' },
  { name: 'github', label: 'GitHub Link', placeholder: 'github.com/rahul/interviewos' },
  {
    name: 'description',
    label: 'Description',
    placeholder: 'AI-powered interview preparation platform with mock interviews and resume builder.',
    multiline: true,
    rows: 3,
  },
]

export const EDUCATION_FIELDS = [
  { name: 'college', label: 'College / University', placeholder: 'SR Group of Institutions' },
  { name: 'degree', label: 'Degree', placeholder: 'B.Tech' },
  { name: 'branch', label: 'Branch', placeholder: 'Computer Science' },
  { name: 'cgpa', label: 'CGPA', placeholder: '8.5' },
  { name: 'year', label: 'Year', placeholder: '2021 – 2025' },
]

export const SECTION_FIELDS = {
  experience: EXPERIENCE_FIELDS,
  projects: PROJECT_FIELDS,
  education: EDUCATION_FIELDS,
}

export const createEntry = (fields) => ({
  id: crypto.randomUUID(),
  ...Object.fromEntries(fields.map((f) => [f.name, ''])),
})

export const INITIAL_RESUME = {
  personal: Object.fromEntries(PERSONAL_FIELDS.map((f) => [f.name, ''])),
  summary: '',
  skills: '',
  experience: [createEntry(EXPERIENCE_FIELDS)],
  projects: [createEntry(PROJECT_FIELDS)],
  education: [],
}