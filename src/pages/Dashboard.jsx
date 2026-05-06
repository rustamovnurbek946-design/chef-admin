import React, { useState, useEffect } from "react";
import {
  ChefHat, Eye, TrendingUp, PlusCircle, Users, AlertTriangle,
  CheckCircle, ArrowUpRight, Activity, Clock, Link2,
  BarChart3, MessageSquare, Star, Server, MoreVertical,
  CalendarDays, Download, Filter, RefreshCw, XCircle, Zap
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

// ----------------------------------------------------------------------
// MOCK DATA - Dashboard uchun realistik ma'lumotlar
// ----------------------------------------------------------------------
const MOCK_CHART_DATA = [
  { name: 'Du', views: 4000, users: 2400 },
  { name: 'Se', views: 3000, users: 1398 },
  { name: 'Ch', views: 2000, users: 9800 },
  { name: 'Pa', views: 2780, users: 3908 },
  { name: 'Ju', views: 1890, users: 4800 },
  { name: 'Sh', views: 2390, users: 3800 },
  { name: 'Ya', views: 3490, users: 4300 },
];

const CATEGORY_DATA = [
  { name: 'Milliy taomlar', value: 45 },
  { name: 'Fast Food', value: 25 },
  { name: 'Shirinliklar', value: 20 },
  { name: 'Ichimliklar', value: 10 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

const RECENT_COMMENTS = [
  { id: 1, user: "Azizbek", recipe: "Palov", text: "Juda zo'r retsept ekan, rahmat!", rating: 5, time: "10 daqiqa oldin" },
  { id: 2, user: "Malika", recipe: "Somsa", text: "Hamiri biroz qattiq chiqdi, nimadan bo'lishi mumkin?", rating: 4, time: "1 soat oldin" },
  { id: 3, user: "Umid", recipe: "Manti", text: "Videodagi kabi o'xshadi, oilamizga yoqdi.", rating: 5, time: "3 soat oldin" },
];

// ----------------------------------------------------------------------
// ASOSIY KOMPONENT
// ----------------------------------------------------------------------
export default function PremiumDashboard() {
  const { t } = useTranslation();

  // States
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pendingRecipes, setPendingRecipes] = useState([
    { id: 1, name: "Shokoladli Tort", author: "Zarina", type: "Shirinlik" },
    { id: 2, name: "Dietik Salatlar", author: "Rustam", type: "Foydali" },
    { id: 3, name: "Qozon Kabob", author: "Sardor", type: "Milliy" },
  ]);

  // Real-time soat
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const approveRecipe = (id) => {
    setPendingRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  // Animatsiya variantlari
  const containerVars = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVars = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring" } } };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 p-4 md:p-8 font-sans transition-colors duration-500">

      {/* 1. HEADER SECTION */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Activity size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("dashboardTitle")}
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-sm mt-2">
            {t("dashboardSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-slate-800/50 p-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm backdrop-blur-xl">
            <Clock className="text-indigo-500 animate-pulse" size={20} />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 leading-none mb-1">
                {t("liveTime")}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                {currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center justify-center p-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300"
          >
            <RefreshCw size={20} className={isRefreshing ? "animate-spin text-indigo-500" : ""} />
          </button>

          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white p-3 px-6 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/30">
            <Download size={18} /> <span className="hidden sm:inline">{t("downloadReport")}</span>
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVars} initial="hidden" animate="visible">

        {/* 2. STATS GRID (Asosiy ko'rsatkichlar) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: t("totalRecipes"), value: "1,248", icon: ChefHat, color: "from-indigo-500 to-blue-600", trend: "+12.5%", bg: "bg-indigo-50 dark:bg-indigo-500/10", textCol: "text-indigo-600 dark:text-indigo-400" },
            { title: t("totalUsers"), value: "8,549", icon: Users, color: "from-emerald-500 to-teal-600", trend: "+5.2%", bg: "bg-emerald-50 dark:bg-emerald-500/10", textCol: "text-emerald-600 dark:text-emerald-400" },
            { title: t("views"), value: "124.5K", icon: Eye, color: "from-amber-500 to-orange-600", trend: "+18.3%", bg: "bg-amber-50 dark:bg-amber-500/10", textCol: "text-amber-600 dark:text-amber-400" },
            { title: t("saved"), value: "45.2K", icon: Star, color: "from-rose-500 to-pink-600", trend: "+2.4%", bg: "bg-rose-50 dark:bg-rose-500/10", textCol: "text-rose-600 dark:text-rose-400" },
          ].map((item, index) => (
            <motion.div key={index} variants={itemVars} whileHover={{ y: -5 }} className="relative bg-white dark:bg-slate-800/80 p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-700/50 backdrop-blur-xl group overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-125 duration-500">
                <item.icon size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${item.bg} ${item.textCol}`}>
                    <item.icon size={24} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 px-3 py-1.5 rounded-xl">
                    <TrendingUp size={14} /> {item.trend}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{item.title}</p>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{item.value}</h2>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. MAIN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN (Kengroq qism) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Analitika Grafiki */}
            <motion.div variants={itemVars} className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
                    <BarChart3 className="text-indigo-500" size={20} /> {t("visitorDynamics")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("last7Days")}</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button className="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-xs font-bold text-slate-800 dark:text-white">{t("week")}</button>
                  <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">{t("month")}</button>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff', color: '#000', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Ommabop Retseptlar Table */}
            <motion.div variants={itemVars} className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" size={20} /> {t("topRecipes")}
                </h3>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  <MoreVertical size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700/50">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("recipeName")}</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("category")}</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t("views")}</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {[
                      { name: "Asilbek Palovi", cat: t("national"), views: "24.5K", img: "🍛", trend: "up" },
                      { name: "Tovuqli Somsa", cat: t("pastry"), views: "18.2K", img: "🥟", trend: "up" },
                      { name: "Moxito Yozgi", cat: t("drinks"), views: "12.8K", img: "🍹", trend: "down" }
                    ].map((recipe, i) => (
                      <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl shadow-inner">{recipe.img}</div>
                            <span className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-indigo-500 transition-colors">{recipe.name}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                            {recipe.cat}
                          </span>
                        </td>
                        <td className="py-4 text-right font-black text-slate-700 dark:text-slate-200">{recipe.views}</td>
                        <td className="py-4 text-center">
                          <button className="inline-flex w-8 h-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                            <ArrowUpRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN (Tor qism) */}
          <div className="space-y-8">

            {/* Tezkor Harakatlar */}
            <motion.div variants={itemVars} className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 relative z-10">
                <Zap className="text-yellow-400" size={20} /> {t("quickActions")}
              </h3>
              <div className="space-y-3 relative z-10">
                <Link to="/create-recipe" className="flex items-center justify-between bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl transition-all font-bold text-sm border border-white/10 group">
                  <div className="flex items-center gap-3"><PlusCircle size={18} className="group-hover:rotate-90 transition-transform" /> {t("newRecipe")}</div>
                  <ArrowUpRight size={16} className="opacity-50 group-hover:opacity-100" />
                </Link>
                <Link to="/reports" className="flex items-center justify-between bg-rose-500/80 hover:bg-rose-500 p-4 rounded-2xl transition-all font-bold text-sm border border-rose-400/50">
                  <div className="flex items-center gap-3"><AlertTriangle size={18} /> {t("complaints")} (3)</div>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Tasdiqlashni kutayotganlar */}
            <motion.div variants={itemVars} className="bg-white dark:bg-slate-800/80 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
                  <Clock className="text-amber-500" size={20} /> {t("pendingApproval")}
                </h3>
                <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black px-2.5 py-1 rounded-full">{pendingRecipes.length}</span>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {pendingRecipes.length > 0 ? pendingRecipes.map((recipe) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50"
                    >
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{recipe.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">{t("author")}: {recipe.author}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approveRecipe(recipe.id)} className="p-2 text-emerald-500 hover:bg-emerald-500 hover:text-white bg-emerald-50 dark:bg-emerald-500/10 rounded-xl transition-all">
                          <CheckCircle size={18} />
                        </button>
                        <button onClick={() => approveRecipe(recipe.id)} className="p-2 text-rose-500 hover:bg-rose-500 hover:text-white bg-rose-50 dark:bg-rose-500/10 rounded-xl transition-all">
                          <XCircle size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )) : (
                    <p className="text-center text-sm font-bold text-slate-400 py-4">{t("noPendingRecipes")}</p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Tizim Holati / Server */}
            <motion.div variants={itemVars} className="bg-white dark:bg-slate-800/80 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700/50">
              <h3 className="text-lg font-black mb-6 dark:text-white flex items-center gap-2">
                <Server className="text-slate-500" size={20} /> {t("systemStatus")}
              </h3>
              <div className="space-y-5">
                {[
                  { label: t("serverMemory"), val: "64%", color: "bg-indigo-500" },
                  { label: t("databaseLoad"), val: "28%", color: "bg-emerald-500" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-500 dark:text-slate-400">{stat.label}</span>
                      <span className="text-slate-800 dark:text-white">{stat.val}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className={`${stat.color} h-2 rounded-full`} style={{ width: stat.val }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Kategoriyalar statistikasi */}
            <motion.div variants={itemVars} className="bg-white dark:bg-slate-800/80 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700/50">
              <h3 className="text-lg font-black mb-6 dark:text-white flex items-center gap-2">
                <PieChart className="text-indigo-500" size={20} /> {t("categories")}
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {CATEGORY_DATA.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                    <span className="font-bold text-slate-800 dark:text-white ml-auto">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}