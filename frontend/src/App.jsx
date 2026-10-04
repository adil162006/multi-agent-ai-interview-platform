import React from 'react'
import Home from './pages/Home'
import {Routes, Route, Navigate} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
function App() {
  return (
    <div>
      <Routes>
         <Route path="/" element={<Home/>} />
         <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
  )
}

export default App
