// Keep exercise IDs stable so saved completions survive content changes.
export const exercises = [
  {
    "id": "call",
    "topic": "expressions",
    "title": "空白で呼び出す",
    "code": "add x y = x + y\n\nadd 3 4",
    "prompt": "最後の式の結果は？",
    "answers": [
      "7"
    ],
    "hint": "xに3、yに4を入れて考えてみよう。",
    "explanation": "add 3 4 = 3 + 4 = 7。関数名のあとに引数を並べます。"
  },
  {
    "id": "if",
    "topic": "expressions",
    "title": "ifも値を返す",
    "code": "if 4 > 2 then 10 else 0",
    "prompt": "この式の結果を入力しよう。",
    "answers": [
      "10"
    ],
    "hint": "4 > 2 はTrue。then側が選ばれます。",
    "explanation": "条件がTrueなので10。Haskellのifにはthenとelseの両方が必要です。"
  },
  {
    "id": "bool",
    "topic": "types",
    "title": "比較の結果の型",
    "code": "3 < 5",
    "prompt": "この式の型名は？ 大文字・小文字も意識しよう。",
    "answers": [
      "Bool"
    ],
    "hint": "True / Falseの型です。",
    "explanation": "比較の結果はBool。boolやbooleanではなく、Boolと書きます。"
  },
  {
    "id": "signature",
    "topic": "types",
    "title": "型注釈を埋める",
    "code": "double :: ___\ndouble x = x * 2",
    "prompt": "Intを受け取り、Intを返す型を ___ に入れよう。",
    "answers": [
      "Int -> Int"
    ],
    "hint": "入力の型 -> 出力の型。",
    "explanation": "double :: Int -> Int。型注釈を省略すると数値型に対してより一般的な型を推論できますが、この問題はIntに限定しています。"
  },
  {
    "id": "cons",
    "topic": "lists",
    "title": "先頭に追加する",
    "code": "1 : [2, 3]",
    "prompt": "結果をリストとして入力しよう。",
    "answers": [
      "[1,2,3]"
    ],
    "hint": "コロンは、左の要素を右のリストの先頭に追加します。",
    "explanation": "結果は[1,2,3]。(:)の左は1要素、右はリストです。"
  },
  {
    "id": "range",
    "topic": "lists",
    "title": "範囲を合計する",
    "code": "sum [1..5]",
    "prompt": "この式の結果は？",
    "answers": [
      "15"
    ],
    "hint": "範囲の終端5も含めます。",
    "explanation": "1 + 2 + 3 + 4 + 5 = 15。sumはリストの数値を合計します。"
  },
  {
    "id": "map",
    "topic": "higher",
    "title": "全要素を変換する",
    "code": "map (*2) [1, 2, 3]",
    "prompt": "結果のリストを入力しよう。",
    "answers": [
      "[2,4,6]"
    ],
    "hint": "1、2、3のそれぞれを2倍します。",
    "explanation": "[2,4,6]。(*2)を各要素に適用します。"
  },
  {
    "id": "filter",
    "topic": "higher",
    "title": "条件で絞り込む",
    "code": "filter odd [1..6]",
    "prompt": "残る要素をリストで入力しよう。",
    "answers": [
      "[1,3,5]"
    ],
    "hint": "oddは奇数ならTrue。evenは偶数ならTrueです。",
    "explanation": "[1,3,5]。filterは、渡した関数がTrueを返す要素を残します。"
  },
  {
    "id": "partial",
    "topic": "partial",
    "title": "引数を1つだけ渡す",
    "code": "add x y = x + y\naddTen = add 10\n\naddTen 3",
    "prompt": "最後の式の結果は？",
    "answers": [
      "13"
    ],
    "hint": "addTenは、引数に10を足す関数です。",
    "explanation": "addTen 3 = add 10 3 = 13。add 10の時点で、残り1引数を受け取る関数ができます。"
  },
  {
    "id": "lambda",
    "topic": "partial",
    "title": "名前のない関数",
    "code": "map (\\x -> x * x) [1, 2, 3]",
    "prompt": "結果のリストを入力しよう。",
    "answers": [
      "[1,4,9]"
    ],
    "hint": "各要素を、それ自身と掛け合わせます。",
    "explanation": "[1,4,9]。\\x -> x * x は、xを受け取りxの2乗を返す匿名関数です。"
  },
  {
    "id": "tail",
    "topic": "patterns",
    "title": "残りを再帰に渡す",
    "code": "count :: [a] -> Int\ncount [] = 0\ncount (_:xs) = 1 + count ___",
    "prompt": "___ に入る変数名は？",
    "answers": [
      "xs"
    ],
    "hint": "先頭以外の、残りのリストを渡します。",
    "explanation": "xs。空リストなら0、要素があれば1を足して残りを数えます。_は値を使わないパターンです。"
  },
  {
    "id": "factorial",
    "topic": "patterns",
    "title": "再帰を追う",
    "code": "factorial :: Integer -> Integer\nfactorial 0 = 1\nfactorial n = n * factorial (n - 1)\n\nfactorial 5",
    "prompt": "最後の式の結果は？ この問題では0以上の整数を扱います。",
    "answers": [
      "120"
    ],
    "hint": "5 × 4 × 3 × 2 × 1 × factorial 0。",
    "explanation": "120。factorial 0 = 1が終了条件。負数を渡す場合の扱いは、この定義では用意していません。"
  },
  {
    "id": "compose",
    "topic": "compose",
    "title": "右から適用する",
    "code": "(length . filter even) [1..6]",
    "prompt": "この式の結果は？",
    "answers": [
      "3"
    ],
    "hint": "まず偶数だけを残し、その結果の長さを数えます。",
    "explanation": "filter even [1..6] = [2,4,6]。length [2,4,6] = 3です。"
  },
  {
    "id": "dollar",
    "topic": "compose",
    "title": "括弧を減らす",
    "code": "sum ___ map (*2) [1, 2, 3]",
    "prompt": "sum (map (*2) [1,2,3]) と同じ意味になる演算子を入れよう。",
    "answers": [
      "$"
    ],
    "hint": "右側の式全体を、左側の関数の引数にします。",
    "explanation": "$。sum $ map (*2) [1,2,3] は sum (map (*2) [1,2,3]) と同じ結果で、12になります。"
  },
  {
    "id": "nothing",
    "topic": "maybe",
    "title": "空の場合を表す",
    "code": "safeHead :: [a] -> Maybe a\nsafeHead [] = Nothing\nsafeHead (x:_) = Just x\n\nsafeHead []",
    "prompt": "最後の式の結果は？",
    "answers": [
      "Nothing"
    ],
    "hint": "[]に一致する定義を見てみよう。",
    "explanation": "Nothing。空リストからは先頭を取り出せないので、値がないことをMaybeで返します。"
  },
  {
    "id": "fmap",
    "topic": "maybe",
    "title": "中の値を変換する",
    "code": "fmap (+1) (Just 3)",
    "prompt": "結果をJustを含めて入力しよう。",
    "answers": [
      "Just 4"
    ],
    "hint": "Justの中の3に1を足し、Justで包んだまま返します。",
    "explanation": "Just 4。Maybeに対するfmapは、Justの値を変換します。NothingならNothingのままです。"
  },
  {
    "id": "repeat",
    "topic": "lazy",
    "title": "無限から4つだけ",
    "code": "take 4 (repeat 7)",
    "prompt": "結果のリストを入力しよう。",
    "answers": [
      "[7,7,7,7]"
    ],
    "hint": "7が続くリストから先頭4つを取り出します。",
    "explanation": "[7,7,7,7]。takeが要求する4要素分を使うので、無限リストを最後まで計算する必要はありません。"
  },
  {
    "id": "infinite",
    "topic": "lazy",
    "title": "無限の列を変換する",
    "code": "take 5 (map (*2) [1..])",
    "prompt": "結果のリストを入力しよう。",
    "answers": [
      "[2,4,6,8,10]"
    ],
    "hint": "1から続く整数を2倍し、先頭5つを取り出します。",
    "explanation": "[2,4,6,8,10]。mapとtakeを組み合わせ、無限の入力から必要な結果だけを取り出せます。"
  }
];
