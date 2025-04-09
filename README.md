# HTML変換・ダウンロードツール

HTMLコードを画像、PDF、HTMLファイルとしてダウンロードできるシンプルなWebアプリケーションです。

## 特徴

- HTMLコードをテキスト入力またはファイルアップロードで読み込み
- 入力したHTMLのプレビュー表示
- 画像（PNG/JPEG）、PDF、HTMLとしてダウンロード
- 完全なクライアントサイド処理（サーバーへの送信なし）
- モバイル対応（スマートフォン、タブレットで動作）

## モバイル対応の機能

- レスポンシブデザイン（スマホ、タブレット、デスクトップに最適化）
- タッチ操作に最適化されたUI
- iOS Safari向けの特別なダウンロード処理
- PWA対応（ホーム画面に追加可能）

## 使い方

1. HTMLコードをテキストエリアに入力するか、HTMLファイルをアップロード
2. 「プレビュー」ボタンをクリックして表示を確認
3. 画像、HTML、PDFの各形式で保存
4. 必要に応じて出力設定（画像形式、品質、背景色、スケール）を調整

## iOS/iPadでの使用

iOS Safariでは直接ダウンロードに制限があるため、以下の手順でファイルを保存できます：

1. 各ダウンロードボタンをタップすると、専用のリンクが表示されます
2. リンクをタップして新しいタブで画像/PDF/HTMLを開きます
3. 画面を長押しするか、共有ボタンから「ファイルに保存」を選択

## ライブラリ

- HTML2Canvas: HTMLをキャンバスに描画
- FileSaver.js: ファイルダウンロード処理
- jsPDF: PDF生成

## 更新履歴

- 2025-04-09: モバイル対応機能を追加（レスポンシブデザイン、iOS対応、PWA対応）
- 2025-03-15: 初期バージョンリリース