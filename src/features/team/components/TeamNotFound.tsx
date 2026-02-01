import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TeamNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="text-center">
        <p className="text-lg mb-4">Team nicht gefunden</p>
        <Button onClick={() => navigate('/')}>Zurück zur Startseite</Button>
      </div>
    </div>
  );
};

export default TeamNotFound;
