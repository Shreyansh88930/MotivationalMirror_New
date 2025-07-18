import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminLogin = () => {
  const { user, loading, signIn, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && isAdmin) {
      setLocation('/admin/dashboard');
    }
  }, [user, isAdmin, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-charcoal">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-blue dark:border-teal"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-sky-blue dark:bg-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold font-devanagari">
                Admin Login
              </CardTitle>
              <CardDescription>
                Sign in to access the admin dashboard and manage posts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user && !isAdmin && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    You are signed in but don't have admin privileges. Please contact an administrator.
                  </p>
                </div>
              )}

              <Button
                onClick={signIn}
                className="w-full bg-sky-blue dark:bg-teal hover:bg-sky-blue/90 dark:hover:bg-teal/90 text-white"
                disabled={loading}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Only authorized admins can access the dashboard</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLogin;
