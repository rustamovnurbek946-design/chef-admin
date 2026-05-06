import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle, XCircle, Eye, MessageCircle, Search, Filter,
  Calendar, User, Download, MoreVertical, Trash2, Check,
  AlertCircle, ArrowUpDown, ChevronLeft, ChevronRight,
  BarChart3, PieChart, Activity, ShieldCheck, FileText,
  Share2, Printer, Mail, ExternalLink, RefreshCw
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data Generator ---
const generateReports = () => {
  const types = ["good", "bad"];
  const users = ["John Doe", "Anna Smith", "Chef Mike", "Alice Johnson", "David Bek", "Sarah Connor"];
  const titles = [
    "Chocolate Cake Popular", "Expired Ingredient Report", "New Recipe Approved", 
    "Spam Report", "Pasta Carbonara Trending", "Wrong Ingredient", 
    "Ice Cream 1000 Likes", "Incorrect Cooking Time", "Sourdough Success",
    "Vegan Salad Issue", "User Feedback: UI", "Database Optimization",
    "API Latency Report", "New Pro User", "Subscription Cancelled"
  ];

  return Array.from({ length: 45 }).map((_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    title: titles[i % titles.length],
    description: `Detailed analysis for report #${i + 1}. This includes user behavior, recipe metrics, and system logs recorded during the session.`,
    userName: users[Math.floor(Math.random() * users.length)],
    date: `2026-04-${(10 + (i % 20)).toString().padStart(2, '0')}`,
    comments: Math.floor(Math.random() * 20),
    status: i % 3 === 0 ? "Pending" : "Resolved",
    priority: i % 4 === 0 ? "High" : "Normal",
    views: Math.floor(Math.random() * 1000)
  }));
};

