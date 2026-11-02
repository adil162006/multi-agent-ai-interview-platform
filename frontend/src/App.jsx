import React, { useEffect, useRef, useState } from "react";
import Home from "./pages/Home";
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Scorer from "./pages/Scorer";
import Resume from "./pages/Resume";
import { getResume } from "./apis/resume.api";
import { useDispatch, useSelector } from "react-redux";
import { setResume } from "./redux/resumeSlice";
import { fetchCurrentUser } from "./redux/userSlice";
import InterviewStart from "./pages/InterviewStart";
import InterviewPage from "./pages/InterviewPage";
import InterviewReport from "./pages/InterviewReport";
import { Toaster } from "react-hot-toast";
import Roadmap from "./pages/Roadmap";
import ShowRoadmap from "./pages/ShowRoadmap";
import Billing from "./pages/BIlling";
import Sidebar from "./components/Sidebar";
import { useCoins } from "./apis/user.api";
import { logoutUser, updateUser } from "./redux/userSlice";
import toast from "react-hot-toast";
import { FiMenu } from "react-icons/fi";

function RequireAuth() {
  const user = useSelector((state) => state.user.user)
  return user ? <Outlet /> : <Navigate to="/" replace />
}

function PublicOnly() {
  const user = useSelector((state) => state.user.user)
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

function AuthenticatedLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = useSelector((state) => state.user.user)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const resumeChargeInProgress = useRef(false)

  const handleResumeBuilder = async () => {
    if (resumeChargeInProgress.current) return false

    const availableCoins = Number(user?.interviewCoin ?? 0)
    if (!Number.isFinite(availableCoins) || availableCoins < 10) {
      toast.error('You need 10 interview coins to create a resume.')
      return false
    }

    resumeChargeInProgress.current = true
    try {
      const response = await useCoins({ coins: 10, action: 'resume-builder' })
      if (!response?.success) {
        toast.error(response?.message || 'Unable to use interview coins. Please try again.')
        return false
      }

      dispatch(updateUser({ interviewCoin: response.interviewCoin }))
      return true
    } catch (error) {
      console.error('Failed to use coins for resume creation:', error)
      toast.error('Unable to create a resume. Please try again.')
      return false
    } finally {
      resumeChargeInProgress.current = false
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      navigate('/')
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to log out. Please try again.')
    }
  }

  const isInterviewPage = pathname === '/interview' || /^\/interview\/[^/]+(?:\/report)?$/.test(pathname)

  return (
    <div className="min-h-screen bg-white">
      <Sidebar
        onNewInterview={() => navigate('/interview')}
        onResumeBuilder={handleResumeBuilder}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      {isInterviewPage && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="fixed left-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-[#0a0a0a] shadow-md shadow-black/10 md:hidden"
        >
          <FiMenu size={20} />
        </button>
      )}
      <div
        className={`min-h-screen transition-[margin] duration-300 ${
          sidebarOpen ? 'md:ml-[260px]' : 'md:ml-[72px]'
        }`}
      >
        <Outlet context={{ openMobileSidebar: () => setMobileOpen(true), sidebarOpen }} />
      </div>
    </div>
  )
}

function App() {
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  useEffect(() => {
    if (status === 'unauthenticated') {
      dispatch(setResume(null))
      return
    }
    if (status !== 'authenticated') return

    let active = true
    const getResumeData = async () => {
      const result = await getResume()
      if (active) dispatch(setResume(result?.data ?? null))
    }

    getResumeData()
    return () => {
      active = false
    }
  }, [dispatch, status])

  return (
    <>
    <Toaster position="top-right" />
    {status === 'idle' || status === 'checking' ? (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    ) : status === 'error' ? (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
        <p role="alert">{error}</p>
        <button
          type="button"
          onClick={() => dispatch(fetchCurrentUser())}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          Retry
        </button>
      </div>
    ) : (
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scorer" element={<Scorer />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/interview" element={<InterviewStart />} />
            <Route path="/interview/:id" element={<InterviewPage />} />
            <Route path="/interview/:id/report" element={<InterviewReport />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/roadmap/show/:id" element={<ShowRoadmap />} />
            <Route path="/billing" element={<Billing />} />
          </Route>
        </Route>
        <Route path="/roadmap-builder" element={<Navigate to="/roadmap" replace />} />
      </Routes>
    )}
    </>
  );
}

export default App;
