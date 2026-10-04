import React from 'react'
import { motion } from "motion/react";
import { FaGoogle, FaTimes } from "react-icons/fa";
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase'
import api from '../utils/axios';



const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

function LoginModel({onClose,setUser}) {
    const handleGoogleAuth = async()=>{
    try {
        const result = await signInWithPopup(auth,provider);
      const token = await result.user?.getIdToken()
      const response = await  api.post("/api/auth/login",{token})
      setUser(response?.data?.user)
      onClose()
      console.log(result)

    } catch (error) {
        console.log(error);
    }
}
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className='fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md px-4'
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className='relative w-full max-w-sm bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60'
      >

        {/* Close button */}
        <motion.button
          onClick={onClose}
          aria-label='Close'
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className='absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors'
        >
          <FaTimes className='text-sm' />
        </motion.button>

        {/* Content */}
        <motion.div
          variants={container}
          initial='hidden'
          animate='show'
          className='flex flex-col items-center text-center px-8 pt-14 pb-10'
        >
          <motion.h2 variants={item} className='text-2xl font-semibold text-white'>
            Welcome to <span className='text-white-400 font-bold'>Hiremind</span>
          </motion.h2>
          <motion.p variants={item} className='mt-2 text-sm text-white/50'>
            Sign in to continue to your account
          </motion.p>

          {/* Google auth button */}
          <motion.button
          onClick={handleGoogleAuth}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className='mt-8 w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white text-black font-medium shadow-lg shadow-black/40 hover:bg-gray-100 hover:shadow-xl transition-colors'
          >
            <FaGoogle className='text-lg' />
            Login with Google
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default LoginModel