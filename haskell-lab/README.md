# Haskell Lab

Java経験者がHaskellを学ぶための、短い解説と出力予測・穴埋めの学習アプリ。9トピック、18問を収録。

## 使い方

index.htmlをブラウザで開く。解説を読み、答えを入力して答え合わせする。ヒントと解答説明を利用できる。解答を表示しただけではクリアにならず、正解の入力で記録する。

式と関数、型、リスト、map/filter、部分適用・ラムダ、パターン・再帰、関数合成、Maybe、遅延評価の順に学習。全トピックをいつでも選択できる。

## 採点方式

各問の想定解をトークン単位で照合する。空白の違いは許容し、識別子の大小文字と記号は区別する。Just4とJust 4は異なる入力として扱う。任意のHaskell式の意味を評価する採点ではなく、GHC/GHCiは内蔵していない。別解が必要ならanswersに追加する。出力予測には結果の値、穴埋めには欠けている部分だけを入力する。

教材は公式チュートリアルとHaskell 2010 Reportの基本構文を参照して作成。例題は本アプリの独自教材。

## 構造

index.htmlにHTML・CSS・JavaScriptをまとめた、外部依存のない静的アプリ。すべてのDOMへの教材・入力表示にtextContentかvalueを使う。

| 対象 | 役割 |
|---|---|
| topics | id、トピック名、解説、Javaとの対応 |
| exercises | 安定したid、所属topic、code、設問、answers、hint、正解後のexplanation |
| normalize / matches | 入力と想定解のトークン照合 |
| solvedIds / index | クリア履歴と表示中の問題位置 |
| drafts / feedbacks | ページ内だけで維持する入力と表示結果 |
| restore / persist | localStorageへの復元・保存。既知の問題IDだけ復元 |
| renderNavigation / render | メニュー、進捗、教材、問題の表示 |
| goTo | 移動前の入力を退避し、位置を保存して表示を更新 |
| answer-form submit | 空欄・誤答・正答を判定。正答時のみクリア履歴に追加 |

## 保存と変更

保存キーはhaskell-lab.progress.v1。version、index、solvedの問題ID配列を保存する。入力途中のテキストとフィードバックは再読み込み時に消える。保存が利用できなくても、そのページ内では学習を続けられる。履歴は端末・ブラウザ・オリジン単位で、サーバー同期しない。

問題を追加する場合は重複しないidと既存topicを指定する。既存の問題idは履歴の互換性のため保持する。問題順を入れ替えると保存した表示位置indexは新しい並びの同じ位置に対応する。問題数を変える際はHTMLの初期進捗値とクリア表示文の18問も修正する。解説の範囲を変えた場合は想定解を再確認する。

## 検証

自動検証で全18問の想定解、誤答、空白許容、識別子境界、大小文字、トピック整合、18問クリア、進捗保存と復元を確認。ブラウザで解答入力・Enter送信・採点・トピック移動・再読み込み後の保存を確認。GHCによる例題の実行とモバイル実機での確認は未実施。

## 公開

GitHubのisikoro1/tools/haskell-labとSitesは別の管理先。GitHubの変更はSitesに自動反映されない。変更時は同じindex.htmlをSitesのdist/index.htmlにも反映してデプロイする。公開先は所有者のChatGPTログインで利用する設定。

## 公式資料

- https://www.haskell.org/tutorial/functions.html
- https://www.haskell.org/onlinereport/haskell2010/haskellch3.html
