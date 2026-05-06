import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Eye, Users, Heart, TrendingUp, ChefHat, 
  DownloadCloud, RefreshCw, Sparkles, Filter, 
  Calendar, Activity, Star, Clock, Utensils,
  Zap, ShieldCheck, Layers, Search
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, AreaChart, Cell, PieChart, Pie,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

// ----------------------------------------------------------------------
// DATA ENGINE - Dinamik ma'lumot generatori
// ----------------------------------------------------------------------
const generateChartData = (timeframe) => {
  const configs = {
    'Kunlik': { count: 24, label: (i) => `${i}:00` },
    'Haftalik': { count: 7, label: (i) => ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'][i] },
    'Oylik': { count: 12, label: (i) => ['Yan', 'Feb', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'][i] },
    'Yillik': { count: 5, label: (i) => `${2022 + i}-yil` }
  };

  const config = configs[timeframe] || configs['Haftalik'];
  return Array.from({ length: config.count }, (_, i) => ({
    name: config.label(i),
    views: Math.floor(Math.random() * 8000) + 1000,
    likes: Math.floor(Math.random() * 4000) + 500,
    chefs: Math.floor(Math.random() * 30) + 5
  }));
};

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f43f5e'];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export default function AdvancedStatistics({ bgColor = "bg-gray-50", cardBgColor = "bg-white/80" }) {
  const { t } = useTranslation();
  
  // State-lar
  const [isRendering, setIsRendering] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('Haftalik');
  const [data, setData] = useState([]);
  const [renderKey, setRenderKey] = useState(0);
  const [liveStats, setLiveStats] = useState({ onlineUsers: 147, totalOrders: 320, activeChefs: 32, totalViews: 10204 });

  // Ranglar va Dizayn
  const isDark = bgColor.includes('green') || bgColor.includes('gray-900') || bgColor.includes('black');
  const textColor = isDark ? "text-white" : "text-slate-900";
  const subTextColor = isDark ? "text-slate-400" : "text-slate-500";
  const borderColor = isDark ? "border-white/10" : "border-slate-200/60";

  // 1. Initial Data Load
  useEffect(() => {
    setData(generateChartData(selectedTimeframe));
  }, [selectedTimeframe]);

  // 2. Real-time Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        onlineUsers: Math.max(50, prev.onlineUsers + Math.floor(Math.random() * 5) - 2),
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 2),
        activeChefs: Math.floor(Math.random() * 3) + 30,
        totalViews: prev.totalViews + Math.floor(Math.random() * 100)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------------------------
  // ACTIONS (Funksiyalar)
  // ----------------------------------------------------------------------
  
  const handleManualRender = useCallback(() => {
    setIsRendering(true);
    
    setTimeout(() => {
      setRenderKey(prev => prev + 1);
      setData(generateChartData(selectedTimeframe));
      setIsRendering(false);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: t('chartsRendered'),
        showConfirmButton: false,
        timer: 2000,
        background: isDark ? '#1e293b' : '#fff',
        color: isDark ? '#fff' : '#000',
      });
    }, 1000);
  }, [selectedTimeframe, isDark, t]);

  const handleExport = () => {
    Swal.fire({
      title: t('preparingReport'),
      text: `${selectedTimeframe} ${t('dataAnalyzing')}`,
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });
  };
  
  return (
    <motion.div
      key={renderKey}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-4 md:p-10 min-h-screen transition-all duration-700 font-sans `}
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div className={`relative p-6 ${cardBgColor} backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border ${borderColor} ring-8 ring-orange-500/5`}>
            <Activity className="text-orange-500 relative z-10" size={40} />
          </div>
          <div>
            <h1 className={`text-5xl md:text-7xl font-black leading-none uppercase italic`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-red-500 to-amber-400">
                {t('statistics')}
              </span>
            </h1>
            <p className={`${subTextColor} font-bold uppercase tracking-[0.4em] text-[10px] mt-2`}>
              {t('statisticsSubtitle')}
            </p>
          </div>
        </div>

        {/* Buttons Group */}
        <div className="flex flex-wrap gap-4 p-3 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
          {[t('daily'), t('weekly'), t('monthly'), t('yearly')].map((time, idx) => {
            const timeKey = ['Kunlik', 'Haftalik', 'Oylik', 'Yillik'][idx];
            return (
              <button
                key={timeKey}
                onClick={() => setSelectedTimeframe(timeKey)}
                className={`px-6 py-3 rounded-2xl text-xs font-black transition-all ${
                  selectedTimeframe === timeKey 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105' 
                  : `${textColor} hover:bg-white/10`
                }`}
              >
                {time}
              </button>
            );
          })}
          
          <div className="w-[1px] h-10 bg-white/10 mx-2 hidden md:block"></div>

          <button
            onClick={handleManualRender}
            disabled={isRendering}
            className={`px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-emerald-500 transition-all active:scale-95 ${isRendering ? 'opacity-50 cursor-wait' : ''}`}
          >
            <RefreshCw size={18} className={isRendering ? "animate-spin" : ""} />
            {isRendering ? t('rendering') : t('render')}
          </button>

          <button
            onClick={handleExport}
            className="px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-all active:scale-95 border border-white/10"
          >
            <DownloadCloud size={18} /> {t('export')}
          </button>
        </div>
      </div>

      {/* 2. Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: t('liveUsers'), val: liveStats.onlineUsers, icon: Users, color: 'from-blue-600 to-cyan-500' },
          { label: t('dailyOrders'), val: liveStats.totalOrders, icon: Utensils, color: 'from-orange-600 to-red-500' },
          { label: t('activeChefs'), val: liveStats.activeChefs, icon: ChefHat, color: 'from-emerald-600 to-teal-500' },
          { label: t('growthRate'), val: '+24.8%', icon: TrendingUp, color: 'from-purple-600 to-pink-500' },
        ].map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx}
            className={`relative overflow-hidden bg-gradient-to-br ${item.color} p-8 rounded-[2.5rem] text-white shadow-2xl group`}
          >
            <div className="absolute -right-6 -top-6 opacity-20 group-hover:scale-110 transition-transform duration-700">
              <item.icon size={140} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">{item.label}</p>
              <h3 className="text-4xl font-black tabular-nums tracking-tighter italic">{item.val}</h3>
              <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span className="text-[9px] font-bold">{t('realTimeData')}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Main Chart Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        <motion.div
          className={`xl:col-span-2 ${cardBgColor} backdrop-blur-md p-10 rounded-[3rem] border ${borderColor} shadow-2xl relative overflow-hidden`}
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className={`text-3xl font-black ${textColor} flex items-center gap-4 italic`}>
                <Layers className="text-orange-500" />
                {selectedTimeframe === 'Kunlik' ? t('dailyActivity') : 
                 selectedTimeframe === 'Haftalik' ? t('weeklyActivity') :
                 selectedTimeframe === 'Oylik' ? t('monthlyActivity') : t('yearlyActivity')}
              </h2>
              <p className={subTextColor}>{t('activityAnalysis')}</p>
            </div>
          </div>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#ffffff05" : "#00000008"} vertical={false} />
                <XAxis dataKey="name" stroke={subTextColor} axisLine={false} tickLine={false} fontSize={12} fontWeight="800" dy={10} />
                <YAxis stroke={subTextColor} axisLine={false} tickLine={false} fontSize={12} fontWeight="800" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#fff',
                    borderRadius: '24px', border: 'none',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    padding: '20px', fontWeight: 'bold'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#f97316" 
                  strokeWidth={6} 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="likes" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#3b82f6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Radar Analysis */}
        <motion.div
          className={`${cardBgColor} backdrop-blur-md p-10 rounded-[3rem] border ${borderColor} shadow-2xl flex flex-col items-center justify-center`}
        >
          <div className="w-full text-left mb-6">
            <h2 className={`text-2xl font-black ${textColor} italic`}>{t('platformQuality')}</h2>
            <p className={subTextColor}>{t('metricsOverview')}</p>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                { subject: t('performance'), A: 88 },
                { subject: t('quality'), A: 92 },
                { subject: t('design'), A: 85 },
                { subject: t('security'), A: 78 },
                { subject: t('usability'), A: 94 },
              ]}>
                <PolarGrid stroke={isDark ? "#ffffff10" : "#00000010"} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: subTextColor, fontSize: 10, fontWeight: 'bold' }} />
                <Radar dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-4 mt-6">
             <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('optimization')}</span>
                <span className={`font-black ${textColor}`}>92%</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Bottom Activity Table */}
      <motion.div
        className={`${cardBgColor} backdrop-blur-md p-10 rounded-[3rem] border ${borderColor} shadow-2xl`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <h2 className={`text-3xl font-black ${textColor} italic`}>{t('recentActivities')}</h2>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={t('search')}
              className="bg-slate-100 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-orange-500 w-full md:w-80 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>{t('id')}</th>
                <th className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>{t('user')}</th>
                <th className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>{t('actionType')}</th>
                <th className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <tr key={item} className="group hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="py-6 font-mono text-xs opacity-50">#294{item}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white font-black text-xs">U{item}</div>
                      <p className={`font-bold text-sm ${textColor}`}>{t('user')} {item}</p>
                    </div>
                  </td>
                  <td className="py-6 text-sm font-medium opacity-80">{t('recipeUpdated')}</td>
                  <td className="py-6">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/20">
                      {t('active')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
}

AdvancedStatistics.propTypes = {
  bgColor: PropTypes.string,
  cardBgColor: PropTypes.string,
};