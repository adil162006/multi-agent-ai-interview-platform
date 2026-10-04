import React from 'react'
import {motion } from "motion/react"
import { GiArtificialHive } from "react-icons/gi";
import { CiLocationArrow1 } from "react-icons/ci";
import LoginModel from '../components/LoginModel';
import { useState } from 'react';
function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className='bg-white text-[#0a0a0a] font-sans min-h-screen overflow-x-hidden'>
      {/* navbar */}
      <motion.nav 
      initial={{y:-60,opacity:0}}
      animate={{y:0,opacity:1}}
      transition={{duration:0.5,ease:"easeOut"}}
       className='fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center justify-between px-5 bg-white/70 backdrop-blur-xl border-b border-black/5 '
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
        className='bg-[#0a0a0a]/80 backdrop-blur-2xl text-white font-semibold border border-white/10 rounded-md px-3 py-3 text-xs cursor-pointer transition-all hover:border-white/20 flex items-center gap-2 '>
          Login
          <CiLocationArrow1 />
        </motion.button>
      </motion.nav>
      {/* main area */}
      <section className='relative pt-20 overflow-hidden bg-[#f8f9fa]'>
      </section>
      {showLogin && <LoginModel onClose={()=>setShowLogin(false)}/>}
    </div>
  )
}

export default Home
