import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { FiUploadCloud } from 'react-icons/fi'
import api from '../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setResume } from '../redux/resumeSlice'

const Navbar = ({label})=>{
    const navigate = useNavigate()
    return(
        <nav className='fixed inset-x-0 top-0 border-b border-black/8 bg-white/8 backdrop-blur-xl'>
            <div className='mx-auto flex h-12 max-w-7xl items-center justify-start px-3 sm:px-5' onClick={()=> navigate("/dashboard")}>
                <div className='flex cursor-pointer items-center gap-1.5' >
                    <span className='text-sm font-extrabold sm:text-base text-black'>HireMind</span>
                    <span className='hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block'>{label}</span>
                </div>
            </div>
        </nav>
    )
}

function Scorer({user,setUser}) {
    
    
    const[file,setFile]=useState(null)
    const [loading,setLoading]=useState(false)

    const dispatch = useDispatch()
    const {resume}=useSelector((state)=>state.resume)
    const uploadResume = async (file) => {
        if(!file){
            alert("please select a pdf ")
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("resume",file)
            const response = await api.post("/api/resume/upload",formData)
            dispatch(setResume(response?.data?.data))
            console.log(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error);
            alert("upload failed")
        }
    }
    // upload section
  return (
    <div className='min-h-screen bg-white text-black'>
        <Navbar label={"Resume-Scorer"}/>
        <section className="flex min-h-screen items-center justify-center px-3 pt-18 pb-6 ">
            <motion.div
            className='relative w-full max-w-sm rounded-3xl overflow-hidden bg-black/90 backdrop:backdrop-blur-2xl border border-white/10 p-4 sm:p-6'
            
            >
            <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none'/>
            <p className='relative text-[10px] text-white/40 tracking-widest uppercase mb-1.5 '>Step 1 to 2 </p>
               <div className='relative w-full h-1 bg-white/10 rounded-full mb-4'>
                    <div className='h-full w-1/2 bg-white rounded-full'></div>
                </div>
                <h2 className='relative text-lg font-bold mb-1 text-white'>
                    Upload Your Resume
                </h2>
                <p className='relative text-white/45 text-xs mb-4'>
                    We'll score it and give you actionable feedback
                </p>
                <label className={`relative flex flex-col items-center justify-center w-full h-40 sm:h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-colors
                    ${file 
                        ? "border-white/40 bg-white/[0.06]" 
                        : "border-white/15 bg-white/[0.03] hover:border-white/30"
                    }`}>
                        <FiUploadCloud className={`text-4xl sm:text-5xl mb-2.5 ${file ? "text-white" : "text-white/30"}`} />[cite: 2]
                        <p className="text-xs font-medium text-white/80">
                        {file ? file.name : "Click or drag PDF here"}
                        </p>
                        <p className="text-[10px] text-white/35 mt-1">PDF only · Max 20MB</p>

                        <input 
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                        />
                        <motion.button whileHover={{scale:1.07}} whileTap={{scale:0.97}} onClick={uploadResume} disabled={!file || loading} className='relative mt-4 w-full h-10 rounded-xl font-semibold text-xs bg-white text-[#0A0A0A] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all'>
                            {loading?"Analysing...":"Analyse Resume"}
                        </motion.button>
                </label> 
            </motion.div>
        </section>
    </div>
  )
}

export default Scorer
