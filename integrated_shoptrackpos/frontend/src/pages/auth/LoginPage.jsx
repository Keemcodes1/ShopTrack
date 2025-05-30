
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/lib/icons';
import { useToast } from '@/components/ui/use-toast';
import { apiClient, setAuthTokens } from '@/lib/api'; // Import apiClient and setAuthTokens

const LoginPage = () => {
  const [email, setEmail] = useState(''); // Changed from username to email based on backend expectation
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the backend API to get JWT tokens
      const response = await apiClient('/token/', {
        method: 'POST',
        body: JSON.stringify({ username: email, password }), // Assuming backend uses 'username' field for login
      });

      // Store tokens
      setAuthTokens(response.access, response.refresh);

      toast({
        title: "Login Successful!",
        description: "Welcome back to ShopTrackPOS.",
        variant: "default",
      });
      navigate('/'); // Redirect to dashboard

    } catch (error) {
      console.error("Login failed:", error);
      let description = "An unexpected error occurred. Please try again.";
      if (error.status === 401) {
        description = error.data?.detail || "Invalid credentials. Please check your email and password.";
      } else if (error.data?.detail) {
        description = error.data.detail;
      }

      toast({
        title: "Login Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Card className="w-full max-w-md shadow-2xl glass-card">
          <CardHeader className="text-center">
            <Icons.logo className="mx-auto h-12 w-12 mb-4" />
            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Welcome Back!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to access your ShopTrackPOS dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                {/* Changed label and placeholder to reflect email/username usage */}
                <Label htmlFor="email">Username or Email</Label>
                <Input
                  id="email"
                  type="text" // Changed type to text to allow username
                  placeholder="your_username or you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background/70"
                />
              </div>
              <Button type="submit" className="w-full font-semibold text-lg py-3" disabled={isLoading}>
                {isLoading ? (
                  <Icons.settings className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Icons.login className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Sign up here
              </Link>
            </p>
            <div className="text-xs text-muted-foreground/70">
              &copy; {new Date().getFullYear()} ShopTrackPOS. All rights reserved.
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;

