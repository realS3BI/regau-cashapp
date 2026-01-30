import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, LayoutGrid, ShoppingCart, Users } from 'lucide-react';

const STEPS = [
  {
    icon: Users,
    subtitle: 'Auf der Startseite dein Team wählen. Jedes Team hat eigene Kategorien und Produkte.',
    title: 'Team auswählen',
  },
  {
    icon: LayoutGrid,
    subtitle:
      'Links die Kategorien, auf ein Produkt tippen – es wird direkt in den Warenkorb gelegt.',
    title: 'Produkte durchstöbern',
  },
  {
    icon: ShoppingCart,
    subtitle: 'Rechts deinen Warenkorb sehen, Menge ändern oder Artikel entfernen.',
    title: 'Warenkorb anpassen',
  },
  {
    icon: CreditCard,
    subtitle: 'Mit „Bezahlen" den Einkauf abschließen. Der Kauf wird gespeichert.',
    title: 'Bezahlen',
  },
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/30 w-full">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-8 -ml-2" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Link>
        </Button>

        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">So funktioniert Regau Cash App</h1>
            <p className="text-muted-foreground text-lg">
              Eine einfache App für Teams: Produkte auswählen, in den Warenkorb legen und bezahlen.
            </p>
          </div>

          {/* Stepper */}
          <div className="relative">
            {/* Connecting line (centered with circles) */}
            <div className="absolute left-0 right-0 top-6 h-px bg-border" aria-hidden />
            <div className="relative grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === 0;
                return (
                  <div key={step.title} className="flex flex-col items-center text-center">
                    <div
                      className={`
                        flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 z-10
                        ${
                          isActive
                            ? 'border-primary bg-background text-primary'
                            : 'border-muted-foreground/30 bg-muted/50 text-muted-foreground'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3
                      className={`
                        mt-3 text-sm font-semibold
                        ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                      `}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-snug max-w-[180px]">
                      {step.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
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
