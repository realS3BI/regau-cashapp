import { useState, useCallback } from 'react';
import { Doc, Id } from '@convex';
import { generateSlug } from '../utils';
import { createEmptyTeamForm, type TeamFormData } from '../types';

export const useTeamForm = () => {
  const [form, setForm] = useState<TeamFormData>(createEmptyTeamForm());
  const [editingTeamId, setEditingTeamId] = useState<Id<'teams'> | null>(null);

  const resetForm = useCallback((): void => {
    setForm(createEmptyTeamForm());
    setEditingTeamId(null);
  }, []);

  const setFormFromTeam = useCallback((team: Doc<'teams'>): void => {
    setEditingTeamId(team._id);
    setForm({
      active: team.active !== false,
      name: team.name,
      slug: team.slug,
    });
  }, []);

  const updateFormField = useCallback(
    <K extends keyof TeamFormData>(field: K, value: TeamFormData[K]): void => {
      setForm((previousForm) => ({ ...previousForm, [field]: value }));
    },
    []
  );

  const updateNameWithAutoSlug = useCallback((name: string): void => {
    setForm((previousForm) => ({
      ...previousForm,
      name,
      slug: previousForm.slug || generateSlug(name),
    }));
  }, []);

  const getFormDataForSubmit = useCallback((): {
    active: boolean;
    name: string;
    slug: string;
  } => {
    return {
      active: form.active,
      name: form.name.trim(),
      slug: form.slug.trim() || generateSlug(form.name),
    };
  }, [form]);

  return {
    editingTeamId,
    form,
    getFormDataForSubmit,
    resetForm,
    setFormFromTeam,
    updateFormField,
    updateNameWithAutoSlug,
  };
};
