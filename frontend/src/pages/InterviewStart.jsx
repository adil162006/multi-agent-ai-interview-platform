import Step1setup from '../components/interterview/Step1setup'

function InterviewStart({ user, setUser }) {
  return (
    <div>
      <Step1setup user={user} setUser={setUser} />
    </div>
  )
}

export default InterviewStart
