import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Mail, Lock, LogIn, Loader2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import instance from "../utils/axios";

const Login = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const isDark = document.documentElement.classList.contains("dark");

    try {
      const res = await instance.post("/login", data);
      localStorage.setItem("token", res.data.token);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: t('loginSuccess'),
        showConfirmButton: false,
        timer: 1500,
        background: isDark ? '#1e293b' : '#fff',
        color: isDark ? '#fff' : '#000'
      }).then(() => {
        nav("/dashboard");
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: err.response?.data?.message || t('invalidCredentials'),
        confirmButtonColor: '#f97316',
        background: isDark ? '#1e293b' : '#fff',
        color: isDark ? '#fff' : '#000'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animatsiya variantlari
  const containerVars = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 relative overflow-hidden transition-colors duration-500">
      
      {/* Orqa fon uchun dekorativ elementlar (Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 dark:border-gray-700/50 relative z-10"
      >
        <motion.div variants={itemVars} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white mb-6 shadow-lg shadow-blue-500/30">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            {t('welcome')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {t('loginSubtitle')}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <motion.div variants={itemVars} className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t('email')}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'} transition-colors`} size={20} />
              </div>
              <input
                type="email"
                placeholder="admin@example.com"
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border ${errors.email ? 'border-red-400 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/30 focus:border-blue-500'} rounded-2xl shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 transition-all placeholder-gray-400 font-medium`}
                {...register("email", { 
                  required: t('emailRequired'),
                  pattern: { value: /^\S+@\S+$/i, message: t('invalidEmail') }
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-bold pl-2 mt-1">{errors.email.message}</p>
            )}
          </motion.div>

          {/* Password Input */}
          <motion.div variants={itemVars} className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t('password')}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'} transition-colors`} size={20} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border ${errors.password ? 'border-red-400 focus:ring-red-500/30' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/30 focus:border-blue-500'} rounded-2xl shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 transition-all placeholder-gray-400 font-medium`}
                {...register("password", { 
                  required: t('passwordRequired'), 
                  minLength: { value: 6, message: t('passwordMinLength') } 
                })}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-bold pl-2 mt-1">{errors.password.message}</p>
            )}
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div variants={itemVars} className="flex justify-end">
            <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
              {t('forgotPassword')}
            </a>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVars} className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {t('loggingIn')}
                </>
              ) : (
                <>
                  {t('login')}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        {/* Register Link */}
        <motion.div variants={itemVars} className="mt-8 text-center text-gray-500 dark:text-gray-400 font-medium text-sm">
          {t('noAccount')}{" "} 
          <Link to="/register" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors font-bold">
            {t('register')}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;