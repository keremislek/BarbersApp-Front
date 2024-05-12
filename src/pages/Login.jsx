import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignupClick = () => {
    navigate(`/signup`);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Formun geleneksel olarak gönderilmesini engelle

    // Temel doğrulama
    if (!email || !password) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    // Email doğrulaması (basit desen)
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      setError("Geçersiz email formatı.");
      return;
    }

    console.log("Giriş yapılıyor", email, password);

    const success = await login(email, password);
    if (success) {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token bulunamadı");
        return;
      }
      const tokenString = token.toString();
      const decoded = jwtDecode(tokenString);
      const firstRole = decoded.role[0].authority;
      const decodedEmail = decoded.sub;

      if (firstRole === "Customer") {
        navigate("/");
      } else {
        navigate("/barberHome", { state: { email: decodedEmail } });
      }
    } else {
      setError("Geçersiz email veya şifre.");
    }
  };

  console.log("Sayfa yüklendi");

  return (
    <div className="flex justify-center items-center h-screen">
  <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
    <h1 className="text-3xl font-bold text-center">Giriş Yap</h1>
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="email" className="text-lg text-gray-600 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border border-gray-300 rounded-lg py-2 px-4"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="text-lg text-gray-600 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-lg py-2 px-4"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <a
        href="#"
        className="text-blue-400 hover:text-blue-600 text-sm text-center"
      >
        Forget your password?
      </a>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
      >
        LOG IN
      </button>
    </form>
    <div className="text-sm text-gray-600 text-center">
      Don't have an account?{" "}
      <a href="#" className="text-blue-400 hover:text-blue-600">
        Sign Up
      </a>
    </div>
    <div className="flex items-center justify-center mt-5">
      {/* Third Party Authentication Options */}
      {/* Dışarıdan giriş seçenekleri */}
    </div>
  </div>
</div>

  );
};

export default Login;
