# YouTube連携 — 「表口 × アプリ本体」の両輪

企画書の方針（L4「オンライン自習室 study with me を座禅向けに再設計」／L467「YouTube＝発見・集客」／L549「YouTube表口 × アプリ本体の両輪」）に沿った連携メモ。

- **本体（アプリ）**: https://the-un-do.vercel.app/ （現行URL。将来 issoku.org 等に変わり得る）
- **表口（YouTube）**: 坐雲堂の一場面＋環境音＋鐘を24時間流す “study with me for zazen” ライブ。**発見・集客の場**として、アプリへ人を送る。
- 位置づけ: **よろづソリューションズ（Yorozu Solutions）の産物**として広告してよい（収益化はしない方針）。

---

## 1. アプリ側のドア（実装済み・URL差し込み待ち）

入口（坐雲堂の設定画面）の在室表示の下に、静かな導線を出す仕組みを実装済み。

- 制御は `index.html` 内の定数 **`YT_LIVE_URL`**（現在は空＝**非表示**）。
- ライブ/チャンネルのURLを入れると、入口に「**▶ いま、世界の堂を眺める（YouTubeライブ）**／▶ Watch the hall live on YouTube」が表示され、**別タブで開く**（`rel="noopener"`）。
- 外部リンクのみのため **CSPの緩和は不要**（動画を埋め込まない＝広告もアプリ内に出ない）。

**現状（2026-07-02 ライブ開始済み）**: `YT_LIVE_URL = 'https://www.youtube.com/channel/UCqzoMItMT74uC--y67S1-AQ/live'`（**恒久ID版**・常に現行ライブへ飛ぶ）＋文言は9言語で「**いま一緒に坐る（ライブ）**/Sit together now — live」系に切替済み。初回配信URL: https://youtube.com/live/wOBMywDsKG8
> ✅ **ハンドル確定（2026-07-02）**: **`@Issoku_The_un_do`** を取得（https://www.youtube.com/@Issoku_The_un_do ・`/live`とも到達確認済み）。旧記録の `@The-un_do` は未取得のまま終了、初期ハンドルは `@adminYorozuya` だった。アプリの導線は恒久ID版（`/channel/UCqzoMItMT74uC--y67S1-AQ/live`）なのでハンドル変更の影響を受けない。
> ⚠️ **残ブランディング**: チャンネル名が「admin Yorozuya」・アイコンが個人写真のまま。Studio「カスタマイズ」で名前を「一息 — 坐雲堂 ｜ Issoku / The Un-do」に、アイコン/バナー/透かしを `assets/youtube/` の素材に差し替えること。

---

## 2. YouTube側の素材（コピー）— そのまま貼れる雛形

### チャンネル
- 名前（案）: 一息 — 坐雲堂 ｜ Issoku / The Un-do
- **ハンドル（確定）**: `@Issoku_The_un_do` → https://www.youtube.com/@Issoku_The_un_do （2026-07-02取得。屋号＋寺名。人が読む用・変更可）
- **チャンネルID（恒久・一意）**: `UCqzoMItMT74uC--y67S1-AQ` → https://www.youtube.com/channel/UCqzoMItMT74uC--y67S1-AQ
  - ハンドルを変えても不変。RSS / API / 自動連携の鍵に使う。
  - ライブ直行: `…/channel/UCqzoMItMT74uC--y67S1-AQ/live`（`@Issoku_The_un_do/live` でも可）
  - RSS: `https://www.youtube.com/feeds/videos.xml?channel_id=UCqzoMItMT74uC--y67S1-AQ`
  - ※アプリの導線（`YT_LIVE_URL`）は**恒久ID版を使用中**（ハンドル変更で切れた事故を受けて）。ハンドルは人が読む用。
