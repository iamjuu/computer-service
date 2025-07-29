import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './page/home'
import BillPage from './page/bill'
import AdminDashboard from './page/admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bill" element={<BillPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
