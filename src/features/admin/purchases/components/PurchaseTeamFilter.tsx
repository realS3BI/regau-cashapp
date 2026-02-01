import { Doc } from '@convex';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PurchaseTeamFilterProps {
  filterTeamId: string;
  onTeamChange: (teamId: string) => void;
  teams: Doc<'teams'>[] | undefined;
}

export const PurchaseTeamFilter = ({
  filterTeamId,
  onTeamChange,
  teams,
}: PurchaseTeamFilterProps) => {
  return (
    <div className="space-y-2 flex-1 min-w-[180px]">
      <Label className="text-sm font-semibold">Team</Label>
      <Select
        value={filterTeamId || '__all__'}
        onValueChange={(v) => onTeamChange(v === '__all__' ? '' : v)}
      >
        <SelectTrigger className="min-h-[44px] w-full">
          <SelectValue placeholder="Alle Teams" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Alle Teams</SelectItem>
          {teams
            ?.filter((team) => !team.deletedAt)
            .map((team) => (
              <SelectItem key={team._id} value={team._id}>
                {team.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
