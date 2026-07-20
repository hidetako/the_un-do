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
- **文字列置換でワンライナー関数に行コメント（`//`）を差し込むと行末のコードを飲み込む**（PR #45で終了の鐘がコメントアウトされ本番退行。実際に起きた）。コメントは `/* */` を使い、置換後は必ず挙動テスト。
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
- **配信専用モード**: `?live=<座処>` ＋ **`?live=rotate`（=all）で6座処を巡回**（`?rotate=分`・既定10分・クロスフェード・世界時計同期・環境音/煙追従）。`?bell=分`/`?sound=0`/`?caption=0`。**配信画面は洗練済み**：全座処にシネマティックグレード（上下の締め＋data:SVGグレイン）。
  - **下帯**=毛筆「坐雲堂」落款＋その下に**日英ローテーション**（14秒毎フェード：URL→「24時間ひらく、世界の坐禅堂」→A zen hall of the world — open 24/7→「概要欄のリンクから、一緒に坐れます」→Sit with us anytime — link in the description）。
  - **上帯**=在席行（`#liveCount`）。アプリ誘導も担うため**大きめ**に（clamp(17-25px)・opacity.92）。**少人数の見せ方**：0人=「開堂しています」、1人=数字にせず「いま、ひとりが坐っています／someone is sitting now」、2人以上=数字。
