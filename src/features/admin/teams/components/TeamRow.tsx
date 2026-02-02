import { Doc } from '@convex';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';

interface TeamRowProps {
  onEdit: () => void;
  team: Doc<'teams'>;
}

export const TeamRow = ({ onEdit, team }: TeamRowProps) => {
  return (
    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={onEdit}>
      <TableCell className="font-semibold py-4">{team.name}</TableCell>
      <TableCell className="text-muted-foreground py-4 font-mono text-sm">{team.slug}</TableCell>
      <TableCell className="py-4">
        <Badge variant={team.active !== false ? 'default' : 'secondary'}>
          {team.active !== false ? 'Sichtbar' : 'Unsichtbar'}
        </Badge>
      </TableCell>
    </TableRow>
  );
};
