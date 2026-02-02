import { Doc } from '@convex';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TeamRow } from './TeamRow';

interface TeamTableProps {
  onEdit: (team: Doc<'teams'>) => void;
  teams: Doc<'teams'>[];
}

export const TeamTable = ({ onEdit, teams }: TeamTableProps) => {
  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name, 'de'));

  return (
    <Card className="shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-14 font-bold">Name</TableHead>
            <TableHead className="h-14 font-bold">Kurzform</TableHead>
            <TableHead className="h-14 font-bold">Sichtbar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTeams.map((team) => (
            <TeamRow key={team._id} onEdit={() => onEdit(team)} team={team} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
