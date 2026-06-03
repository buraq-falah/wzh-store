'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { strapi } from '../../lib/strapi';   // استخدم المسار المطلق
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Strapi v5 auth endpoint expects { identifier, password }
      const response = await strapi.post('/auth/local', {
        identifier: email,
        password,
      });

      const { jwt, user } = response.data;

      if (!jwt) throw new Error('No token received');

      // تخزين التوكن
      localStorage.setItem('strapi_jwt', jwt);
      
      // اختياري: تخزين معلومات المستخدم (للعرض فقط)
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Welcome back, ${user.username || user.email}`);
      
      // تأخير بسيط قبل التوجيه لضمان حفظ التوكن
      setTimeout(() => {
        router.push('/admin');
      }, 100);
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      
      // رسالة خطأ مفهومة
      const errorMsg = error.response?.data?.error?.message || 'Invalid email or password';
      toast.error(errorMsg);
      
      // مسح أي توكن قديم
      localStorage.removeItem('strapi_jwt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">WZH Admin</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-white"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}