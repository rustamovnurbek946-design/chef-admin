import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ChefHat,
  Settings,
  Settings2,
  Globe,
} from "lucide-react";

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const links = [
    { path: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { path: "/recipes", label: t("recipes"), icon: ChefHat },
    { path: "/statistics", label: t("statistics"), icon: Settings2 },
    { path: "/settings", label: t("settings"), icon: Settings },
  ];

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${
      isDark ? "bg-[#0f172a] text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* SIDEBAR */}
      <aside className="relative w-72 flex flex-col border-r border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl z-10">
        
        {/* Logo Section */}
        <div className="p-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black tracking-tight bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
          >
            {t("chefAdmin")}
          </motion.h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className="relative group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                {/* Active Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon & Label */}
                <span className={`relative z-10 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                }`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                
                <span className={`relative z-10 transition-colors duration-300 ${
                  isActive ? "text-white font-semibold" : "text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                }`}>
                  {link.label}
                </span>

                {/* Hover Indicator (faqat aktiv bo'lmaganlar uchun) */}
                {!isActive && (
                  <motion.div 
                    whileHover={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl -z-0"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Language Switcher */}
        <div className="p-6 mt-auto border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <Globe size={14} />
            <span className="text-xs uppercase tracking-widest font-bold">{t("language")}</span>
          </div>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
            {["en", "uz", "ru"].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  i18n.changeLanguage(lang);
                  localStorage.setItem("lang", lang);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  i18n.language === lang 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}