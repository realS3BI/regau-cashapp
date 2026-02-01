import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';

type TeamPageHeaderProps = {
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  teamName: string;
};

const TeamPageHeader = ({ isAdminLoggedIn, onLogout, teamName }: TeamPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 shrink-0 border-b bg-background/95 shadow-sm w-full backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="grid w-full grid-cols-3 items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-start">
          <Button
            className="min-h-[44px] gap-2"
            onClick={() => navigate('/')}
            size="sm"
            variant="outline"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Zurück</span>
          </Button>
        </div>
        <h1 className="text-center text-2xl font-bold tracking-tight">{teamName}</h1>
        <div className="flex justify-end">
          {isAdminLoggedIn && (
            <Button className="min-h-[44px] gap-2" onClick={onLogout} size="sm" variant="outline">
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline">Abmelden</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TeamPageHeader;
