import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../utils/axios";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Image as ImageIcon, Type, AlignLeft, 
  ChefHat, PlusCircle, Loader2, AlertCircle, Upload, FileText
} from "lucide-react";
import Swal from "sweetalert2";

export default function CreateRecipe() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // ✅ Description state qaytarildi
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const isDark = document.documentElement.classList.contains("dark");

    try {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description); // ✅ FormData-ga qo'shildi
      formData.append("instructions", instructions);
      
      ingredients.forEach((ing, index) => {
        formData.append(`ingredients[${index}]`, ing);
      });

      if (imageFile) {
        formData.append("image", imageFile); 
      }

      await instance.post("/recipes", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: t('success', 'Muvaffaqiyatli!'),
        text: t('recipeCreated', 'Retsept yaratildi'),
        timer: 2000,
        showConfirmButton: false,
        background: isDark ? '#1e293b' : '#fff',
        color: isDark ? '#fff' : '#000'
      });
      
      navigate("/recipes");
    } catch (err) {
      setError(err.response?.data?.message || t("somethingWentWrong"));
      Swal.fire({
        icon: 'error',
        title: 'Xatolik',
        text: err.response?.data?.message || "Xatolik yuz berdi",
        background: isDark ? '#1e293b' : '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:ml-[256px] p-6 md:p-10 transition-colors duration-500">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-2xl shadow-xl">
            <Plus size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{t("createRecipe")}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Yangi lazzatli retsept va tavsif qo'shing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-gray-700 shadow-xl">
              
              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                  <Type size={18} className="text-orange-500" /> {t("title")}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 outline-none transition-all dark:text-white font-medium"
                  placeholder="Taom nomi..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description ✅ QAYTARILDI */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                  <FileText size={18} className="text-orange-500" /> {t("description")}
                </label>
                <textarea
                  rows="2"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 outline-none transition-all dark:text-white font-medium resize-none"
                  placeholder="Kichik tavsif yozing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                  <ImageIcon size={18} className="text-orange-500" /> {t("image")}
                </label>
                <div className="relative group h-32 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 hover:border-orange-500 transition-all">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-gray-400 group-hover:text-orange-500 mb-1" size={24} />
                      <p className="text-[10px] text-gray-500">Rasm yuklang</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Right Column: Ingredients */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-gray-700 shadow-xl flex flex-col">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 mb-4">
                <ChefHat size={18} className="text-orange-500" /> {t("ingredients")}
              </label>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {ingredients.map((ing, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-orange-500 dark:text-white text-sm"
                      placeholder={`Masalliq ${index + 1}`}
                      value={ing}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      required
                    />
                    {ingredients.length > 1 && (
                      <button type="button" onClick={() => removeIngredient(index)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addIngredient}
                className="mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-orange-200 dark:border-orange-500/30 text-orange-500 rounded-xl hover:bg-orange-50 transition-all font-bold text-sm"
              >
                <PlusCircle size={18} /> {t("addIngredient")}
              </button>
            </div>
          </div>

          {/* Instructions Full Width */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-gray-700 shadow-xl">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 mb-4">
              <AlignLeft size={18} className="text-orange-500" /> {t("instructions")}
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 outline-none transition-all dark:text-white font-medium"
              placeholder="Tayyorlash bosqichlari..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-orange-500/40 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <>{t("createRecipe")}</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}