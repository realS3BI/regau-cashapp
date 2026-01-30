import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getAdminAuth, setAdminAuth } from '@/lib/auth';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const verifyPassword = useMutation(api.auth.verifyPassword);

  useEffect(() => {
    if (getAdminAuth()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = await verifyPassword({ password });
      if (isValid) {
        setAdminAuth();
        navigate('/admin');
        toast.success('Erfolgreich', {
          description: 'Erfolgreich angemeldet',
        });
      } else {
        toast.error('Fehler', {
          description: 'Falsches Passwort',
        });
      }
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/30">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex items-center justify-center">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Lock className="h-14 w-14 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">Admin-Bereich</CardTitle>
            <CardDescription className="text-base">Anmelden</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium">
                Passwort
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort eingeben"
                className="min-h-[48px] text-base"
                required
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full min-h-[48px] text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Lädt...' : 'Anmelden'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
