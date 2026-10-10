import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { NavLink, useNavigate } from 'react-router-dom'
import { GiArtificialHive } from 'react-icons/gi'
import { TbLayoutSidebar } from 'react-icons/tb'
import { FiPlus, FiGrid, FiFileText, FiMap, FiStar, FiLogOut, FiX } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'

// ---- menu config ----
const mainLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: FiGrid },
]

const agentLinks = [
  { label: 'Resume Builder', to: '/resume', icon: FiFileText },
  { label: 'Roadmap Builder', to: '/roadmap-builder', icon: FiMap },
  { label: 'Resume Scorer', to: '/scorer', icon: FiStar },
]

const EXPANDED = 260
const COLLAPSED = 72

// ---- single nav item ----
function NavItem({ item, collapsed, onClick }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl text-sm transition-colors ${
          collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
        } ${
          isActive
            ? 'bg-black/5 text-[#0a0a0a] font-semibold'
            : 'text-gray-500 hover:bg-black/5 hover:text-[#0a0a0a]'
        }`
      }
    >
      <Icon size={18} className='shrink-0' />
      {!collapsed && <span className='truncate'>{item.label}</span>}
    </NavLink>
  )
}

// ---- shared sidebar body (used by desktop + mobile) ----
function SidebarContent({
  user,
  collapsed,
  onNewInterview,
  onLogout,
  onToggle,
  onNavigate,
  isMobile,
}) {
  const navigate = useNavigate()
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className='flex flex-col h-full w-full'>
      {/* header */}
      <div
        className={`flex items-center h-[64px] shrink-0 border-b border-black/5 ${
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        <button
          onClick={() => {
            navigate('/dashboard')
            onNavigate?.()
          }}
          className='flex items-center gap-2.5 cursor-pointer'
        >
          <div className='w-9 h-9 rounded-xl bg-[#0a0a0a] text-white flex items-center justify-center shadow-md shadow-black/20 shrink-0'>
            <GiArtificialHive size={18} />
          </div>
          {!collapsed && (
            <span className='font-extrabold text-base tracking-tight text-[#0a0a0a]'>
              Hiremind
            </span>
          )}
        </button>

        {!collapsed && (
          <button
            onClick={onToggle}
            aria-label={isMobile ? 'Close sidebar' : 'Collapse sidebar'}
            className='w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0a0a0a] hover:bg-black/5 transition-colors cursor-pointer'
          >
            {isMobile ? <FiX size={18} /> : <TbLayoutSidebar size={18} />}
          </button>
        )}
      </div>

      {/* collapsed: expand button */}
      {collapsed && (
        <div className='flex justify-center pt-3'>
          <button
            onClick={onToggle}
            aria-label='Expand sidebar'
            className='w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0a0a0a] hover:bg-black/5 transition-colors cursor-pointer'
          >
            <TbLayoutSidebar size={18} />
          </button>
        </div>
      )}

      {/* create interview */}
      <div className={`pt-4 ${collapsed ? 'px-3' : 'px-3'}`}>
        <motion.button
          onClick={() => {
            onNewInterview?.()
            onNavigate?.()
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          title={collapsed ? 'Create Interview' : undefined}
          className={`w-full flex items-center justify-center gap-2 bg-[#0a0a0a] text-white font-semibold text-sm rounded-xl py-3 shadow-lg shadow-black/25 cursor-pointer ${
            collapsed ? 'px-0' : 'px-4'
          }`}
        >
          <FiPlus size={16} className='shrink-0' />
          {!collapsed && <span>Create Interview</span>}
        </motion.button>
      </div>

      {/* nav */}
      <nav className='flex-1 overflow-y-auto px-3 pt-5 flex flex-col gap-1'>
        {mainLinks.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} onClick={onNavigate} />
        ))}

        {!collapsed ? (
          <p className='px-3 pt-5 pb-1 text-[11px] font-medium tracking-widest text-gray-400'>
            AGENTS
          </p>
        ) : (
          <div className='my-3 mx-2 border-t border-black/5' />
        )}

        {agentLinks.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} onClick={onNavigate} />
        ))}
      </nav>

      {/* bottom */}
      <div className='shrink-0 border-t border-black/5 p-3 flex flex-col gap-3'>
        {/* coins */}
        {collapsed ? (
          <div
            title={`Interview Coins: ${user?.interviewCoin ?? 0}`}
            className='mx-auto w-11 h-11 rounded-xl bg-[#0a0a0a] text-white flex items-center justify-center shadow-lg shadow-black/25'
          >
            <HiSparkles size={16} className='text-yellow-300' />
          </div>
        ) : (
          <div className='flex items-center justify-between bg-[#0a0a0a] text-white rounded-xl px-4 py-3 shadow-lg shadow-black/25'>
            <div className='flex items-center gap-3 min-w-0'>
              <HiSparkles size={16} className='text-yellow-300 shrink-0' />
              <div className='min-w-0'>
                <p className='text-[10px] tracking-wider text-white/50 font-medium'>
                  INTERVIEW COINS
                </p>
                <p className='text-sm font-bold leading-tight'>{user?.interviewCoin ?? 0}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              aria-label='Add coins'
              className='w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer shrink-0'
            >
              <FiPlus size={14} />
            </button>
          </div>
        )}

        {/* user */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-2'}`}>
          <div className='flex items-center gap-3 min-w-0'>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || 'User'}
                className='w-9 h-9 rounded-full object-cover shrink-0'
              />
            ) : (
              <div className='w-9 h-9 rounded-full bg-[#0a0a0a] text-white text-sm font-bold flex items-center justify-center shrink-0'>
                {initial}
              </div>
            )}
            {!collapsed && (
              <div className='min-w-0'>
                <p className='text-sm font-semibold text-[#0a0a0a] truncate'>
                  {user?.name || 'User'}
                </p>
                <p className='text-[11px] text-gray-400 truncate'>{user?.email}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={onLogout}
              aria-label='Logout'
              className='w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0a0a0a] hover:bg-black/5 transition-colors cursor-pointer shrink-0'
            >
              <FiLogOut size={16} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={onLogout}
            aria-label='Logout'
            title='Logout'
            className='mx-auto w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0a0a0a] hover:bg-black/5 transition-colors cursor-pointer'
          >
            <FiLogOut size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

function Sidebar({
    user,
    onNewInterview,
    onLogout,
    sidebarOpen,
    setSidebarOpen,
    mobileOpen,
    setMobileOpen
}) {
  return (
    <>
      {/* desktop sidebar */}
      <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? EXPANDED : COLLAPSED }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      className='hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-black/8  z-40  flex-col overflow-hidden '
      >
        <SidebarContent
          user={user}
          collapsed={!sidebarOpen}
          onNewInterview={onNewInterview}
          onLogout={onLogout}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </motion.aside>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key='overlay'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className='md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm'
            />
            <motion.aside
              key='drawer'
              initial={{ x: -EXPANDED }}
              animate={{ x: 0 }}
              exit={{ x: -EXPANDED }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              style={{ width: EXPANDED }}
              className='md:hidden fixed top-0 left-0 h-screen bg-white border-r border-black/8 z-50 flex flex-col overflow-hidden shadow-2xl shadow-black/30'
            >
              <SidebarContent
                user={user}
                collapsed={false}
                isMobile
                onNewInterview={onNewInterview}
                onLogout={onLogout}
                onToggle={() => setMobileOpen(false)}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar