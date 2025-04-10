# 変更履歴

## 2025-04-09: プレビュー表示機能の修正

### 修正概要
「HTML変換・ダウンロードツール」のプレビュー表示機能に問題があったため、修正を実施しました。

### 問題点
1. プレビュー表示が正常に機能していませんでした
2. 主な原因:
   - JavaScriptコード内で `previewFrame` 変数が `html-preview-frame` というIDを参照していましたが、HTML内では `preview-frame` が指定されていた
   - `htmlPreview` 変数が実際にはHTMLに存在しない要素を参照していた

### 修正内容
1. プレビュー機能の修正:
   - `previewFrame` の取得部分を正しいID (`preview-frame`) に修正
   - 存在しない `htmlPreview` 変数の参照を適切に修正またはコメントアウト

2. 関連機能の修正:
   - クリアボタン処理の修正: プレビューフレームをクリアする処理を追加
   - 変換ボタン処理の修正: プレビューフレームが空の場合にHTMLを書き込む処理を追加
   - PDFダウンロードボタン処理の修正: 同様にプレビューフレームへの対応

### テスト結果
以下の機能すべてが正常に動作することを確認しました:
- プレビュー表示
- クリア機能
- 画像変換・ダウンロード
- HTMLダウンロード
- PDFダウンロード

### 推奨事項
- 今後のメンテナンスでは、HTMLとJavaScriptの要素ID一致を確認することを推奨
- 不要な変数や参照を削除・整理することで、コードの保守性を向上させること
