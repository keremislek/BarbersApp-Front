import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {jwtDecode} from "jwt-decode";

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
    e.preventDefault();

    if (!email || !password) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      setError("Geçersiz email formatı.");
      return;
    }

    console.log("Giriş yapılıyor", email, password);

    try {
      const success = await login(email, password);
      if (success) {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token bulunamadı");
          return;
        }

        const decoded = jwtDecode(token);
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
    } catch (err) {
      console.error("Login failed", err);
      setError("Giriş başarısız oldu. Lütfen tekrar deneyin.");
    }
  };

  console.log("Sayfa yüklendi");

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Giriş Yap</h1>
        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}
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
              Şifre
            </label>
            <input
              id="password"
              type="password"
              placeholder="Şifre"
              className="border border-gray-300 rounded-lg py-2 px-4"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r items-center text-center from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              GİRİŞ YAP
            </button>
          </div>
        </form>
        <div className="text-sm text-gray-600 text-center">
          Hesabın yok mu?{" "}
          <a
            href="#"
            onClick={handleSignupClick}
            className="text-blue-400 hover:text-blue-600"
          >
            Kaydol
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
