
import React, { useState } from "react";
import { useLoginMutation } from "../Slice/LoginSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { Phone, Lock, LogIn, Loader2 } from 'lucide-react';
import mainLogo from '../assets/main_logo.png'; 

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loginData = {
      phone_number: phone,
      password: password,
    };

    try {
      const response = await loginUser(loginData).unwrap();
      toast.success("تم تسجيل الدخول بنجاح");
      Cookies.set("token", response.token, { expires: 7 });
      navigate("/home", { replace: true }); 
    } catch (error) {
      const errorMessage = error.data?.message || "فشل تسجيل الدخول، تحقق من البيانات.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 sm:p-10 w-full max-w-md border border-slate-200">
        <div className="mb-8 text-center">
          <img
            src={mainLogo}
            alt="شعار النظام"
            className="mx-auto mb-4 w-24 h-24 object-contain"
          />
          <h2 className="text-3xl font-bold text-textMain">
            نظام الإدارة المدرسية
          </h2>
          <p className="text-slate-500 mt-2">يرجى تسجيل الدخول للمتابعة</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-right text-sm font-medium text-slate-700 mb-1">
              رقم الجوال
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xxxxxxxx"
                className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-right text-sm font-medium text-slate-700 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors duration-300 flex items-center justify-center bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <LogIn className="mr-2" size={20} />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
