// Topic IDs are stable links from exercises.
export const topics = [
  {
    "id": "expressions",
    "name": "式と関数",
    "title": "関数は、値を受け取って値を返す。",
    "text": "Haskellでは add 3 4 のように、空白で引数を渡します。定義は add x y = x + y。式を組み合わせて、欲しい値を作ります。",
    "analogy": "Javaの add(3, 4) に相当する呼び出しが add 3 4。returnキーワードは使いません。"
  },
  {
    "id": "types",
    "name": "型を読む",
    "title": "型は、関数の入出力を説明する。",
    "text": "Int -> Int は整数を受け取って整数を返す型。BoolはTrueとFalseを表します。Intは固定精度の整数、Integerは任意精度の整数です。",
    "analogy": "double :: Int -> Int は int double(int x) に近い型の宣言。Haskellでは定義と型注釈を別の行に書けます。"
  },
  {
    "id": "lists",
    "name": "リスト",
    "title": "同じ型の値を、ひとつに並べる。",
    "text": "[1,2,3] はリスト。1 : [2,3] は先頭に1を追加します。[1..5] は1から5までの列。sumは合計、lengthは要素数を返します。",
    "analogy": "リストは単方向の構造。先頭への追加や、先頭と残りに分解する操作が自然に書けます。"
  },
  {
    "id": "higher",
    "name": "map と filter",
    "title": "関数を、引数として渡す。",
    "text": "mapは各要素を変換し、filterは条件を満たす要素を残します。map (*2) [1,2,3] の (*2) は、値を2倍する関数です。",
    "analogy": "Java Streamのmap / filterと対応づけると読みやすい。ここではリストを入力してリストを返します。"
  },
  {
    "id": "partial",
    "name": "部分適用とラムダ",
    "title": "引数を少し渡すと、新しい関数になる。",
    "text": "add x y = x + y に対し add 10 は、あと1つの引数を待つ関数。匿名関数は \\x -> x * x のように書きます。",
    "analogy": "Javaの x -> x * x に近い表記が \\x -> x * x。Haskellでは引数を1つずつ渡す考え方が基本です。"
  },
  {
    "id": "patterns",
    "name": "パターンと再帰",
    "title": "データの形に合わせて、処理を分ける。",
    "text": "[] は空リスト、(x:xs) は先頭xと残りxs。空の場合の答えを決め、残りを同じ関数に渡すと再帰が作れます。",
    "analogy": "終了条件と、少し小さい入力への呼び出しを追ってみよう。xsは特別な予約語ではなく、残りのリストにつけた名前です。"
  },
  {
    "id": "compose",
    "name": "関数合成",
    "title": "小さな関数を、つなげて使う。",
    "text": "(f . g) x は f (g x)。右側のgから適用します。$は右側の式を引数として渡す、優先順位の低い演算子です。",
    "analogy": "length (filter even xs) と (length . filter even) xs は同じ結果。括弧のまとまりを追うと読みやすくなります。"
  },
  {
    "id": "maybe",
    "name": "Maybe",
    "title": "値がない場合も、型で表す。",
    "text": "Maybe a は値があるJust aと、値がないNothingを表します。安全な先頭取得なら、空リストにはNothingを返す設計にできます。",
    "analogy": "JavaのOptionalと似た用途があります。JustとNothingの両方を扱うと、欠損時の動作がコードに表れます。"
  },
  {
    "id": "lazy",
    "name": "遅延評価",
    "title": "必要な分だけ、値を取り出す。",
    "text": "take 4 は先頭4要素を取り出します。repeat 7 は7が続く無限リスト。必要な範囲をtakeで区切れば有限の結果が得られます。",
    "analogy": "無限リストを全部計算し終えてから切り出すのではなく、要求された部分が順に評価されます。"
  }
];