export default function ViewReport() {
  const { t } = useTranslation();
  
  // --- States ---
  const [reports, setReports] = useState(generateReports());
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 6;

  // --- Effects ---
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- Logic: Sorting & Filtering ---
  const filteredReports = useMemo(() => {
    let result = reports.filter((r) => {
      const matchesFilter = filter === "all" || r.type === filter;
      const matchesSearch = 
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.userName.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [reports, filter, search, sortConfig]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentData = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Handlers ---
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const deleteReport = (id) => {
    const isDark = document.documentElement.classList.contains("dark");
    if (window.confirm(t('confirmDeleteReport'))) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const exportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(t('exportSuccess'));
    }, 1500);
  };

  // --- Analytics Stats ---
  const stats = [
    { label: t('total'), val: reports.length, icon: FileText, color: "blue" },
    { label: t('positive'), val: reports.filter(r => r.type === 'good').length, icon: ShieldCheck, color: "emerald" },
    { label: t('problematic'), val: reports.filter(r => r.type === 'bad').length, icon: AlertCircle, color: "rose" },
    { label: t('activity'), val: "84%", icon: Activity, color: "amber" },
  ];

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <RefreshCw className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-10 transition-all duration-500 text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTION 1: HEADER & STATS --- */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-500 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                <BarChart3 size={24} />
              </span>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                {t('reportsCenter')}
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {t('reportsSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <s.icon size={16} className={`text-${s.color}-500 mb-1`} />
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{s.label}</p>
                <p className="text-xl font-black dark:text-white">{s.val}</p>
              </motion.div>
            ))}
          </div>
        </header>

        {/* --- SECTION 2: TOOLBAR --- */}
        <motion.div 
          className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 mb-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all outline-none font-bold"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-[1.5rem]">
              {["all", "good", "bad"].map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setCurrentPage(1); }}
                  className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${
                    filter === f
                      ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t(f === 'all' ? 'all' : f === 'good' ? 'positive' : 'negative')}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={exportData}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-[1.5rem] font-black text-sm transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                {isExporting ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                {t('export')}
              </button>
              <button className="p-4 bg-gray-50 dark:bg-gray-800 rounded-[1.5rem] text-gray-500 hover:bg-gray-100 transition-all">
                <Printer size={20} />
              </button>
            </div>
          </div>

          {/* Sort Pills */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <ArrowUpDown size={14} /> {t('sortBy')}:
            </span>
            {['title', 'date', 'comments', 'views'].map((key) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${
                  sortConfig.key === key ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "border-gray-200 text-gray-500"
                }`}
              >
                {t(key)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* --- SECTION 3: CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {currentData.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                className={`relative group bg-white dark:bg-gray-900 p-8 rounded-[3rem] border transition-all duration-500 shadow-xl shadow-gray-200/40 dark:shadow-none ${
                  report.type === "good" ? "border-emerald-100/50 hover:border-emerald-400" : "border-rose-100/50 hover:border-rose-400"
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-[1.5rem] ${
                    report.type === "good" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    {report.type === "good" ? <ShieldCheck size={26} /> : <AlertCircle size={26} />}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full mb-2 ${
                      report.priority === 'High' ? "bg-rose-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}>
                      {t(report.priority === 'High' ? 'high' : 'normal')}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> {report.date}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                  {report.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                  {report.description}
                </p>

                {/* User & Meta */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-[1.8rem] mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                    {report.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black dark:text-white">{report.userName}</p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{t('verifiedAuthor')}</p>
                  </div>
                  <div className="flex flex-col items-end opacity-40">
                    <Eye size={16} />
                    <span className="text-[10px] font-black">{report.views}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-indigo-500">
                      <MessageCircle size={18} />
                      <span className="text-sm font-black">{report.comments}</span>
                    </div>
                    <button className="text-gray-300 hover:text-rose-500 transition-colors" onClick={() => deleteReport(report.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="group/btn flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-2xl font-black text-xs hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg"
                  >
                    {t('details')}
                    <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- SECTION 4: PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft size={20} className="dark:text-white" />
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                    currentPage === i + 1 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                    : "bg-white dark:bg-gray-900 text-gray-500 border border-gray-100 dark:border-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 transition-all"
            >
              <ChevronRight size={20} className="dark:text-white" />
            </button>
          </div>
        )}

        {/* --- SECTION 5: MODAL (DETAILS VIEW) --- */}
        <AnimatePresence>
          {selectedReport && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative"
              >
                <button onClick={() => setSelectedReport(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <XCircle size={32} />
                </button>

                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 ${
                  selectedReport.type === 'good' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                }`}>
                  {selectedReport.type === 'good' ? <ShieldCheck size={40} /> : <AlertCircle size={40} />}
                </div>

                <h3 className="text-4xl font-black dark:text-white mb-4 tracking-tighter">{selectedReport.title}</h3>
                <div className="flex gap-4 mb-8">
                  <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl text-xs font-black text-gray-500 uppercase tracking-widest">
                    {t('id')}: #{selectedReport.id}
                  </span>
                  <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                    {t('status')}: {t(selectedReport.status === 'Pending' ? 'pending' : 'resolved')}
                  </span>
                </div>

                <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10 font-medium">
                  {selectedReport.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem]">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{t('user')}</p>
                    <p className="font-black dark:text-white">{selectedReport.userName}</p>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem]">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{t('date')}</p>
                    <p className="font-black dark:text-white">{selectedReport.date}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-indigo-600 text-white py-5 rounded-[1.8rem] font-black text-sm shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">
                    {t('resolveIssue')}
                  </button>
                  <button className="p-5 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-[1.8rem] font-black">
                    <Share2 size={24} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && filteredReports.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40 bg-white dark:bg-gray-900 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
            <Search className="mx-auto text-gray-200 dark:text-gray-800 mb-6" size={80} />
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('noDataFound')}</h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{t('changeSearchParams')}</p>
            <button onClick={() => {setSearch(""); setFilter("all");}} className="mt-8 text-indigo-500 font-black border-b-2 border-indigo-500 pb-1">
              {t('showAll')}
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}