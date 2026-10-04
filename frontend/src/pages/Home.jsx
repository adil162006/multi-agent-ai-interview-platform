import React from 'react'
import {motion } from "motion/react"
import { GiArtificialHive } from "react-icons/gi";
import { CiLocationArrow1 } from "react-icons/ci";
import { FiFileText, FiMic, FiBarChart2, FiMap } from "react-icons/fi";
import LoginModel from '../components/LoginModel';
import { useState } from 'react';
// NOTE: import your hero/dashboard image here and use it below
import image from '../assets/image.png';

const agents = [
  {
    icon: <FiFileText size={18} />,
    title: "Resume Agent",
    desc: "Create ATS-friendly resumes, improve profile strength and maximize interview opportunities.",
  },
  {
    icon: <FiMic size={18} />,
    title: "Interview Agent",
    desc: "Conduct realistic HR, Technical and Coding interviews with AI-powered simulations.",
  },
  {
    icon: <FiBarChart2 size={18} />,
    title: "Feedback Agent",
    desc: "Get detailed answer analysis, scoring reports and improvement recommendations.",
  },
  {
    icon: <FiMap size={18} />,
    title: "Roadmap Agent",
    desc: "Generate personalized learning roadmaps based on goals, skills and performance.",
  },
];

function Home({setUser}) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className='bg-white text-[#0a0a0a] font-sans min-h-screen overflow-x-hidden'>
      {/* navbar */}
      <motion.nav 
      initial={{y:-60,opacity:0}}
      animate={{y:0,opacity:1}}
      transition={{duration:0.5,ease:"easeOut"}}
       className='fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center justify-between px-4 sm:px-5 bg-white/70 backdrop-blur-xl border-b border-black/5 '
       >
        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 rounded-lg  flex items-center justify-center  '>
            <GiArtificialHive  size={15} />
          </div>
          <span className='font-extrabold text-base tracking-tight text-[#0a0a0a] '>
            Hiremind
          </span>
        </div>
        <motion.button 
        onClick={()=> setShowLogin(true)}
        whileHover={{scale:1.04}}
        whileTap={{scale:0.97}}
        className='bg-[#0a0a0a]/80 backdrop-blur-2xl text-white font-semibold border border-white/10 rounded-md px-3 py-2.5 sm:py-3 text-xs cursor-pointer transition-all hover:border-white/20 flex items-center gap-2 '>
          Login
          <CiLocationArrow1 />
        </motion.button>
      </motion.nav>
      {/* main area */}
      <section className='relative pt-16 sm:pt-20 overflow-hidden bg-[#f8f9fa]'>
        <div className='max-w-5xl mx-auto px-4 sm:px-5 flex flex-col items-center text-center'>

          {/* badge */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='mt-6 sm:mt-8 inline-block px-3 sm:px-4 py-1.5 rounded-full bg-black/5 border border-black/5 text-[10px] sm:text-[11px] font-medium text-gray-600'
          >
            Multi-Agent Interview Platform
          </motion.span>

          {/* heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className='mt-5 sm:mt-6 text-[1.75rem] min-[400px]:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] sm:leading-[1.1]'
          >
            Job Interviews <br />
            <span className='text-gray-400'>Don't Have to Suck</span> <br />
            Anymore!
          </motion.h1>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className='mt-4 sm:mt-6 max-w-xl px-1 text-[13px] sm:text-base text-gray-500 leading-relaxed'
          >
            Hiremind is an innovative AI-powered interview preparation platform
            designed to help job seekers excel in their interviews.
          </motion.p>

          {/* cta */}
          <motion.button
            onClick={() => setShowLogin(true)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className='mt-6 sm:mt-8 w-full max-w-[260px] sm:w-auto sm:max-w-none justify-center bg-[#0a0a0a]/80 backdrop-blur-2xl text-white font-semibold border border-white/10 rounded-xl px-6 py-3 text-sm cursor-pointer shadow-lg shadow-black/20 flex items-center gap-2'
          >
            Get started for free
            <span>→</span>
          </motion.button>

          {/* hero image */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className='relative mt-10 sm:mt-14 w-full max-w-4xl'
          >
            <img
              src={image}
              alt='Hiremind dashboard preview'
              className='w-full h-auto rounded-xl sm:rounded-2xl border border-black/5 shadow-xl sm:shadow-2xl shadow-black/10'
            />
            {/* bottom fade into next section */}
            <div className='pointer-events-none absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white to-transparent' />
          </motion.div>
        </div>
      </section>

      {/* agents section */}
      <section className='bg-white py-16 sm:py-24 px-4 sm:px-5'>
        <div className='max-w-6xl mx-auto flex flex-col `items`-center text-center'>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className='inline-block px-3 sm:px-4 py-1.5 rounded-full bg-black/5 border border-black/5 text-[10px] sm:text-[11px] font-medium text-gray-600'
          >
            AI Powered Agents
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='mt-4 sm:mt-5 text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight'
          >
            Specialized Agents For <br />
            <span className='text-gray-400'>Every Interview Stage</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='mt-4 sm:mt-5 max-w-2xl px-1 text-[13px] sm:text-base text-gray-500 leading-relaxed'
          >
            Hiremind combines multiple AI agents that work together to help you
            build your resume, practice interviews, receive detailed feedback,
            and follow a personalized roadmap to land your dream job.
          </motion.p>

          {/* cards */}
          <div className='mt-10 sm:mt-14 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5'>
            {agents.map((agent, i) => (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className='bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 sm:p-6 text-left shadow-xl shadow-black/20'
              >
                <div className='w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white'>
                  {agent.icon}
                </div>
                <h3 className='mt-8 sm:mt-12 text-sm font-bold text-white'>
                  {agent.title}
                </h3>
                <p className='mt-1.5 text-xs text-white/50 leading-relaxed'>
                  {agent.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className='bg-[#f8f9fa] border-t border-black/5 px-4 sm:px-5 py-8 sm:py-10'>
        <div className='max-w-6xl mx-auto flex flex-col items-center gap-5 sm:flex-row sm:justify-between'>
          <div className='flex flex-col items-center sm:items-start gap-2 text-center sm:text-left'>
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 rounded-lg flex items-center justify-center'>
                <GiArtificialHive size={15} />
              </div>
              <span className='font-extrabold text-base tracking-tight text-[#0a0a0a]'>
                Hiremind
              </span>
            </div>
            <p className='text-xs text-gray-500 max-w-xs leading-relaxed'>
              AI-powered interview preparation to help you land your dream job.
            </p>
          </div>

          <p className='text-xs text-gray-400'>
            © {new Date().getFullYear()} Hiremind. All rights reserved.
          </p>
        </div>
      </footer>

      {showLogin && <LoginModel onClose={()=>setShowLogin(false)} setUser={setUser}/>}
    </div>
  )
}

export default Home