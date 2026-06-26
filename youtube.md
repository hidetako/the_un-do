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

**有効化手順**: `const YT_LIVE_URL = '';` に配信URL（例 `https://www.youtube.com/@issoku/live`）を入れてデプロイするだけ。

---

## 2. YouTube側の素材（コピー）— そのまま貼れる雛形

### チャンネル名（案）
- 一息 — 坐雲堂 ｜ Issoku Zazen Hall
- （ハンドル例）`@issoku`

### チャンネル概要（About）
> 一息（Issoku）— 24時間ひらく、世界の坐禅堂「坐雲堂（The Un-do）」。
> 一人だけど、みんなと一緒に坐る。流れている堂を眺めても、実際に坐ってもいい。
> ▶ 坐るアプリ: https://the-un-do.vercel.app/
> Presented by よろづソリューションズ（Yorozu Solutions）

### ライブ配信タイトル（日英）
- 【ライブ】坐雲堂 — 一緒に坐る／鐘と環境音 ｜ zazen "sit with me" live
- 【LIVE】The Un-do — sit with me ｜ zen bell & ambience（24/7）

### 概要欄テンプレ
> 世界のどこかの誰かと、黙って同じ時に坐る。坐雲堂（The Un-do）の常時ライブです。
> 眺めるだけでも、一緒に坐っても。実際に坐る（姿勢・座処・鐘・線香・在室の灯り）はアプリで。
>
> ▶ 坐るアプリ（一息 Issoku）: https://the-un-do.vercel.app/
> ・24時間、世界のどこからでも。ひと息、入れる。
> ・記録で競わせない。手放す（只管打坐）。
>
> Sit quietly, at the same time as someone, somewhere. The full practice (posture, seats, bell, incense, live presence) is in the app:
> ▶ https://the-un-do.vercel.app/
>
> Presented by よろづソリューションズ / Yorozu Solutions
> #zazen #meditation #studywithme #坐禅 #瞑想 #作業用

### 固定コメント
> ▶ 実際に坐るアプリはこちら → https://the-un-do.vercel.app/ ｜ 24時間ひらいています。一息、どうぞ。

### 画面オーバーレイ（下帯・常時表示）
> 一息 issoku｜坐るアプリは概要欄から → the-un-do.vercel.app

---

## 3. 表口の配信そのもの（次段：option 2 の準備メモ）

24h常時ライブを出す場合の最小構成（あなた側の準備）:

- **配信ソース**: 坐雲堂アプリの画面そのまま（フルスクリーンの一場面＋環境音＋定時の鐘）を OBS でキャプチャ → YouTube Live。
  - 鐘の周期は企画書 L449–453「サーバー時刻同期」の思想に合わせ、配信とアプリで**同じ世界時計**を参照すると“同じ瞬間に同じ鐘”が成立。
- **必要なもの**: YouTubeチャンネル（ライブ有効化＝電話確認＋24時間）、配信PC or 常時配信環境（OBS／低スペックでも可）、安定回線。
- **広告**: 配信に広告が入るかは設定/規約次第。瞑想体験を妨げないため、**収益化オフ**運用が理念に合う。

> アプリを“配信専用モード”（UIを隠して一場面＋鐘＋環境音だけ全画面）にする小改修も可能。必要なら指示ください。
