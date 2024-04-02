import logo from './logo.svg';
import './App.css';
import { Login } from './pages/Login';
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom';
import { Register } from './pages/Register';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import LineCharts from './components/lineChart/LineCharts';
import Medication from './components/medication/Medication';
import Dashboard from './pages/Dashboard';
import Profile from './components/profile/Profile';
import Home from './components/home/Home';
import Chatbot from './components/chatbot/Chatbot';




function App() {
  const {user}=useContext(AuthContext)
  return (
    
    <BrowserRouter>
    <Routes>
       <Route exact path='/' element={user?<Dashboard />:<Login/>}/>
       <Route path='Signup' element={user?<Dashboard />:<Register/>}/>
       <Route path='dash' element={<Dashboard/>}/>
       <Route path='home' element={<Home/>}/>
       <Route path='linechart' element={<LineCharts/>}/>
       <Route path='medication' element={<Medication/>}/>
       <Route path='profile' element={<Profile/>}/>
       <Route path='chatbot' element={<Chatbot/>}/>
    </Routes>
  </BrowserRouter>

  );
}

export default App; 
