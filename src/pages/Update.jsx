import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

// Icons
const TitleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const DescIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const IngrIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const InstIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const UpdateRecipe = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipes/${id}`);
        const data = res.data;
        
        setTitle(data.title || "");
        setDescription(data.description || "");
        setIngredients(Array.isArray(data.ingredients) ? data.ingredients.join(", ") : (data.ingredients || ""));
        setInstructions(data.instructions || "");
        setImageUrl(data.imageUrl || "");
      } catch (err) {
        console.error("Xatolik:", err);
        const isDark = document.documentElement.classList.contains("dark");
        Swal.fire({
          icon: "error",
          title: t('error'),
          text: t('errorLoadingRecipe'),
          background: isDark ? "#1e293b" : "#ffffff",
          color: isDark ? "#ffffff" : "#000000",
        });
        navigate("/recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate, t]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const ingredientsArray = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(i => i !== "");

    const updatedRecipe = {
      title,
      description,
      ingredients: ingredientsArray,
      instructions,
      imageUrl,
    };

    try {
      await api.put(`/recipes/${id}`, updatedRecipe);
      const isDark = document.documentElement.classList.contains("dark");
      Swal.fire({
        icon: "success",
        title: t('success'),
        text: t('recipeUpdatedSuccess'),
        showConfirmButton: false,
        timer: 1500,
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
      });
      setTimeout(() => {
        navigate("/recipes");
      }, 1500);
    } catch (err) {
      console.error("Xatolik:", err);
      const isDark = document.documentElement.classList.contains("dark");
      Swal.fire({
        icon: "error",
        title: t('error'),
        text: err.response?.data?.message || t('errorUpdatingRecipe'),
        background: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300";
  const labelClasses = "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";
  const groupClasses = "group flex flex-col mb-4";

  const formVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", damping: 20, stiffness: 300, duration: 0.6 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
          />
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-500 dark:text-gray-400 font-medium"
          >
            {t('loadingRecipe')}
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl shadow-lg shadow-orange-500/30 mb-4"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500 bg-clip-text text-transparent"
          >
            {t('editRecipe')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-gray-500 dark:text-gray-400"
          >
            {t('editRecipeSubtitle')}
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleUpdate}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50"
        >
          {/* Image Preview */}
          {imageUrl && (
            <motion.div variants={itemVariants} className="mb-6 relative group">
              <div className="relative rounded-2xl overflow-hidden h-48 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <img
                  src={imageUrl}
                  alt={title || t('recipePreview')}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs">
                  {t('imagePreview')}
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-y-6">
            {/* Title */}
            <motion.div variants={itemVariants} className={groupClasses}>
              <label className={labelClasses}>
                <span className="text-orange-500"><TitleIcon /></span>
                <span>{t('title')}</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClasses}
                type="text"
                required
                placeholder={t('titlePlaceholder')}
              />
            </motion.div>

            {/* Image URL */}
            <motion.div variants={itemVariants} className={groupClasses}>
              <label className={labelClasses}>
                <span className="text-blue-500"><LinkIcon /></span>
                <span>{t('imageUrl')}</span>
              </label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={inputClasses}
                type="text"
                placeholder={t('imageUrlPlaceholder')}
              />
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className={groupClasses}>
              <label className={labelClasses}>
                <span className="text-purple-500"><DescIcon /></span>
                <span>{t('description')}</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClasses} resize-none h-24`}
                placeholder={t('descriptionPlaceholder')}
              />
            </motion.div>

            {/* Ingredients */}
            <motion.div variants={itemVariants} className={groupClasses}>
              <label className={labelClasses}>
                <span className="text-green-500"><IngrIcon /></span>
                <span>{t('ingredientsComma')}</span>
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className={`${inputClasses} resize-none h-28`}
                placeholder={t('ingredientsPlaceholder')}
              />
              <p className="text-xs text-gray-400 mt-1">
                {t('ingredientsHint')}
              </p>
            </motion.div>

            {/* Instructions */}
            <motion.div variants={itemVariants} className={groupClasses}>
              <label className={labelClasses}>
                <span className="text-red-500"><InstIcon /></span>
                <span>{t('instructions')}</span>
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className={`${inputClasses} resize-none h-48`}
                placeholder={t('instructionsPlaceholder')}
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/recipes")}
              className="px-8 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              {t('cancel')}
            </motion.button>

            <motion.button
              type="submit"
              disabled={isSaving}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 justify-center ${
                isSaving ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl hover:shadow-orange-500/40"
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('saving')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('save')}
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Decorative elements */}
        <div className="fixed top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      </motion.div>
    </div>
  );
};

export default UpdateRecipe;