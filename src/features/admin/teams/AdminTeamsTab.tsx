import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { Plus } from 'lucide-react';
import { useTeamForm } from './hooks/useTeamForm';
import { TeamDialog, TeamEmptyState, TeamTable, TeamTableSkeleton } from './components';
import { api, Doc, Id } from '@convex';

const AdminTeamsTab = () => {
  const teams = useQuery(api.teams.listForAdmin);
  const createTeam = useMutation(api.teams.create);
  const updateTeam = useMutation(api.teams.update);
  const deleteTeam = useMutation(api.teams.remove);

  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    form,
    editingTeamId,
    resetForm,
    setFormFromTeam,
    updateFormField,
    updateName,
    getFormDataForSubmit,
  } = useTeamForm();

  const isLoading = teams === undefined;

  const handleCreateTeam = useCallback(async (): Promise<void> => {
    const formData = getFormDataForSubmit();

    if (!formData.name) {
      toast.error(null, 'Bitte einen Team-Namen eingeben', 'Fehler');
      return;
    }
    if (!formData.slug) {
      toast.error(
        null,
        'Bitte eine gültige Kurzform eingeben (z.B. aus dem Namen abgeleitet)',
        'Fehler beim Erstellen des Teams'
      );
      return;
    }

    try {
      await createTeam(formData);
      setDialogOpen(false);
      resetForm();
      toast.success('Team erstellt');
    } catch (error) {
      toast.error(error, 'Fehler beim Erstellen des Teams');
    }
  }, [createTeam, getFormDataForSubmit, resetForm]);

  const handleUpdateTeam = useCallback(async (): Promise<void> => {
    if (!editingTeamId) return;

    const formData = getFormDataForSubmit();

    if (!formData.name) {
      toast.error(null, 'Bitte einen Team-Namen eingeben', 'Fehler');
      return;
    }
    if (!formData.slug) {
      toast.error(
        null,
        'Bitte eine gültige Kurzform eingeben',
        'Fehler beim Aktualisieren des Teams'
      );
      return;
    }

    try {
      await updateTeam({
        active: formData.active,
        id: editingTeamId,
        name: formData.name,
        slug: formData.slug,
      });
      setDialogOpen(false);
      resetForm();
      toast.success('Team aktualisiert');
    } catch (error) {
      toast.error(error, 'Fehler beim Aktualisieren');
    }
  }, [editingTeamId, getFormDataForSubmit, resetForm, updateTeam]);

  const handleDeleteTeam = useCallback(
    async (id: Id<'teams'>): Promise<void> => {
      if (!confirm('Team wirklich löschen?')) return;
      try {
        await deleteTeam({ id });
        setDialogOpen(false);
        resetForm();
        toast.success('Team gelöscht');
      } catch (error) {
        toast.error(error, 'Fehler beim Löschen');
      }
    },
    [deleteTeam, resetForm]
  );

  const openEditDialog = useCallback(
    (team: Doc<'teams'>): void => {
      setFormFromTeam(team);
      setDialogOpen(true);
    },
    [setFormFromTeam]
  );

  const openCreateDialog = useCallback((): void => {
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const handleCloseDialog = useCallback((): void => {
    setDialogOpen(false);
    resetForm();
  }, [resetForm]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (editingTeamId) {
      await handleUpdateTeam();
    } else {
      await handleCreateTeam();
    }
  }, [editingTeamId, handleCreateTeam, handleUpdateTeam]);

  const handleDeleteClick = useCallback((): void => {
    if (editingTeamId) {
      handleDeleteTeam(editingTeamId);
    }
  }, [editingTeamId, handleDeleteTeam]);

  const teamSlug = editingTeamId ? teams?.find((tm) => tm._id === editingTeamId)?.slug : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Teams verwalten</h2>
        <Button className="min-h-[44px] font-semibold gap-2" onClick={openCreateDialog}>
          <Plus className="h-5 w-5" />
          Team erstellen
        </Button>
      </div>

      {isLoading ? (
        <TeamTableSkeleton />
      ) : teams && teams.length > 0 ? (
        <TeamTable onEdit={openEditDialog} teams={teams} />
      ) : (
        <TeamEmptyState onCreateClick={openCreateDialog} />
      )}

      <TeamDialog
        editingTeamId={editingTeamId}
        form={form}
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onDelete={handleDeleteClick}
        onFormChange={updateFormField}
        onNameChange={updateName}
        onSubmit={handleSubmit}
        teamSlug={teamSlug}
      />
    </div>
  );
};

export default AdminTeamsTab;
