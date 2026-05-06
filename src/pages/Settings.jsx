import React, { useEffect, useState } from "react";
import { Card, Typography, Switch, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  LogOut, 
  Sparkles,
  Gauge,
  Type
} from "lucide-react";
import Swal from "sweetalert2";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState('normal'); // slow, normal, fast
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large

  // Dark mode effect
  useEffect(() => {
    const savedDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDark);
    if (savedDark) document.documentElement.classList.add("dark");
  }, []);

  // Font size effect
  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    setFontSize(savedFontSize);
    applyFontSize(savedFontSize);
  }, []);

  // Animation speed effect
  useEffect(() => {
    const savedSpeed = localStorage.getItem("animationSpeed") || "normal";
    setAnimationSpeed(savedSpeed);
  }, []);

  const applyFontSize = (size) => {
    const root = document.documentElement;
    if (size === 'small') {
      root.style.fontSize = '14px';
    } else if (size === 'medium') {
      root.style.fontSize = '16px';
    } else if (size === 'large') {
      root.style.fontSize = '18px';
    }
  };

  const toggleDark = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleAnimationSpeedChange = (speed) => {
    setAnimationSpeed(speed);
    localStorage.setItem("animationSpeed", speed);
    
    let duration = 0.3;
    if (speed === 'slow') duration = 0.8;
    if (speed === 'fast') duration = 0.15;
    
    document.documentElement.style.setProperty('--animation-duration', `${duration}s`);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    applyFontSize(size);
    
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: size === 'small' ? t('fontSizeSmall') : size === 'medium' ? t('fontSizeMedium') : t('fontSizeLarge'),
      showConfirmButton: false,
      timer: 1500,
      background: darkMode ? '#1e293b' : '#fff',
      color: darkMode ? '#fff' : '#000'
    });
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: t('languageChanged'),
      showConfirmButton: false,
      timer: 1500,
      background: darkMode ? '#1e293b' : '#fff',
      color: darkMode ? '#fff' : '#000'
    });
  };

  const logout = () => {
    Swal.fire({
      title: t('exitTitle'),
      text: t('exitText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#64748b',
      confirmButtonText: t('yes'),
      cancelButtonText: t('no'),
      background: darkMode ? '#1e293b' : '#fff',
      color: darkMode ? '#fff' : '#000'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    });
  };

  const getAnimationDuration = () => {
    if (animationSpeed === 'slow') return 0.8;
    if (animationSpeed === 'fast') return 0.15;
    return 0.6;
  };

  const containerVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: getAnimationDuration(), 
        staggerChildren: animationSpeed === 'fast' ? 0.05 : 0.1 
      } 
    }
  };

  const itemVars = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: getAnimationDuration() * 0.7 } }
  };

  return (
    <div className="min-h-screen md:ml-[2px] p-4 md:p-10 flex items-center justify-center transition-colors duration-500">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVars}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.div variants={itemVars} className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-3xl mb-4 border border-white/20">
            <SettingsIcon className="text-blue-500 animate-[spin_4s_linear_infinite]" size={40} />
          </motion.div>
          <Typography
            variant="h2"
            className="font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
          >
            {t("settings")}
          </Typography>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            {t('settingsSubtitle')}
          </p>
        </div>

        <Card className="relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-6 md:p-10 flex flex-col gap-8 border border-white/40 dark:border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>

          {/* DARK MODE */}
          <motion.div variants={itemVars} className="flex justify-between items-center p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-orange-500/20 text-orange-500'}`}>
                {darkMode ? <Moon size={24} /> : <Sun size={24} />}
              </div>
              <div>
                <Typography className="dark:text-white text-xl font-bold">{t("darkMode")}</Typography>
                <p className="text-xs text-slate-500">{darkMode ? t('darkModeActive') : t('lightModeActive')}</p>
              </div>
            </div>
            <Switch 
              id="dark-mode"
              checked={darkMode} 
              onChange={toggleDark}
              ripple={true}
              className="checked:bg-indigo-500"
            />
          </motion.div>

          {/* FONT SIZE */}
          <motion.div variants={itemVars} className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-500">
                <Type size={24} />
              </div>
              <div>
                <Typography className="dark:text-white text-xl font-bold">{t('fontSize')}</Typography>
                <p className="text-xs text-slate-500">{t('fontSizeDesc')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <Button
                  key={size}
                  variant={fontSize === size ? "gradient" : "text"}
                  color={fontSize === size ? "purple" : "blue-gray"}
                  onClick={() => handleFontSizeChange(size)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm capitalize transition-all transform"
                >
                  {size === 'small' ? t('small') : size === 'medium' ? t('medium') : t('large')}
                </Button>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-black/5 dark:bg-white/5 text-center">
              <p className="text-sm text-slate-500">{t('fontPreview')}: {fontSize === 'small' ? '14px' : fontSize === 'medium' ? '16px' : '18px'}</p>
              <p className="font-medium">{t('fontPreviewText')}</p>
            </div>
          </motion.div>

          {/* ANIMATION SPEED */}
          <motion.div variants={itemVars} className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-500">
                <Gauge size={24} />
              </div>
              <div>
                <Typography className="dark:text-white text-xl font-bold">{t('animationSpeed')}</Typography>
                <p className="text-xs text-slate-500">{t('animationSpeedDesc')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {['slow', 'normal', 'fast'].map((speed) => (
                <Button
                  key={speed}
                  variant={animationSpeed === speed ? "gradient" : "text"}
                  color={animationSpeed === speed ? "cyan" : "blue-gray"}
                  onClick={() => handleAnimationSpeedChange(speed)}
                  className="flex-1 py-3 rounded-xl font-bold capitalize transition-all transform"
                >
                  {speed === 'slow' ? `🐢 ${t('slow')}` : speed === 'normal' ? `⚡ ${t('normal')}` : `🚀 ${t('fast')}`}
                </Button>
              ))}
            </div>
            <motion.div 
              className="mt-4 p-3 rounded-lg bg-black/5 dark:bg-white/5 text-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: animationSpeed === 'slow' ? 0.8 : animationSpeed === 'fast' ? 0.15 : 0.3 }}
            >
              <p className="text-sm text-slate-500">{t('hoverPreview')}</p>
            </motion.div>
          </motion.div>

          {/* LANGUAGE */}
          <motion.div variants={itemVars} className="p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 border border-white/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-500">
                <Globe size={24} />
              </div>
              <Typography className="dark:text-white text-xl font-bold">{t("language")}</Typography>
            </div>

            <div className="flex flex-wrap gap-4">
              {["en", "uz", "ru"].map((lang) => (
                <Button
                  key={lang}
                  variant={i18n.language === lang ? "gradient" : "text"}
                  color={i18n.language === lang ? "blue" : "blue-gray"}
                  onClick={() => changeLanguage(lang)}
                  className={`flex-1 min-w-[100px] py-4 rounded-2xl font-black text-sm transition-all duration-300 transform ${
                    i18n.language === lang 
                    ? "scale-105 shadow-blue-500/25 shadow-xl" 
                    : "bg-white/50 dark:bg-gray-700/30 dark:text-white hover:bg-white"
                  }`}
                >
                  {lang === 'en' ? t('english') : lang === 'uz' ? t('uzbek') : t('russian')}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* LOGOUT */}
          <motion.div variants={itemVars} className="pt-4">
            <Button
              fullWidth
              onClick={logout}
              className="py-5 text-lg rounded-[2rem] font-black bg-gradient-to-r from-rose-500 via-red-600 to-orange-600 text-white shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <LogOut size={22} /> {t("logout")}
            </Button>
          </motion.div>
        </Card>

        <motion.p variants={itemVars} className="text-center mt-10 text-slate-400 text-sm font-medium">
          {t('dashboardVersion')} • <Sparkles className="inline-block" size={14} /> {t('madeWithLove')}
        </motion.p>
      </motion.div>
    </div>
  );
}