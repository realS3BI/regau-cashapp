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
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 shadow-sm w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
        <Button
          className="min-h-[44px] min-w-[44px]"
          onClick={() => navigate('/')}
          size="icon"
          variant="ghost"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight flex-1">{teamName}</h1>
        {isAdminLoggedIn && (
          <Button className="min-h-[44px] gap-2" onClick={onLogout} size="sm" variant="outline">
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline">Abmelden</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default TeamPageHeader;