- **アイコン（プロフィール画像）**: `assets/youtube/avatar.png`（**本物の毛筆円相**＋**篆刻（円相右上＝行雲流水／豪）**＋**本物の毛筆「一息」**・1600px四方）。素材：`enso-light.png`／`issoku-light.png`／`seal-koun.png`（行雲流水）／`seal-go.png`（豪）
- **バナー（ヘッダー）**: `assets/youtube/banner.png`（毛筆円相＋**本物の毛筆「坐雲堂」**／THE UN-DO＋三日月・2560×1440・**全デバイス安全域1235×338に文字収め**）。坐雲堂は `seiundou-source.webp` 原本／`seiundou-light.png` 淡色版
- **動画の透かし**: `assets/youtube/watermark.png`（円相のみ・背景透過＋淡い影・300px四方）
- **リンク欄**: 「坐るアプリ → https://the-un-do.vercel.app/ 」
- ※円相は本物の毛筆作品（`assets/youtube/enso-source.png` 原本／`enso-light.png` 紙地を抜いた淡色版）。各素材は `assets/youtube/*.html` から再生成可（`enso-light.png` を参照）。

### チャンネル概要（About）
> 一息（Issoku）— 24時間ひらく、世界の坐禅堂「坐雲堂（The Un-do）」。
> 一人だけど、みんなと一緒に坐る。流れている堂を眺めても、実際に坐ってもいい。
> ▶ 坐るアプリ: https://the-un-do.vercel.app/
> Presented by よろづソリューションズ（Yorozu Solutions）

### ライブ配信タイトル（日英）
- 【ライブ】坐雲堂 — 一緒に坐る／鐘と環境音 ｜ zazen "sit with me" live
- 【LIVE】The Un-do — sit with me ｜ zen bell & ambience（24/7）

### 概要欄テンプレ
> 一息（Issoku）— 24時間ひらく、世界の坐禅堂「坐雲堂（The Un-do）」。
> 世界のどこかの誰かと、黙って、同じ時に坐る。眺めるだけでも、一緒に坐っても。
>
> ▶ 坐るアプリ → https://the-un-do.vercel.app/
> 　姿勢・座処・鐘・線香・在室の灯り。記録で競わせない、手放す坐。
>
> Sit quietly, with someone, somewhere — anytime. Full practice in the app:
> ▶ https://the-un-do.vercel.app/
>
> Presented by よろづソリューションズ / Yorozu Solutions
> #坐禅 #瞑想 #studywithme #zazen #meditation #作業用 #asmr

### 固定コメント
> ▶ 実際に坐るアプリはこちら → https://the-un-do.vercel.app/ ｜ 24時間ひらいています。一息、どうぞ。

### 画面オーバーレイ（下帯・常時表示）
> 坐雲堂 The Un-do ｜ 坐るアプリ → the-un-do.vercel.app

---

## 3. 表口の配信そのもの（次段：option 2 の準備メモ）

24h常時ライブを出す場合の最小構成（あなた側の準備）:

- **配信ソース**: 坐雲堂アプリの画面そのまま（フルスクリーンの一場面＋環境音＋定時の鐘）を OBS でキャプチャ → YouTube Live。
  - 鐘の周期は企画書 L449–453「サーバー時刻同期」の思想に合わせ、配信とアプリで**同じ世界時計**を参照すると“同じ瞬間に同じ鐘”が成立。
  - **配信URLの選択肢**:
    - 固定座処：`?live=honden`（本堂）/`kare`/`umi`/`tsuki`/`neko`/`cho`
    - **座処ローテーション**：`?live=rotate`（または `?live=all`／`?rotate=<分>`）。各座処を一定間隔で巡回（既定10分／座処・1.6sクロスフェード）。**世界時計同期**なので、誰が見ても同じ瞬間に同じ座処。
    - 併用オプション：`&bell=<分>`（鐘の間隔）`&sound=0`（無音）`&caption=0`（下帯オフ）
  - **在席数オーバーレイ**：別ブラウザソースで `?count`（在席数＋過去24時間の延べ着席数だけを全画面表示）を重ねられる。
- **必要なもの**: YouTubeチャンネル（ライブ有効化＝電話確認＋24時間）、配信PC or 常時配信環境（OBS／低スペックでも可）、安定回線。
- **広告**: 配信に広告が入るかは設定/規約次第。瞑想体験を妨げないため、**収益化オフ**運用が理念に合う。

> アプリを“配信専用モード”（UIを隠して一場面＋鐘＋環境音だけ全画面）にする小改修も可能。必要なら指示ください。
