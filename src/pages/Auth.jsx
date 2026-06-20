import React, { useState } from "react";
import { loginAPI, registerAPI } from "../services/allAPI";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await registerAPI(form);
      alert("Registered successfully");
      setIsLogin(true);
    } catch (err) {
      console.log(err);
      alert("Register failed");
    }
  }

  const handleLogin = async () => {
    try {
      const res = await loginAPI({ email: form.email, password: form.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("role", res.data.user.role);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-xl w-[400px]">
        <h2 className="text-2xl mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>
        {!isLogin && (
          <input name="username" placeholder="Username" className="w-full p-2 mb-3 bg-zinc-800 rounded" onChange={handleChange} />
        )}
        <input name="email" placeholder="Email" className="w-full p-2 mb-3 bg-zinc-800 rounded" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 mb-3 bg-zinc-800 rounded" onChange={handleChange} />
        <button onClick={isLogin ? handleLogin : handleRegister} className="w-full bg-fuchsia-600 py-2 rounded">
          {isLogin ? "Login" : "Register"}
        </button>
        <p onClick={() => setIsLogin(!isLogin)} className="text-center mt-4 cursor-pointer text-gray-400">
          {isLogin ? "Create new account" : "Already have an account? Login"}
        </p>

      </div>
    </div>
  );
}

export default Auth;