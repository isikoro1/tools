import test from "node:test";
import assert from "node:assert/strict";
import { topics } from "../data/topics.js";
import { exercises } from "../data/exercises.js";
import { matches } from "../grading.js";
import { loadProgress, saveProgress, storageKey } from "../storage.js";

function memoryStorage(initial = null) {
  let raw = initial;
  return {
    getItem: () => raw,
    setItem: (key, value) => {
      assert.equal(key, storageKey);
      raw = value;
    }
  };
}

test("content IDs are unique and all exercises belong to a known topic", () => {
  assert.equal(new Set(topics.map(topic => topic.id)).size, topics.length);
  assert.equal(new Set(exercises.map(exercise => exercise.id)).size, exercises.length);
  for (const exercise of exercises) {
    assert.ok(topics.some(topic => topic.id === exercise.topic), exercise.id);
    assert.ok(exercise.answers.length > 0);
    for (const answer of exercise.answers) assert.ok(matches(exercise, answer), exercise.id);
    assert.ok(!matches(exercise, ""), exercise.id);
  }
});

test("answer normalization allows whitespace while preserving token boundaries and case", () => {
  const find = id => exercises.find(exercise => exercise.id === id);
  assert.ok(matches(find("map"), "[ 2, 4, 6 ]"));
  assert.ok(matches(find("signature"), "Int->Int"));
  assert.ok(!matches(find("fmap"), "Just4"));
  assert.ok(!matches(find("bool"), "bool"));
  assert.ok(!matches(find("map"), "[2 4 6]"));
  assert.ok(!matches(find("call"), "7; alert(1)"));
});

test("old single-file saves restore and discard removed or duplicate IDs", () => {
  const storage = memoryStorage(JSON.stringify({
    version: 1, index: 4, solved: ["call", "call", "deleted"]
  }));
  const result = loadProgress(storage, exercises);
  assert.equal(result.index, 4);
  assert.deepEqual([...result.solvedIds], ["call"]);
});

test("progress round-trips and survives exercise reordering", () => {
  const storage = memoryStorage();
  saveProgress(storage, exercises, 3, new Set(["call", "signature"]));
  const reordered = [...exercises].reverse();
  const result = loadProgress(storage, reordered);
  assert.equal(reordered[result.index].id, exercises[3].id);
  assert.deepEqual([...result.solvedIds], ["call", "signature"]);
});

test("damaged or incompatible saves fall back to an empty session", () => {
  for (const raw of ["{", "null", "[]", '{"version":2}', '{"version":1,"index":-1,"solved":true}']) {
    const result = loadProgress(memoryStorage(raw), exercises);
    assert.equal(result.index, 0);
    assert.equal(result.solvedIds.size, 0);
  }
});

test("storage access failures reach the UI fallback instead of reporting a save", () => {
  const storage = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("quota"); }
  };
  assert.throws(() => loadProgress(storage, exercises), /blocked/);
  assert.throws(() => saveProgress(storage, exercises, 0, new Set()), /quota/);
});
