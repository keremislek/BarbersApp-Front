import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Categories from "./components/Categories";
import Campaigns from "./components/Campaigns";
import Favorites from "./components/Favorites";
import MobileApp from "./components/MobileApp";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes,Route} from "react-router-dom";
import BarberDetails from "./pages/BarberDetails";
import Login from "./pages/Login";
import BarberDistrictList from "./pages/BarberDistrictList";
import Signup from "./pages/Signup";
import BarberHome from "./pages/BarberHome";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
    <div className="app">
      <BrowserRouter>
        <Header/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/home" element={<Home/>} />

            <Route path='/barber/:barberId' element={<BarberDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/district/:districtId" element={<BarberDistrictList/>}/>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/barberHome" element={<BarberHome/>}/>
          </Routes>
        </div>
      </BrowserRouter>
      
      <Footer/>
    </div>
  </AuthProvider>
  );
}

export default App;
