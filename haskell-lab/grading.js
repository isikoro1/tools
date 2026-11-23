// Preserve token boundaries: Just4 and Just 4 have different meanings.
// This is fixed-answer comparison. It never evaluates user code.
export function normalize(answer) {
  return (
    answer.trim().match(/\[|\]|\(|\)|,|->|[A-Za-z_][A-Za-z0-9_']*|-?\d+|[^\s]/g) || []
  ).join(" ");
}

export function matches(exercise, answer) {
  return exercise.answers.some(expected => normalize(expected) === normalize(answer));
}
