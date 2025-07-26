import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import AllPosts from "./pages/AllPosts";
import PostDetail from "./pages/PostDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { Loader } from "./components/Loader";

function AppRouter() {
  const { isAdmin, loading } = useAuth();


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/allposts" element={<AllPosts />} />
      <Route path="/posts/:postId" element={<PostDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          loading ? (
            <Loader />
          ) : isAdmin ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
