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

function App() {
  return (
    <AuthProvider>
    <div className="app">
      <BrowserRouter>
        <Header/>
        <div className="content">
          <Routes>
            <Route path='/barber/:barberId' element={<BarberDetails />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <HeroSection/>
          <Categories/>
          <Campaigns/>
        </div>
      </BrowserRouter>
      <div className="container mx-auto grid gap-y-6">
        <Favorites/>
        <MobileApp/>
        <Cards/>
      </div>
      <Footer/>
    </div>
  </AuthProvider>
  );
}

export default App;
