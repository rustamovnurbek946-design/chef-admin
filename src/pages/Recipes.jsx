import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import instance from "../utils/axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { 
  Search, Eye, Edit3, Trash2, X, ChefHat, 
  FileText, List, AlertCircle, Loader2, 
  Heart, Share2, Bookmark, CheckCircle,
  Clock, User, Tag, ExternalLink, Maximize2,
  Star, Award, Flame, Timer, UtensilsCrossed
} from "lucide-react";

export default function Recipes() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState({});

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const res = await instance.get("/recipes");
      return res.data;
    },
  });

  const handleDelete = (id) => {
    const isDark = document.documentElement.classList.contains("dark");
    
    Swal.fire({
      title: t('confirmDelete'),
      text: t('deleteWarning'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: t('yesDelete'),
      cancelButtonText: t('cancel'),
      background: isDark ? "#1e293b" : "#ffffff",
      color: isDark ? "#ffffff" : "#000000",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await instance.delete(`/recipes/${id}`);
          refetch();
          Swal.fire({
            title: t('deleted'),
            text: t('recipeDeleted'),
            icon: "success",
            background: isDark ? "#1e293b" : "#ffffff",
            color: isDark ? "#ffffff" : "#000000",
          });
        } catch (err) {
          console.error(err);
          Swal.fire(t('error'), t('deleteError'), "error");
        }
      }
    });
  };

  const handleLike = (id) => {
    setIsLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Safe split function
  const getIngredientsArray = (ingredients) => {
    if (!ingredients) return [];
    if (Array.isArray(ingredients)) return ingredients;
    if (typeof ingredients === 'string') return ingredients.split('\n').filter(i => i.trim());
    return [];
  };

  const getInstructionsArray = (instructions) => {
    if (!instructions) return [];
    if (Array.isArray(instructions)) return instructions;
    if (typeof instructions === 'string') return instructions.split('\n').filter(i => i.trim());
    return [];
  };

  const filteredRecipes = data?.filter((r) =>
    (r.title + r.description).toLowerCase().includes(search.toLowerCase())
  );

  // Animatsiya variantlari
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 200,
        damping: 20,
        mass: 0.8
      } 
    }
  };

  // Modal animatsiyalari
  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      transition: { duration: 0.2 }
    }
  };

  const modalContentVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      rotateX: 15
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 350,
        mass: 0.9,
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 30,
      rotateX: -10,
      transition: { 
        duration: 0.25,
        ease: "easeInOut"
      }
    }
  };

  const modalImageVariants = {
    hidden: { scale: 1.1, opacity: 0, y: -20 },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const modalContentItemVariants = {
    hidden: { y: 20, opacity: 0, filter: "blur(5px)" },
    visible: { 
      y: 0, 
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 200, delay: 0.15 }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-orange-500" />
          </motion.div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-500 dark:text-gray-400 font-medium"
          >
            {t('loadingRecipes')}
          </motion.p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 gap-4">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 0.5 }}
        >
          <AlertCircle size={48} />
        </motion.div>
        <h2 className="text-xl font-bold">{t('errorLoadingRecipes')}</h2>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition transform active:scale-95"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 transition-colors duration-500 bg-gradient-to-br">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="p-3 bg-gradient-to-br from-orange-400 to-rose-500 text-white rounded-2xl shadow-lg shadow-orange-500/30"
            >
              <ChefHat size={32} />
            </motion.div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('recipes')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                {t('recipeCollection')} • {filteredRecipes?.length || 0} {t('recipesCount')}
              </p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative group w-full md:w-96"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder={t('searchRecipes')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X className="text-gray-400 hover:text-gray-600 transition" size={18} />
              </button>
            )}
          </motion.div>
        </motion.div>

        {filteredRecipes?.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500 gap-4"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Search size={48} className="opacity-20" />
            </motion.div>
            <p className="text-lg font-medium">{t('noRecipesFound')}</p>
            <button
              onClick={() => setSearch("")}
              className="text-orange-500 hover:text-orange-600 text-sm font-medium"
            >
              {t('clearSearch')}
            </button>
          </motion.div>
        )}

        {/* Recipes Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredRecipes?.map((r, index) => (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={r._id}
              className="group relative flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300"
            >
              {/* Like button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLike(r._id)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md transition-colors"
              >
                <Heart 
                  size={18} 
                  className={isLiked[r._id] ? "fill-rose-500 text-rose-500" : "text-white"}
                />
              </motion.button>

              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={r.imageUrl}
                  alt={r.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                  {r.title}
                </h2>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                  {r.description}
                </p>

                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedRecipe(r);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 flex justify-center items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    <Eye size={16} /> {t('view')}
                  </motion.button>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Link
                      to={`/recipes/${r._id}`}
                      className="flex justify-center items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-500 hover:text-white transition-colors w-full"
                    >
                      <Edit3 size={16} /> {t('edit')}
                    </Link>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(r._id)}
                    className="flex-none flex justify-center items-center p-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        <AnimatePresence mode="wait">
          {isModalOpen && selectedRecipe && (
            <motion.div
              variants={modalBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-md" />

              <motion.div
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20 dark:border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/30 via-pink-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90, backgroundColor: "#ef4444" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all duration-300"
                >
                  <X size={20} />
                </motion.button>

                {/* Fullscreen button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 left-4 z-20 p-2.5 bg-black/40 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all duration-300"
                >
                  <Maximize2 size={18} />
                </motion.button>

                {/* Image section */}
                <motion.div 
                  variants={modalImageVariants}
                  className="relative h-96 w-full shrink-0 overflow-hidden"
                >
                  <motion.img
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={selectedRecipe.imageUrl}
                    className="w-full h-full object-cover"
                    alt={selectedRecipe.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 via-30% to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex gap-2 mb-3"
                    >
                      <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <Flame size={12} /> {t('popular')}
                      </span>
                      <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <Star size={12} /> 4.8 ★
                      </span>
                    </motion.div>
                    <motion.h2
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl font-black text-white leading-tight drop-shadow-2xl"
                    >
                      {selectedRecipe.title}
                    </motion.h2>
                  </div>
                </motion.div>

                {/* Content section */}
                <div className="p-6 md:p-8 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  <motion.p
                    variants={modalContentItemVariants}
                    className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 italic"
                  >
                    {selectedRecipe.description}
                  </motion.p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Ingredients */}
                    <motion.div
                      variants={modalContentItemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="group/ing relative bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-500/10 dark:to-orange-500/5 border border-orange-200 dark:border-orange-500/20 p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl group-hover/ing:scale-150 transition-transform duration-500" />
                      <h3 className="font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2 text-lg">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="p-1.5 bg-orange-100 dark:bg-orange-500/20 rounded-lg"
                        >
                          <List size={20} />
                        </motion.div>
                        {t('ingredients')}
                      </h3>
                      <div className="space-y-2.5">
                        {getIngredientsArray(selectedRecipe.ingredients).map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + idx * 0.03 }}
                            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm group/item"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 90 }}
                              className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"
                            >
                              <CheckCircle size={12} className="text-green-500" />
                            </motion.div>
                            <span className="group-hover/item:text-orange-500 transition-colors">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-orange-200 dark:border-orange-500/20">
                        <p className="text-xs text-orange-500 dark:text-orange-400 flex items-center gap-1">
                          <Timer size={12} /> {t('prepTime')}
                        </p>
                      </div>
                    </motion.div>

                    {/* Instructions */}
                    <motion.div
                      variants={modalContentItemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="group/ins relative bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-500/10 dark:to-blue-500/5 border border-blue-200 dark:border-blue-500/20 p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover/ins:scale-150 transition-transform duration-500" />
                      <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2 text-lg">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg"
                        >
                          <FileText size={20} />
                        </motion.div>
                        {t('instructions')}
                      </h3>
                      <div className="space-y-4">
                        {getInstructionsArray(selectedRecipe.instructions).map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + idx * 0.04 }}
                            className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm"
                          >
                            <motion.span
                              whileHover={{ scale: 1.3 }}
                              className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-md"
                            >
                              {idx + 1}
                            </motion.span>
                            <span className="leading-relaxed">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
                    >
                      <Bookmark size={18} /> {t('saveRecipe')}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-orange-500 hover:to-rose-500 hover:text-white transition-all duration-300 border border-gray-300 dark:border-gray-600"
                    >
                      <Share2 size={18} /> {t('share')}
                    </motion.button>
                    <motion.a
                      href={`/recipes/${selectedRecipe._id}`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3.5 bg-transparent border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all duration-300"
                    >
                      <ExternalLink size={18} /> {t('fullView')}
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}