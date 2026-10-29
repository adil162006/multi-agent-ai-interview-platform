import React, { useEffect, useState } from 'react'
import Step3report from '../components/interterview/Step3report'
import { getInterview } from '../apis/interview.api';
import { useNavigate, useParams } from 'react-router-dom';
function InterviewReport({user,setUser}) {
  const {id} = useParams();
  const[loading,setLoading] = useState(true);
  const [report,setReport] = useState(null);
  const navigate = useNavigate()
  useEffect(()=>{
    const fetchInterview=async()=>{
      try {
        const response = await getInterview(id);
        const data = response?.interview
        if (!data) return
        if(data.status !== "completed"){
          navigate(`/interview/${id}`, { replace: true })
          return
        }
        setReport(data)
      } finally {
        setLoading(false)
      }
    }
    fetchInterview()
  },[id,navigate])


    if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black/15 border-t-black rounded-full animate-spin" />
      </div>
    );
  }
  if(!report) return <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5] text-sm text-gray-500">Unable to load this interview report.</div>;
  return (
    <div>
      <Step3report
      user={user}
      setUser={setUser}
      report={report}


      />
    </div>
  )
}

export default InterviewReport
