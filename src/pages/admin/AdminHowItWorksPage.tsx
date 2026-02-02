import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminAuth } from '@/lib/auth';
import { ArrowLeft, FolderTree, History, LayoutGrid, Receipt, Tags, Users } from 'lucide-react';

const AdminHowItWorksPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAdminAuth()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  if (!getAdminAuth()) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-linear-to-br from-background via-background to-muted/30 w-full">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-8 -ml-2" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Link>
        </Button>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">So funktioniert der Admin-Bereich</h1>
            <p className="text-muted-foreground text-lg">
              Hier verwaltest du die Übersicht, Teams, Kategorien, Produkte, Preisvorlagen und die
              Kaufhistorie.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Übersicht</CardTitle>
                  <CardDescription>
                    Heutiger Umsatz, Anzahl Verkäufe heute, verkaufte Artikel und Ø pro Verkauf –
                    alle Kennzahlen auf einen Blick.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Teams</CardTitle>
                  <CardDescription>
                    Teams erscheinen auf der Startseite. Jedes Team hat einen Namen und eine
                    Kurzform (URL-Teil, z.B. „mein-team“ → /team/mein-team). Du kannst Teams
                    anlegen, bearbeiten und deaktivieren.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FolderTree className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Kategorieverwaltung</CardTitle>
                  <CardDescription>
                    Kategorien gruppieren die Produkte für alle Teams. Du legst die Reihenfolge
                    fest. Ohne Kategorien können Nutzer keine Produkte nach Bereichen filtern.
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
                  <CardTitle>Produktverwaltung</CardTitle>
                  <CardDescription>
                    Produkte haben Name, Beschreibung, eine Kategorie und zwei Preise (Vorlage A und
                    B). Sie erscheinen in der Team-Ansicht und können aktiv/deaktiviert werden. Der
                    verwendete Preis wird bei jedem Kauf in der Kaufhistorie festgehalten.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Tags className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Preisvorlagen</CardTitle>
                  <CardDescription>
                    Du benennst zwei Vorlagen (z.B. „Bar“ und „Karte“) und wählst eine aktive
                    Vorlage. In der Team-Ansicht sehen Nutzer nur die Preise der aktiven Vorlage.
                    Die Vorlagen-Namen kannst du jederzeit anpassen.
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
                  <CardTitle>Kaufhistorie</CardTitle>
                  <CardDescription>
                    Alle abgeschlossenen Käufe werden hier angezeigt. Du kannst nach Datum, Team und
                    Artikel filtern. Jeder Eintrag zeigt Team, Artikel, Anzahl, Einzelpreis und
                    Gesamtbetrag.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link to="/admin">Zur Übersicht</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHowItWorksPage;
