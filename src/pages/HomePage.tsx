import { useQuery } from 'convex/react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@convex';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { HelpCircle, ShoppingCart } from 'lucide-react';

const HomePage = () => {
  const teams = useQuery(api.teams.list);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-linear-to-br from-background via-background to-muted/30 w-full">
      <div className="w-full">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-primary/10">
              <ShoppingCart className="h-14 w-14 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Regau Cash App</h1>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Team auswählen</p>
          <Button variant="link" className="text-muted-foreground" asChild>
            <Link to="/help">
              <HelpCircle className="mr-2 h-4 w-4" />
              So funktioniert's
            </Link>
          </Button>
        </div>

        {teams === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="min-h-[160px]">
                <CardHeader className="pb-4 space-y-2">
                  <Skeleton className="h-8 w-2/3" />
                </CardHeader>
                <CardContent className="pt-2">
                  <Skeleton className="h-11 w-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl">Keine Teams gefunden</CardTitle>
              <CardDescription className="text-base">
                Bitte erstellen Sie zuerst ein Team im Admin-Bereich.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                className="w-full min-h-[44px]"
                onClick={() => navigate('/admin/login')}
              >
                Admin-Bereich
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card
                key={team._id}
                className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 min-h-[160px] group"
                onClick={() => navigate(`/team/${team.slug}`)}
              >
                <CardHeader className="pb-4 space-y-2">
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <Button
                    className="w-full min-h-[44px] font-semibold"
                    onClick={() => navigate(`/team/${team.slug}`)}
                  >
                    Auswählen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">Administration</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="min-h-[44px] px-8"
            onClick={() => navigate('/admin/login')}
          >
            Admin-Bereich
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
