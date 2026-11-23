export const storageKey = "haskell-lab.progress.v1";

export function loadProgress(storage, exercises) {
  const empty = { index: 0, solvedIds: new Set() };
  const raw = storage.getItem(storageKey);
  if (!raw) return empty;

  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return empty;
  }
  if (!saved || saved.version !== 1) return empty;

  const ids = new Set(exercises.map(exercise => exercise.id));
  const solvedIds = new Set(
    Array.isArray(saved.solved) ? saved.solved.filter(id => ids.has(id)) : []
  );
  // Prefer stable IDs after reordering. Older saves only have a numeric index.
  const selectedIndex = exercises.findIndex(exercise => exercise.id === saved.exerciseId);
  if (selectedIndex >= 0) return { index: selectedIndex, solvedIds };
  const validIndex = Number.isInteger(saved.index) && saved.index >= 0 && saved.index < exercises.length;
  return { index: validIndex ? saved.index : 0, solvedIds };
}

export function saveProgress(storage, exercises, index, solvedIds) {
  storage.setItem(storageKey, JSON.stringify({
    version: 1,
    index,
    exerciseId: exercises[index].id,
    solved: [...solvedIds]
  }));
}
