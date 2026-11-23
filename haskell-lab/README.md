# Haskell Lab

9テーマ・18問のHaskell入門。Javaとの対応を読みながら、出力予測と穴埋めで学習する。

公開ページ https://tools.isikoro.dev/haskell-lab/

## 起動と検証

リポジトリのルートで以下を実行する。

    python3 -m http.server 8000
    npm test --prefix haskell-lab

ブラウザで http://localhost:8000/haskell-lab/ を開く。ES Modulesを使うためHTTPで配信する。
外部パッケージのインストールとビルドは不要。CIでも同じテストを実行する。

## 変更箇所

| ファイル | 役割 |
|---|---|
| index.html / styles.css | 画面構造・見た目 |
| data/topics.js | トピック・解説・Javaとの対応 |
| data/exercises.js | 問題・想定解・ヒント・解説 |
| grading.js | トークン単位の想定解照合 |
| storage.js | 履歴の保存・検証・旧形式との互換 |
| app.js | 操作と画面更新 |
| tests/core.test.js | 教材の整合、採点、保存の回帰テスト |
| AGENTS.md | AI向けの変更箇所と検証コマンドの短い案内 |

## 採点とデータ

問題は固定の想定解とトークン単位で比較する。空白は許容し、識別子の境界・大小文字・記号は区別。
GHC/GHCiによる自由な式の評価や別解の推論は行わない。別解を追加するときはanswersに登録する。
教材データの変更はHTMLを読まずにdata/だけで行える。問題数の表示はデータから計算する。

クリアした問題IDと表示位置をlocalStorageのhaskell-lab.progress.v1に保存。
既存の単一HTML版のindexとsolvedを復元する。新しい保存形式はexerciseIdも持ち、
問題を並べ替えたときも同じ問題を復元する。未知の問題IDや破損した保存内容は除外する。
保存できない環境でもページ内では学習できる。履歴はブラウザとオリジン単位で、端末間同期は行わない。
以前のchatgpt.siteでの履歴とtools.isikoro.devでの履歴は別々になる。

## 変更から公開まで

isikoro1/toolsのこのディレクトリを正本とする。
テスト後にmainへコミットすると、既存の自動公開設定が静的ファイルを公開する。
CIの検証はデプロイから独立しているため、失敗時は公開状況も確認する。
追加のビルド成果物や手作業でのファイル複製は不要。

ChatGPT Sitesで作った旧URLは以前のスナップショット。継続開発と一覧からのリンクには上の公開URLを使う。

## 教材の参照

- https://www.haskell.org/tutorial/functions.html
- https://www.haskell.org/onlinereport/haskell2010/haskellch3.html
