import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { getCurrentUser } from "./apis/user.api";
import { getResume } from "./apis/resume.api";
import { useDispatch } from "react-redux";
import { setResume } from "./redux/resumeSlice";

function App() {
  const dispatch = useDispatch()
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);
  useEffect(() => {
   const getResumeData = async()=>{
    const result=await getResume()
    dispatch(setResume(result?.data))
   }
   getResumeData()
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Home setUser={setUser} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard user={user} setUser={setUser} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/scorer"
        element={
          user ? (
            <Scorer user={user} setUser={setUser} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;