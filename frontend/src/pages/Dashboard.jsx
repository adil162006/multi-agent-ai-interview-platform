import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { motion } from 'motion/react'
import { FiMenu } from 'react-icons/fi'
import { GiArtificialHive } from 'react-icons/gi'

function Dashboard({user,setUser}) {
  const[sidebarOpen,setSidebarOpen] = useState(false)
  const[mobileOpen,setMobileOpen] = useState(false)
const navigate=useNavigate()

const handleLogout = async ()=>{
  try {
    const response = await api.post("/api/auth/logout")
    if(response.data.success){
      setUser(null)
      navigate("/")

    }
  } catch (error) {
    console.log(error)
  }
}
  return (
    <div className='bg-white min-h-screen font-sans flex  text-[#0a0a0a]'>
      <Sidebar
      user={user}
      onNewInterview={()=>navigate("/interview")}
      onLogout={handleLogout}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}

      />
      <motion.main className={`flex flex-col flex-1 min-w-0 min-h-screen px-3 sm:px-4 md:px-4 py-4 md:py-6 transition-[margin] duration-300 ${sidebarOpen ? "md:ml-[260px]" : "md:ml-[72px]"}`}>
        {/* top area */}
        <div className='flex items-center justify-between mb-5 md:mb-6'>
          <div className='flex items-center gap-2.5'>
            {/* mobile menu button (opens sidebar drawer) */}
            <motion.button
              onClick={() => setMobileOpen(true)}
              whileTap={{ scale: 0.92 }}
              aria-label='Open menu'
              className='md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-black/10 text-[#0a0a0a] shadow-md shadow-black/10 cursor-pointer'
            >
              <FiMenu size={20} />
            </motion.button>

           <motion.div
           initial={{opacity:0,y:-12}}
           animate={{opacity:1,y:0}}
           transition={{duration:0.4}}
           >
              <p className='text-black/40 text-[11px] md:text-xs font-medium mb-5'>Overview</p>
              <h2 className='text-[#0a0a0a] text-lg md:text-xl font-semibold tracking-tight'>Welcome, {user?.name.split(" ")[0]}</h2>
           </motion.div>
          </div>

        </div>
      </motion.main>
    </div>
  )
}

export default Dashboard