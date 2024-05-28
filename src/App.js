import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes,Route} from "react-router-dom";
import BarberDetails from "./pages/BarberDetails";
import Login from "./pages/Login";
import BarberDistrictList from "./pages/BarberDistrictList";
import Signup from "./pages/Signup";
import BarberHome from "./pages/BarberHome";
import Home from "./pages/Home";
import BarberInfo from "./pages/BarberInfo";
import BarberDateList from "./pages/BarberDateList";
import CustomerAppointment from "./pages/CustomerAppointment";
import BarberAppointments from "./pages/BarberAppointments";

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
            <Route path="/barberInfo" element={<BarberInfo/>}/>
            <Route path="/barber/date/:localDateString" element={<BarberDateList/>} />
            <Route path="/customerAppointments" element={<CustomerAppointment/>}/>
            <Route path="/barberAppointments" element={<BarberAppointments/>}/>
          </Routes>
        </div>
      </BrowserRouter>
      
      <Footer/>
    </div>
  </AuthProvider>
  );
}

export default App;
