import { Id } from '@convex';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import type { TeamFormData } from '../types';
import { generateSlug } from '../utils';

interface TeamDialogProps {
  editingTeamId: Id<'teams'> | null;
  form: TeamFormData;
  isOpen: boolean;
  teamSlug: string | undefined;
  onClose: () => void;
  onDelete: () => void;
  onFormChange: <K extends keyof TeamFormData>(field: K, value: TeamFormData[K]) => void;
  onNameChange: (name: string) => void;
  onSubmit: () => Promise<void>;
}

export const TeamDialog = ({
  editingTeamId,
  form,
  isOpen,
  onClose,
  onDelete,
  onFormChange,
  onNameChange,
  onSubmit,
  teamSlug,
}: TeamDialogProps) => {
  const handleOpenTeam = (): void => {
    if (teamSlug) {
      window.open(`/team/${teamSlug}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">
            {editingTeamId ? 'Team bearbeiten' : 'Team erstellen'}
          </DialogTitle>
          <CardDescription className="text-base leading-relaxed">
            Die Kurzform ist eine einfachere, kurze Bezeichnung deines Teams.
          </CardDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold" htmlFor="team-name">
              Name
            </Label>
            <Input
              id="team-name"
              className="min-h-[48px]"
              placeholder="z.B. Regau"
              value={form.name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold" htmlFor="team-slug">
              Kurzform (URL)
            </Label>
            <Input
              id="team-slug"
              className="min-h-[48px] font-mono"
              placeholder="z.B. regau"
              value={form.slug}
              onChange={(e) => onFormChange('slug', e.target.value)}
            />
            {!form.slug && form.name.trim() && (
              <p className="text-muted-foreground text-sm">
                Vorschlag:{' '}
                <button
                  className="font-mono text-primary hover:underline"
                  type="button"
                  onClick={() => onFormChange('slug', generateSlug(form.name))}
                >
                  {generateSlug(form.name)}
                </button>
                {' — Klick zum Übernehmen'}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="team-active"
              className="h-5 w-5"
              checked={form.active}
              onCheckedChange={(checked: boolean | 'indeterminate') =>
                onFormChange('active', checked === true)
              }
            />
            <Label className="cursor-pointer font-semibold" htmlFor="team-active">
              Sichtbar
            </Label>
          </div>
        </div>
        <DialogFooter className="flex flex-wrap gap-2">
          {editingTeamId && (
            <>
              <Button
                className="min-h-[44px] font-semibold mr-auto"
                variant="outline"
                onClick={handleOpenTeam}
              >
                Öffnen
              </Button>
              <Button
                className="min-h-[44px] font-semibold text-destructive hover:text-destructive"
                variant="outline"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </Button>
            </>
          )}
          <Button className="min-h-[44px] font-semibold" variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button className="min-h-[44px] font-semibold" onClick={onSubmit}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