- **`?count` 専用ページ**：在席数を手書き数字で全画面表示＋「過去24時間に N人が坐りました」（多言語・60秒更新）。**1人は数字にせず「いま、ひとりが坐雲堂にいます」（9言語 COUNT_ONE）／24h=0は行ごと非表示**。観測者接続で自分は数えない。アプリUIからはリンクしない（配信オーバーレイ／単体リンク用）。
- **お布施**: 終わりの画面の `#supportLink`＝**有効化済みStripe** Payment Link（`https://buy.stripe.com/fZu7sL7fB2nRa2A7GE6J200`）。Stripeアカウント（個人事業主・よろづソリューションズ）の本人確認・セキュリティ自己申告書の入力サポート済み。
- **YouTubeライブ配信 開始済み（2026-07-02）**。チャンネルID `UCqzoMItMT74uC--y67S1-AQ`／ハンドル **`@Issoku_The_un_do`**（@The-un_doは未取得のまま終了・ハンドル404事故を受けアプリ導線は**恒久ID版** `/channel/<ID>/live`）。配信はユーザーPCのOBS（ブラウザソース `?live=rotate&bell=30`・音声はOBS制御）。**アプリ更新を配信に反映するにはOBSのブラウザソース再読み込み＋▶再クリックが必要**。初回配信 https://youtube.com/live/wOBMywDsKG8
- **集計は3面統一（2026-07-10）**：アプリ入口・配信上帯・`?count` すべて「過去24時間の延べ着席数」（`zaundo_sits_24h` ローリング24h・60秒更新）。配信上帯は「今日、世界で N人が坐りました / N sat today」。**カウントは fetch 直叩き**（`/rest/v1/rpc/` へ直接POST・esm.sh/supabase-js 非依存）＋失敗時4秒後1回再試行＝**取りこぼすより多少の重複を許容**する方針。
- **地球儀刷新**：TZ名→代表都市表（約60都市・±1.5°）で**自分の灯りは必ず点灯**＋自分の経度を正面に。24h集計ぶんの灯り（`sitLights`・上限48・位置は大陸に散らす気配）。赤道＋45°経線・**地軸-23.4°**・実時刻の**昼夜**（夜側くっきり暗く）。タッチ/ホバーで「この星のどこかで、いっしょに坐っています」（`globe_msg` 9言語・在室行が4.6秒替わる）。入堂時に一度だけ金の明滅ヒント。
- **坐禅セッション体験**：Wake Lock で坐禅中は眠らせない。ただし **iPad/Chrome for iOS は `navigator.wakeLock` を出さず自動ロック→スリープでき、その間 `setTimeout` も凍る**（＝45分後の終了鐘が来ない事故）。対策＝終了予定を**実時刻 `endAt` でも保持**し、**復帰（`visibilitychange`/`pageshow`）した瞬間に精算**する `onResume`／`finishSit`：過ぎていればその場で鐘＋合掌、まだなら残り時間でタイマー引き直し＋`ac.resume()`。線香開始90秒で**墨色の暗幕**（opacity .94・タップで復帰・背景だけ沈み線香は残る＝仕様）。2分以上の坐は開始時に `dim_note` アナウンス（9言語）。「ただ、座る」は**30秒でフェードアウト**。**終了＝鐘→暗転解除→「合掌」**（ja/中文=合掌・韓=합장・欧文=合掌 · gasshō）**が5.6秒浮かんで end 画面へ**。終了トリガーは実時間 `endTimer`（rAF非依存＝裏タブ/ロックでも時間どおり）。
- **禅語（end画面）**：**順繰り12句**（坐り終えるたび次へ・`issoku_zengo_idx` 端末記憶・言語切替では進まない）。**毛筆8点**＝行雲流水/無思量/円相/きっさこ/本来無一物/瀧/松無古今色/無（`assets/brush/zengo-*.jpg`・色紙/掛軸/短冊として表示・`.zk` は img 差し替え式）。フォント4句＝日日是好日/一期一会/**放下着**（表記は着）/平常心是道。無の一言=「力を抜いて。なにも、しなくていい。」、松無古今色=「あなたの坐禅も色あせない」系（9言語）。
- **PWA**：`manifest.json`＋`assets/icons/`（**紙地×墨の円相**・maskable対応。墨地×白は小サイズで黒四角に見えたため反転済み）＋`sw.js`（オフライン対応：index=network-first・同一オリジン資産=cache-first・外部素通し）。⚠️ **Chromeはインストール時にアイコンをキャッシュ**＝アイコン更新は再インストールが必要。
- **UI**：表紙タグライン「24時間、世界のどこからでも。**坐って、ひといき、つきましょう。**」（9言語）。設定画面はスクロールほぼ不要（余白圧縮・地球儀104px）。座処チップは**3列グリッド固定**（全言語で上3下3）。時間プリセット5/10/20/40分。iOSセーフエリア対応。在室行の数字は毛筆数字（d0-9）。
- **音**：環境音は座処ごとに作り分け（**波のうねりは海岸だけ**・本堂=胴鳴り・枯山水=風+鹿威し・月夜=夜気+鈴虫・猫=7.4秒周期の寝息+喉鳴り・調息=定常）。**離散音は「まれに・不規則に・やわらかく」が原則**（短周期の繰り返しは拍になり集中を遮る）。鐘の音量は控えめ（三声0.5・終了/配信0.55）。

## 次にやること（pending）— 配信は開始済み。残りはチャンネルの化粧（すべてユーザー手作業）
1. **チャンネル名とアイコン差し替え**：現状は名前「admin Yorozuya」＋個人写真のまま。Studio「カスタマイズ」→ 名前を「一息 — 坐雲堂 ｜ Issoku / The Un-do」、アイコン `assets/youtube/avatar.png`・バナー `banner.png`・透かし `watermark.png` へ。
2. **サムネのアップロード確認**（`assets/youtube/thumbnail.jpg`＝採用済み・1280×720）。
3. **外部リンクのクリック可能化**：説明欄URLをリンクにするには1回限りのチャンネル確認（Studioの青い「確認」リンク）。
4. **公開範囲の確認**：限定公開のままなら「公開」へ（Studio「コンテンツ」→ライブ配信タブ）。

## 主要ファイル
- `index.html` … アプリ全体。定数 `YT_LIVE_URL`/`SUPPORT_URL`/`SUPPORT_T`、`presence` モジュール（`bumpSit`/`sits24h`＝fetch直叩き・`sitLights`/`TZ_CITY`/globe描画）、`startBcast`（rotate対応）/`updateLiveCount`/`updateCount`/`update24h`/`updatePresence`、`ZENGO`/`renderZengo`（順繰り）、`keepAwake`/`releaseWake`（Wake Lock）、`armDim`/`undim`（暗幕）、`endSession`（鐘→合掌→end）、`T`/`ORIENT` 辞書（`globe_msg`/`dim_note`/`closing` 含む）、`applyLang`、`#splashFx`。
- `manifest.json`／`sw.js`（PWA・オフライン。**資産差し替え時は sw.js の V を上げる**）／`assets/icons/`（アプリアイコン）。
- `assets/brush/zengo-*.jpg` … 毛筆禅語8点（ユーザー揮毫。追加時は jsonl から抽出→560px級JPEG→ZENGO配列に img 紐づけ）。
- `youtube.md`（YouTube連携・コピー・チャンネルID・**配信URLの選択肢**）、`配信手順.md`（**別PCでの配信立ち上げ手順書**・つまずき早見表つき・`.vercelignore`で非配信）、`SECURITY.md`（24h集計の追記あり）、`企画書.md`、`vercel.json`、`_headers`、`.vercelignore`。
