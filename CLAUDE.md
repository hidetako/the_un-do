# CLAUDE.md — 一息 / 坐雲堂（The Un-do）開発申し送り

> このファイルは Claude Code が起動時に自動で読む。新しいセッションはまずこれを読んで現状を把握すること。
> **やりとりは日本語で。**

## このプロジェクト
24時間ひらく国際オンライン坐禅堂のWebアプリ「一息（Issoku）／坐雲堂（The Un-do）」。
"study with me for zazen"（オンライン自習室の坐禅版）。記録で競わせない、手放す坐。
**よろづソリューションズ（Yorozu Solutions）の産物**。

## 構成・デプロイ
- **単一ファイル app: `index.html`**（全機能がここ）。
- 画像: `assets/brush/`（配信対象。毛筆素材＋**6座処の実写JPEG**）／YouTube素材: `assets/youtube/`（`.vercelignore`で**非配信**＝記録のみ）。
- 本番: **Vercel git連携で `main` → https://the-un-do.vercel.app/**
- **開発ブランチ: `claude/claude-md-continuation-ofxh6x`**（PR #11〜#18 をここから出した。基本これに継ぐか main から切る）。
- 在室感: **Supabase Realtime Presence**（匿名・揮発）。`@supabase/supabase-js@2.108.2` を esm.sh から固定読み込み。yorozuya-ghq プロジェクト（`dcxoouslwkfohdbacipa`）を**間借り**（分離せず据え置き＝受容済みリスク。`SECURITY.md`）。
- **唯一のDB書き込み＝24h集計**：`zaundo_sit_hourly`（hour+cntのみ・PIIゼロ・RLS有効でanon直接不可）。関数 `zaundo_bump_sit()`（座り始めに+1）／`zaundo_sits_24h()`（過去24hの延べ回数）。適用済み・`SECURITY.md` 追記済み。

## 進め方（重要・過去ここで混乱した）
- コミット → ブランチに push → **ドラフトPR**作成。ユーザーが「**マージして**」と言ったら ready 化→`main`へマージ（squash）→本番反映を curl で確認。
- **squashマージ後はブランチが main と履歴分岐する**。次の作業前に必ず `git fetch origin main && git reset --soft origin/main` でブランチを main 直上に作り直してから積む（force-push）。これを怠ると次のマージで衝突し、`-X ours` マージは**削除済みコードを復活させる**事故を起こす（実際に起きた）。
- **リポジトリは `hidetako/the_un-do`。push が実際に届いたか必ずPR一覧で確認**。**複数セッションを並行させない**こと。
- 画像で見せる時は**軽いJPEG（数百px）**。大きい画像を貼ると "リクエストが大きすぎます(32MB)" エラー。
- ユーザーが貼った画像はディスクに無い。**会話ログ jsonl**（`/root/.claude/projects/.../<session>.jsonl`）から base64 を抽出して保存する（既存の抽出スクリプトのパターン参照）。
- ローカル検証: `python3 -m http.server` ＋ Playwright（`/opt/node22/lib/node_modules/playwright`＝CommonJS なので `import pkg from ...; const {chromium}=pkg`、Chromium は `/opt/pw-browsers/chromium-*/chrome-linux/chrome`）。esm.sh/Google Fonts はオフラインで失敗するが CJK フォールバックで描画確認は可。スクショ確認後にコミット。

## セキュリティ（ヨロヅヤ診断基準 v2.2 準拠・`SECURITY.md`）
- CSP / HSTS / X-Frame-Options:DENY / Referrer-Policy / Permissions-Policy / COOP（`index.html` の meta ＋ `vercel.json` ＋ `_headers`）。
- **CSPは緩めない。** 外部連携はすべて「**別タブで開くリンク**」のみ（埋め込み無し）。`img-src 'self' data:` は許可済み。
- ghq に新規テーブルを足す時は RLS 必須＋公開キーの露出範囲を再確認（`SECURITY.md` の方針）。

