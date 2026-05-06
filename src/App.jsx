import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Recipes from "./pages/Recipes";
import Settings from "./pages/Settings";
import Layout from "./layout/Layout";
import CreateRecipe from "./pages/CreateRecipe";
import ViewReport from "./pages/ViewReports";
import Statistics from "./pages/Statistics";
import { Toaster } from "react-hot-toast";
import UpdateRecipe from "./pages/Update";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/reports" element={<ViewReport />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/recipes/:id" element={<UpdateRecipe />} />
        </Route>
      </Routes>
    </>
  );
}

