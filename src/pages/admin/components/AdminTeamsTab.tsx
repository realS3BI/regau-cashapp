import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const AdminTeamsTab = () => {
  const teams = useQuery(api.teams.listForAdmin);
  const createTeam = useMutation(api.teams.create);
  const updateTeam = useMutation(api.teams.update);
  const deleteTeam = useMutation(api.teams.remove);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Id<'teams'> | null>(null);
  const [form, setForm] = useState({ active: true, name: '', slug: '' });

  const handleCreateTeam = async () => {
    const name = form.name.trim();
    const slug = form.slug.trim() || generateSlug(name);

    if (!name) {
      toast.error('Fehler', {
        description: 'Bitte einen Team-Namen eingeben',
      });
      return;
    }
    if (!slug) {
      toast.error('Fehler', {
        description: 'Bitte einen gültigen Slug eingeben (z.B. aus dem Namen abgeleitet)',
      });
      return;
    }

    try {
      await createTeam({ name, slug });
      setDialogOpen(false);
      setEditingTeam(null);
      setForm({ active: true, name: '', slug: '' });
      toast.success('Erfolgreich', {
        description: 'Team erstellt',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Erstellen des Teams',
      });
    }
  };

  const handleUpdateTeam = async () => {
    if (!editingTeam) return;
    const name = form.name.trim();
    const slug = form.slug.trim() || generateSlug(form.name);

    if (!name) {
      toast.error('Fehler', {
        description: 'Bitte einen Team-Namen eingeben',
      });
      return;
    }
    if (!slug) {
      toast.error('Fehler', {
        description: 'Bitte einen gültigen Slug eingeben',
      });
      return;
    }
    try {
      await updateTeam({
        active: form.active,
        id: editingTeam,
        name,
        slug,
      });
      setDialogOpen(false);
      setEditingTeam(null);
      setForm({ active: true, name: '', slug: '' });
      toast.success('Erfolgreich', {
        description: 'Team aktualisiert',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Aktualisieren',
      });
    }
  };

  const handleDeleteTeam = async (id: Id<'teams'>) => {
    if (!confirm('Team wirklich löschen?')) return;
    try {
      await deleteTeam({ id });
      setDialogOpen(false);
      setEditingTeam(null);
      setForm({ active: true, name: '', slug: '' });
      toast.success('Erfolgreich', {
        description: 'Team gelöscht',
      });
    } catch (error) {
      toast.error('Fehler', {
        description: error instanceof Error ? error.message : 'Fehler beim Löschen',
      });
    }
  };

  const openEdit = (team: { _id: Id<'teams'>; active?: boolean; name: string; slug: string }) => {
    setEditingTeam(team._id);
    setForm({
      active: team.active !== false,
      name: team.name,
      slug: team.slug,
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingTeam(null);
    setForm({ active: true, name: '', slug: '' });
    setDialogOpen(true);
  };

  const isLoading = teams === undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Teams verwalten</h2>
        <Button className="min-h-[44px] font-semibold gap-2" onClick={openCreate}>
          <Plus className="h-5 w-5" />
          Team erstellen
        </Button>
      </div>

      {isLoading ? (
        <Card className="shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 font-bold">Name</TableHead>
                <TableHead className="h-14 font-bold">Slug</TableHead>
                <TableHead className="h-14 font-bold">Sichtbar</TableHead>
                <TableHead className="h-14 font-bold">Gelöscht</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-5 w-24 font-mono" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : teams && teams.length > 0 ? (
        <Card className="shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 font-bold">Name</TableHead>
                <TableHead className="h-14 font-bold">Slug</TableHead>
                <TableHead className="h-14 font-bold">Sichtbar</TableHead>
                <TableHead className="h-14 font-bold">Gelöscht</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...teams]
                .sort((a, b) => a.name.localeCompare(b.name, 'de'))
                .map((team) => (
                <TableRow
                  key={team._id}
                  className={`cursor-pointer hover:bg-muted/50 ${team.deletedAt != null ? 'opacity-60' : ''}`}
                  onClick={() => openEdit(team)}
                >
                  <TableCell className="font-semibold py-4">{team.name}</TableCell>
                  <TableCell className="text-muted-foreground py-4 font-mono text-sm">
                    {team.slug}
                  </TableCell>
                  <TableCell className="py-4">
                    {team.deletedAt == null ? (
                      <Badge variant={team.active !== false ? 'default' : 'secondary'}>
                        {team.active !== false ? 'Sichtbar' : 'Unsichtbar'}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    {team.deletedAt != null ? <Badge variant="destructive">Gelöscht</Badge> : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-2">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">Noch keine Teams vorhanden</p>
            <Button className="min-h-[44px] font-semibold gap-2" onClick={openCreate}>
              <Plus className="h-5 w-5" />
              Team erstellen
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingTeam(null);
            setForm({ active: true, name: '', slug: '' });
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader className="space-y-3 pb-4">
            <DialogTitle className="text-2xl font-bold">
              {editingTeam ? 'Team bearbeiten' : 'Team erstellen'}
            </DialogTitle>
            <CardDescription className="text-base leading-relaxed">
              Der Slug wird in der URL verwendet (z.B. /mein-team). Leer lassen für automatische
              Ableitung aus dem Namen.
            </CardDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold" htmlFor="team-name">
                Name
              </Label>
              <Input
                id="team-name"
                className="min-h-[48px]"
                placeholder="z.B. Regau"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name,
                    slug: prev.slug || generateSlug(name),
                  }));
                }}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold" htmlFor="team-slug">
                Slug (URL)
              </Label>
              <Input
                id="team-slug"
                className="min-h-[48px] font-mono"
                placeholder="z.B. regau"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="team-active"
                className="h-5 w-5"
                checked={form.active}
                onCheckedChange={(checked: boolean | 'indeterminate') =>
                  setForm((prev) => ({ ...prev, active: checked === true }))
                }
              />
              <Label className="cursor-pointer font-semibold" htmlFor="team-active">
                Sichtbar (auf Startseite und per Link erreichbar)
              </Label>
            </div>
          </div>
          <DialogFooter className="flex flex-wrap gap-2 pt-4">
            {editingTeam && (
              <>
                <Button
                  className="min-h-[44px] font-semibold mr-auto"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `/${teams?.find((tm) => tm._id === editingTeam)?.slug ?? ''}`,
                      '_blank'
                    )
                  }
                >
                  Öffnen
                </Button>
                <Button
                  className="min-h-[44px] font-semibold text-destructive hover:text-destructive"
                  variant="outline"
                  onClick={() => editingTeam && handleDeleteTeam(editingTeam)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Löschen
                </Button>
              </>
            )}
            <Button
              className="min-h-[44px] font-semibold"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setEditingTeam(null);
                setForm({ active: true, name: '', slug: '' });
              }}
            >
              Abbrechen
            </Button>
            <Button
              className="min-h-[44px] font-semibold"
              onClick={editingTeam ? handleUpdateTeam : handleCreateTeam}
            >
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTeamsTab;
