# CLAUDE.md — 一息 / 坐雲堂（The Un-do）開発申し送り

> このファイルは Claude Code が起動時に自動で読む。新しいセッションはまずこれを読んで現状を把握すること。
> **やりとりは日本語で。**

## このプロジェクト
24時間ひらく国際オンライン坐禅堂のWebアプリ「一息（Issoku）／坐雲堂（The Un-do）」。
"study with me for zazen"（オンライン自習室の坐禅版）。記録で競わせない、手放す坐。
**よろづソリューションズ（Yorozu Solutions）の産物**。

## 構成・デプロイ
- **単一ファイル app: `index.html`**（全機能がここ）。
- 画像: `assets/brush/`（配信対象）／YouTube素材: `assets/youtube/`（`.vercelignore`で**非配信**＝記録のみ）。
- 本番: **Vercel git連携で `main` → https://the-un-do.vercel.app/**
- **開発ブランチ: `claude/wizardly-ramanujan-qf4j4b`**（ここに積み上げてきた。新規でも基本これに継ぐか、main から切る）。
- 在室感: **Supabase Realtime Presence**（匿名・DB書き込みなし）。`@supabase/supabase-js@2.108.2` を esm.sh から固定読み込み。yorozuya-ghq プロジェクトを**間借り**（分離せず据え置き＝受容済みリスク。`SECURITY.md`）。

## 進め方（重要・過去ここで混乱した）
- コミット → ブランチに push → **ドラフトPR**作成。ユーザーが「**マージして**」と言ったら ready 化→`main`へマージ→本番反映を確認。
- **リポジトリは `hidetako/the_un-do`。push が実際に届いたか必ずPR一覧で確認**（別セッションの push が実リポジトリに届かず、存在しないPRを「作った」と誤認した事故あり）。**複数セッションを並行させない**こと。
- 画像で見せる時は**軽いJPEG（数百px）**。大きい画像を貼ると "リクエストが大きすぎます(32MB)" エラー。
- ローカル検証: `python3 -m http.server` ＋ Playwright（`/opt/node22/.../playwright`, Chromium `/opt/pw-browsers/...`）。esm.sh/Google Fonts はオフラインで失敗するが CJK フォールバックで描画確認は可。スクショ確認後にコミット。

## セキュリティ（ヨロヅヤ診断基準 v2.2 準拠・`SECURITY.md`）
- CSP / HSTS / X-Frame-Options:DENY / Referrer-Policy / Permissions-Policy / COOP（`index.html` の meta ＋ `vercel.json` ＋ `_headers`）。
- **CSPは緩めない。** 外部連携はすべて「**別タブで開くリンク**」のみ（埋め込み無し）。`img-src 'self' data:` は許可済み。

## 現在の状態（done）
- **ブランド全面手書き**：本物の毛筆 円相＋篆刻〔右上=**行雲流水**（左上セルだけ生成り、他は朱の線のみ）／左下=**豪**（朱の線のみ・縮小）〕＋筆「**一息**」「**坐雲堂**」＋「**よろづソリューションズ**」筆ロゴ。素材は `assets/brush/`（enso/issoku/yorozu/seiundou/koun/go/d0–9/fun/min）と `assets/youtube/`（原本含む）。
- **多言語9言語**（ja/en/zh-Hans/zh-Hant/ko/es/fr/de/pt）。初回はブラウザ言語自動＋右上ピッカー。`T`/`ORIENT` 辞書、`SUPPORT_T`/`UNIT_IMG`/`SUPPORT_T` 等のマップ。
- スプラッシュ＝円相+篆刻+一息、設定タイトル=筆の坐雲堂、**時間表示=手書き数字+分/min**。
- **配信専用モード**: `?live=<座処>`（honden/kare/umi/tsuki/neko/cho）でUI非表示の全画面（一場面+環境音+鐘）。`?bell=分`/`?sound=0`/`?caption=0`。鐘と線香は**世界時計に同期**。画面上部に**世界の在席数**（`presence.connect(true)`＝観測者接続で自分は数えない）。`startBcast`/`updateLiveCount`。
- **お布施**: 終わりの画面の `#supportLink`。定数 **`SUPPORT_URL`**（Stripe Payment Link を設定）。9言語（`SUPPORT_T`）。外部リンクのみ。
- YouTubeチャンネル **@The-un_do**（ID `UCqzoMItMT74uC--y67S1-AQ`）。アイコン設定済み。

## 次にやること（pending）
1. （未マージなら）**お布施リンク有効化のPRをマージ→本番確認**（終わりの画面にリンク点灯）。
2. YouTube Studio で **バナー `assets/youtube/banner.png`・透かし `watermark.png`** を差し替え（ユーザーの手作業）。
3. **ライブ配信テスト**：OBSで `?live` のURLを全画面キャプチャ＋デスクトップ音声、**収益化オフ**。配信有効化は電話認証・最大24h。
4. （任意）お布施導線を入口やlive概要欄にも。Stripe決済ページの金額は「**顧客が指定**」推奨。

## 主要ファイル
- `index.html` … アプリ全体。定数 `YT_LIVE_URL`/`SUPPORT_URL`/`SUPPORT_T`、`presence` モジュール、`startBcast`/`updateLiveCount`、`T`/`ORIENT` 辞書、`applyLang`。
- `youtube.md`（YouTube連携・コピー・チャンネルID）、`SECURITY.md`、`企画書.md`、`vercel.json`、`_headers`、`.vercelignore`。
