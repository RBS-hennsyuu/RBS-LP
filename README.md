# RBS LP (リペアビジネススクール ランディングページ)

リペアビジネススクールの公式ランディングページ

## プロジェクト概要

- **目的**: リペアスクールの受講生募集・資料請求
- **技術スタック**: HTML / CSS / JavaScript
- **ホスティング**: Firebase Hosting
- **環境**: テスト環境（rbs-lp-test）/ 本番環境（rbs-lp）

## ディレクトリ構成

```
new_project/
├── index.html           # メインLP
├── documents.html       # 資料ページ
├── style.css           # スタイルシート
├── script.js           # JavaScript（モーダル、GAS送信）
├── gas/                # Google Apps Script
│   └── Code.gs           # GASコード（スプレッドシート保存・メール送信）
├── assets/             # 画像・リソース
│   └── images/
│       └── common/
│           └── logo.png
├── BK/                 # バックアップ（Git管理外）
├── firebase.json       # Firebase Hosting設定
└── .firebaserc         # Firebaseプロジェクト設定
```

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/RBS-hennsyuu/RBS-LP.git
cd RBS-LP
```

### 2. ローカルでの確認

ブラウザで `index.html` を開くだけでOK（サーバー不要）

### 3. Firebase CLIのインストール（初回のみ）

```bash
npm install -g firebase-tools
firebase login
```

## デプロイ手順

### テスト環境へのデプロイ

```bash
# .firebasercで "rbs-lp-test" が設定されていることを確認
firebase deploy --only hosting
```

デプロイ先: https://rbs-lp-test.web.app

## Google Apps Script セットアップ

資料請求フォームのデータをGoogleスプレッドシートに保存し、自動返信メールを送信するための設定です。

### 1. スプレッドシートを作成

1. [Google ドライブ](https://drive.google.com) で新規スプレッドシートを作成
2. URL から スプレッドシートID をコピー
   - 例: `https://docs.google.com/spreadsheets/d/【この部分がID】/edit`

### 2. Apps Script を設定

1. スプレッドシートで **拡張機能 > Apps Script** を開く
2. 既存のコードを削除し、`gas/Code.gs` の内容を貼り付け
3. `CONFIG.SPREADSHEET_ID` にステップ1でコピーしたIDを設定

### 3. ウェブアプリとしてデプロイ

1. **デプロイ > 新しいデプロイ**
2. 種類: **ウェブアプリ**
3. 設定:
   - 実行ユーザー: **自分**
   - アクセス権: **全員**
4. **デプロイ** をクリック
5. 表示される **ウェブアプリURL** をコピー

### 4. script.js にURLを設定

`script.js` の CONFIG を編集:

```javascript
const CONFIG = {
    GAS_URL: 'https://script.google.com/macros/s/xxxxx/exec'  // ← ここにURLを貼り付け
};
```

### 5. 動作確認

1. `firebase deploy` で再デプロイ
2. フォームを送信してテスト
3. スプレッドシートにデータが追加されることを確認
4. 入力したメールアドレスに自動返信メールが届くことを確認

### 本番環境へのデプロイ

1. `.firebaserc` を編集:
```json
{
  "projects": {
    "default": "rbs-lp"
  }
}
```

2. デプロイ実行:
```bash
firebase deploy --only hosting
```

## 機能一覧

### 実装済み
- ✅ レスポンシブデザイン（PC/SP対応）
- ✅ 透明ヘッダーナビゲーション
- ✅ ハンバーガーメニュー（モバイル）
- ✅ モーダル表示（資料請求フォーム）
- ✅ CTAボタン（3箇所）
- ✅ 受講者の声セクション
- ✅ FAQ セクション
- ✅ 配色デザイン（ネイビー/オレンジ/ライトブルー）

### 実装済み（設定待ち）
- ✅ Google Apps Script連携（スプレッドシート保存・自動メール送信）

### 未実装（今後の予定）
- ⏳ PDF資料ダウンロード機能

## コーディング規約

### CSS
- カラー変数を使用（`:root`で定義）
- セクション単位でコメント区切り
- モバイルファーストではなく、デスクトップ基準 → メディアクエリで調整

### JavaScript
- モーダル、ハンバーガーメニューは既存実装を維持
- フォーム送信は `script.js` の TODO コメント部分に実装予定

### HTML
- セマンティックタグを使用
- `id` はJavaScript用、`class` はCSS用

## Git運用ルール

### ブランチ戦略
- `main`: 本番相当のコード
- 機能追加時は feature ブランチを作成（推奨）

### コミットメッセージ
```
feat: 新機能追加
fix: バグ修正
style: デザイン・CSS変更
docs: ドキュメント更新
chore: 設定変更
```

## 注意事項

### セキュリティ
- Firebase APIキーは環境変数で管理（実装時）
- `.gitignore` でBKフォルダ、node_modules等を除外済み

### 画像
- ロゴ: `assets/images/common/logo.png` (50px幅推奨)
- 背景画像: `assets/s-2400x1371_v-frms_webp_*.webp`

## 問い合わせ

プロジェクトに関する質問は、リポジトリのIssuesまたは担当者まで。
