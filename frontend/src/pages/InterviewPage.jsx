import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterview } from '../apis/interview.api'
import Step2interview from '../components/interterview/Step2interview'

function InterviewPage({user,setUser}) {
    const {id} = useParams()
    const navigate=useNavigate()
    const [loading,setLoading]= useState(true)
    const [interview,setInterview]=useState(null)


    useEffect(()=>{
        const fetchInterview = async()=>{
            try {
                const response = await getInterview(id)
                const data = response?.interview
                if (!data) return
                if(data.status === "completed"){
                    navigate(`/interview/${id}/report`,{replace:true})
                    return
                }
                setInterview(data)
            } finally {
                setLoading(false)
            }
        }
        fetchInterview()
    },[id,navigate])

if (loading) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-900">
      <div className="relative h-20 w-20">
        {/* Outer ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-indigo-500 border-t-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.7)]" />

        {/* Inner ring (reverse) */}
        <div className="absolute inset-3 animate-spin-reverse rounded-full border-4 border-transparent border-b-cyan-400 border-l-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" />

        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400" />
      </div>

      <p className="animate-pulse text-sm uppercase tracking-[0.3em] text-slate-400">
        Loading...
      </p>
    </div>
  );
}

if(!interview)return null

  return (
    <div>
      <Step2interview  interviewData={
        {
            interviewId:interview._id,
            currentQuestionIndex:interview.currentQuestion,
            totalQuestions:interview.questions.length,
            questions:interview.questions,
            question:interview.questions[interview.currentQuestion],
        }
      }
        user={user}
        onInterviewUpdate={(updatedInterview) => {
          if (updatedInterview) setInterview((current) => ({ ...current, ...updatedInterview }))
        }}
      />
    </div>
  )
}

export default InterviewPage
