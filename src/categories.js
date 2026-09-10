// Display metadata for game categories (the backend just stores the category id string).
export const CATEGORIES = [
  { id: 'br', label: 'Battle Royale', color: 'red' },
  { id: 'fps', label: 'Shooter', color: 'crimson' },
  { id: 'sports', label: 'Sports', color: 'clay' },
  { id: 'moba', label: 'Strategy', color: 'maroon' },
  { id: 'racing', label: 'Racing', color: 'rust' },
];

export function categoryColor(id) {
  return CATEGORIES.find((c) => c.id === id)?.color || 'red';
}
export function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}