## 現在の状態（done）
- **ブランド全面手書き**：毛筆 円相＋篆刻（行雲流水／豪）＋筆「一息」「坐雲堂」＋よろづ筆ロゴ。素材 `assets/brush/`（enso/issoku/yorozu/seiundou/koun/go/d0–9/fun/min）。
- **6座処すべて実写写真**（ユーザー生成をJPEG化して `assets/brush/` に）：honden=金の阿弥陀如来の本堂／kare=枯山水（灰色塀の採用版）／umi=海岸／tsuki=月夜／neko=三毛猫の和室／cho=調息の額。SVG作画は撤去済み。
- **スプラッシュ刷新**：濃紺の地＋灯りの微粒子（`#splashFx`）＋流れる光（`.splashglow`）＋円相の光輪・浮遊＋入場の立ち上がり。市松は一度入れて**撤去済み**。全て `prefers-reduced-motion` で無効化。
- **多言語9言語**（ja/en/zh-Hans/zh-Hant/ko/es/fr/de/pt）。umi の表示名は「**海岸**/Seashore」系（岸壁から変更済み）。
- **挙動**：坐禅の中断（やめる）→**入口(setup)に戻る**（splashではない）。線香は全座処**右下固定**（choの香炉配置は撤回済み＝cover背景に固定座標は破綻する）。煙は濃いめ（幹芯0.28）＋**色は sel.scene の明暗に毎フレーム追従**（暗=honden/tsuki/cho→白煙、明→ねずみ色）。
- **配信専用モード**: `?live=<座処>` ＋ **`?live=rotate`（=all）で6座処を巡回**（`?rotate=分`・既定10分・クロスフェード・世界時計同期・環境音/煙追従）。`?bell=分`/`?sound=0`/`?caption=0`。**配信画面は洗練済み**：下帯=毛筆「坐雲堂」落款＋URL、上帯=ささやきの在席行、全座処にシネマティックグレード（上下の締め＋data:SVGグレイン）。
- **`?count` 専用ページ**：在席数を手書き数字で全画面表示＋「過去24時間に N人が坐りました」（多言語・60秒更新）。観測者接続で自分は数えない。アプリUIからはリンクしない（配信オーバーレイ／単体リンク用）。
- **お布施**: 終わりの画面の `#supportLink`＝**有効化済みStripe** Payment Link（`https://buy.stripe.com/fZu7sL7fB2nRa2A7GE6J200`）。Stripeアカウント（個人事業主・よろづソリューションズ）の本人確認・セキュリティ自己申告書の入力サポート済み。
- **YouTubeライブ配信 開始済み（2026-07-02）**。チャンネルID `UCqzoMItMT74uC--y67S1-AQ`／ハンドル **`@Issoku_The_un_do`**（@The-un_doは未取得のまま終了・ハンドル404事故を受けアプリ導線は**恒久ID版** `/channel/<ID>/live`）。配信はユーザーPCのOBS（ブラウザソース `?live=rotate&bell=30`・音声はOBS制御）。**アプリ更新を配信に反映するにはOBSのブラウザソース再読み込み＋▶再クリックが必要**。初回配信 https://youtube.com/live/wOBMywDsKG8

## 次にやること（pending）— 配信は開始済み。残りはチャンネルの化粧（すべてユーザー手作業）
1. **チャンネル名とアイコン差し替え**：現状は名前「admin Yorozuya」＋個人写真のまま。Studio「カスタマイズ」→ 名前を「一息 — 坐雲堂 ｜ Issoku / The Un-do」、アイコン `assets/youtube/avatar.png`・バナー `banner.png`・透かし `watermark.png` へ。
2. **サムネのアップロード確認**（`assets/youtube/thumbnail.jpg`＝採用済み・1280×720）。
3. **外部リンクのクリック可能化**：説明欄URLをリンクにするには1回限りのチャンネル確認（Studioの青い「確認」リンク）。
4. **公開範囲の確認**：限定公開のままなら「公開」へ（Studio「コンテンツ」→ライブ配信タブ）。

## 主要ファイル
- `index.html` … アプリ全体。定数 `YT_LIVE_URL`/`SUPPORT_URL`/`SUPPORT_T`、`presence` モジュール（`bumpSit`/`sits24h` 含む）、`startBcast`（rotate対応）/`updateLiveCount`/`updateCount`/`update24h`、`T`/`ORIENT` 辞書、`applyLang`、`#splashFx`。
- `youtube.md`（YouTube連携・コピー・チャンネルID・**配信URLの選択肢**）、`SECURITY.md`（24h集計の追記あり）、`企画書.md`、`vercel.json`、`_headers`、`.vercelignore`。
