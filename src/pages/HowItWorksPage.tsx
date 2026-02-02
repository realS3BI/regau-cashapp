import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard, History, LayoutGrid, ShoppingCart, Users } from 'lucide-react';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-linear-to-br from-background via-background to-muted/30 w-full">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-8 -ml-2" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Link>
        </Button>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">So funktioniert Regau Cash App</h1>
            <p className="text-muted-foreground text-lg">
              Eine einfache App für Teams: Produkte auswählen, in den Warenkorb legen und bezahlen.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Team auswählen</CardTitle>
                  <CardDescription>
                    Auf der Startseite wählst du dein Team. Danach siehst du die gemeinsamen
                    Kategorien und Produkte für dieses Team.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <LayoutGrid className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Kategorien durchsuchen</CardTitle>
                  <CardDescription>
                    Links die Kategorien (am Handy oben). So findest du schnell die gewünschten
                    Produkte – z.B. Getränke, Snacks oder andere Bereiche.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Zum Warenkorb hinzufügen</CardTitle>
                  <CardDescription>
                    Ein Tipp auf ein Produkt legt es in den Warenkorb. Am Desktop siehst du den
                    Warenkorb rechts, am Handy unten. Dort kannst du die Menge anpassen oder
                    Artikel wieder entfernen.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Bezahlen</CardTitle>
                  <CardDescription>
                    Mit „Bezahlen“ schließt du den Einkauf ab. Der Kauf wird gespeichert und erscheint
                    in der Übersicht.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Übersicht</CardTitle>
                  <CardDescription>
                    Unter „Übersicht“ siehst du die letzten Buchungen und Verkäufe. Einzelne
                    Einträge können dort bei Bedarf gelöscht werden.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link to="/">Zur Startseite</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
