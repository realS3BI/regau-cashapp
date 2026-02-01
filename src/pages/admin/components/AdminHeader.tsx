import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            className="min-h-[44px] min-w-[44px]"
            onClick={() => navigate('/')}
            size="icon"
            variant="ghost"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Admin-Bereich</h1>
        </div>
        <Button className="min-h-[44px] font-semibold gap-2" onClick={onLogout} variant="outline">
          <LogOut className="h-5 w-5" />
          <span className="hidden sm:inline">Abmelden</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
