export interface TeamFormData {
  active: boolean;
  name: string;
  slug: string;
}

export const createEmptyTeamForm = (): TeamFormData => ({
  active: true,
  name: '',
  slug: '',
});
