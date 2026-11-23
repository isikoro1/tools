import { topics } from "./data/topics.js";
import { exercises } from "./data/exercises.js";
import { matches } from "./grading.js";
import { loadProgress, saveProgress } from "./storage.js";

const byId = id => document.getElementById(id);
let index = 0;
let solvedIds = new Set();
let drafts = {};
let feedbacks = {};


// Storage failures preserve in-page progress and show the persistence limit.
function restore() {
  try {
    const saved = loadProgress(localStorage, exercises);
    index = saved.index;
    solvedIds = saved.solvedIds;
  } catch {
    byId("storage-status").textContent = "この環境では履歴を保存できません";
  }
}

function persist() {
  try {
    saveProgress(localStorage, exercises, index, solvedIds);
  } catch {
    byId("storage-status").textContent = "履歴はこのページを開いている間のみ保持";
  }
}

function showFeedback(kind, text) {
  const box = byId("feedback");
  box.hidden = false;
  box.dataset.kind = kind;
  box.textContent = text;
  feedbacks[exercises[index].id] = { kind, text };
}

function renderNavigation() {
  byId("chapters").replaceChildren();
  const currentTopic = exercises[index].topic;
  for (const topic of topics) {
    const items = exercises.filter(item => item.topic === topic.id);
    const count = items.filter(item => solvedIds.has(item.id)).length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chapter";
    if (topic.id === currentTopic) button.setAttribute("aria-current", "step");
    const name = document.createElement("span");
    const status = document.createElement("small");
    name.textContent = topic.name;
    status.textContent = count + " / " + items.length;
    button.append(name, status);
    button.addEventListener("click", () => {
      const firstUnsolved = exercises.findIndex(item => item.topic === topic.id && !solvedIds.has(item.id));
      goTo(firstUnsolved >= 0 ? firstUnsolved : exercises.findIndex(item => item.topic === topic.id));
    });
    byId("chapters").append(button);
  }
  byId("progress-text").textContent = solvedIds.size + " / " + exercises.length;
  byId("progress").value = solvedIds.size;
  byId("progress").max = exercises.length;
  byId("completion").hidden = solvedIds.size !== exercises.length;
  byId("completion").textContent = exercises.length + "問クリア！次はGHCiで例を書き換えて、引数を変えた結果を試してみよう。";
  byId("resume").textContent = solvedIds.size === exercises.length ? "最初から復習する" : "未クリアから再開";
}

function render() {
  const item = exercises[index];
  const topic = topics.find(topic => topic.id === item.topic);
  byId("topic-label").textContent = topic.name;
  byId("topic-title").textContent = topic.title;
  byId("explanation").textContent = topic.text;
  byId("analogy").textContent = topic.analogy;
  byId("exercise-title").textContent = item.title;
  byId("code").textContent = item.code;
  byId("prompt").textContent = item.prompt;
  byId("answer").value = drafts[item.id] || "";
  byId("answer").placeholder = item.code.includes("___") ? "___ に入る部分だけ" : "結果・型名を入力";
  byId("solved").textContent = solvedIds.has(item.id) ? "クリア済み" : "未クリア";
  byId("position").textContent = (index + 1) + " / " + exercises.length;
  byId("previous").disabled = index === 0;
  byId("next").textContent = index === exercises.length - 1 ? "最初の未クリアへ" : "次の問題";
  const feedback = feedbacks[item.id];
  byId("feedback").hidden = !feedback;
  if (feedback) {
    byId("feedback").dataset.kind = feedback.kind;
    byId("feedback").textContent = feedback.text;
  }
  renderNavigation();
}

function goTo(next) {
  drafts[exercises[index].id] = byId("answer").value;
  index = next;
  persist();
  render();
}

byId("answer-form").addEventListener("submit", event => {
  event.preventDefault();
  const item = exercises[index];
  const answer = byId("answer").value;
  if (!answer.trim()) {
    showFeedback("hint", "答えを入力してみよう。迷ったらヒントを開けます。");
    byId("answer").focus();
    return;
  }
  drafts[item.id] = answer;
  if (matches(item, answer)) {
    solvedIds.add(item.id);
    persist();
    showFeedback("success", "正解！\n" + item.explanation);
    byId("solved").textContent = "クリア済み";
    renderNavigation();
  } else {
    showFeedback("wrong", "想定解とは一致しません。\n" + item.hint + "\n型名・関数名は大文字小文字を区別します。");
  }
});
byId("hint").addEventListener("click", () => showFeedback("hint", exercises[index].hint));
byId("reveal").addEventListener("click", () => {
  const item = exercises[index];
  showFeedback("hint", "想定解 " + item.answers[0] + "\n" + item.explanation + "\n自分で入力して答え合わせするとクリアになります。");
});
byId("previous").addEventListener("click", () => { if (index > 0) goTo(index - 1); });
byId("next").addEventListener("click", () => {
  if (index < exercises.length - 1) goTo(index + 1);
  else {
    const pending = exercises.findIndex(item => !solvedIds.has(item.id));
    goTo(pending >= 0 ? pending : 0);
  }
});
byId("resume").addEventListener("click", () => {
  const pending = exercises.findIndex(item => !solvedIds.has(item.id));
  goTo(pending >= 0 ? pending : 0);
});
byId("reset").addEventListener("click", () => {
  if (!confirm("クリア履歴を消して、最初から学習しますか？")) return;
  solvedIds.clear();
  drafts = {};
  feedbacks = {};
  index = 0;
  persist();
  render();
});

restore();
render();
