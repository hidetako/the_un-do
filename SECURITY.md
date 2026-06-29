# セキュリティ方針 — 一息（Issoku）／坐雲堂

本リポジトリは「**よろづやwebアプリ診断基準書 v2.2**（2026-04-12 / IPA4資料＋OWASP Top 10:2025＋医療情報ガイドライン第6.0版＋3省2ガイドライン＋安衛法・個情法を統合）」に準拠する。

ただし the_un-do は性質上、基準書の多くが**非該当**である：

- **静的サイト1枚**（`index.html`）。サーバ・認証・ユーザーアカウントが無い。DB書き込みは**集計カウンタ1つのみ**（下記・PIIなし）。
- **個人情報（PII）を一切収集・保存しない。** 位置はタイムゾーンからのおおまかな推定のみ（位置情報APIは使わない）、匿名。在室Presenceは**揮発（DB非書き込み）**。
  - **唯一の例外＝集計のみの書き込み**：`?count` ページ用に「過去24時間に座った延べ回数」を**時間別の集計値だけ**記録する（テーブル `zaundo_sit_hourly`：`hour`＋`cnt` のみ）。**セッションID・地域・端末情報など個人を識別しうる値は一切保存しない。** 書き込み/読み出しは SECURITY DEFINER 関数 `zaundo_bump_sit()` / `zaundo_sits_24h()` 経由のみで、テーブルは RLS 有効・anon 直接アクセス不可。
- **要配慮個人情報（医療情報）を扱わない** → 基準書 **Part J は全面的に非該当**。
- 外部依存は Supabase Realtime Presence（在室の気配の共有のみ）と Google Fonts。

そのため、実際に適用されるのは主に **Part H（セキュリティヘッダ）／A-5・A-9（XSS・クリックジャッキング）／G-2・G-3・G-8（サプライチェーン・設定・暗号）／I-1・I-2（Supabase/Vercel固有）** である。

---

## 適用状況マトリクス

凡例：✅=対応済 ／ ⚠=要対応（下記参照） ／ N/A=非該当（理由付き）

### Part A｜脆弱性対策

| 項目 | 状況 | 備考 |
|---|---|---|
| A-1 SQLインジェクション | N/A | DBへのクエリをアプリから組み立てない（Realtime Presenceのみ・SQL無し） |
| A-2 OSコマンドインジェクション | N/A | サーバ処理が無い |
| A-3 ディレクトリトラバーサル | N/A | 動的ファイルアクセス無し |
| A-4 セッション管理 | N/A | ログイン・セッション無し |
| A-5 XSS | ✅ | 出力は静的。CSP（`script-src` を self+esm.sh に限定）を `<meta>`＋ヘッダで多重化。Content-Type charset は `<meta charset="utf-8">` で指定 |
| A-6 CSRF | N/A | 状態変更操作・フォーム送信が無い |
| A-7/A-8 ヘッダ/メールインジェクション | N/A | サーバでのヘッダ・メール生成が無い |
| A-9 クリックジャッキング | ✅ | `frame-ancestors 'none'`＋`X-Frame-Options: DENY`（vercel.json / _headers） |
| A-10 バッファオーバーフロー | N/A | メモリ直接操作の無い言語（JS） |
| A-11 アクセス制御 | N/A | 認証・認可対象のリソースが無い |

### Part G｜OWASP Top 10:2025 追加

| 項目 | 状況 | 備考 |
|---|---|---|
| G-1 SSRF | N/A | サーバからの外部リクエスト機能が無い |
| G-2 サプライチェーン | ✅ | esm.sh の Supabase JS を浮動 `@2` から **`@2.108.2` に固定**（G-2-1）。CDN由来スクリプトは `script-src` 許可リストで限定。`npm`等のビルド依存は無し |
| G-3 設定ミス | ✅ | CORS等のワイルドカード不使用。全レスポンスにセキュリティヘッダ（G-3-6）。ディレクトリ一覧はホスト側で無効（要デプロイ時確認） |
| G-4 安全でない設計 | ⚠ | **下記「重要：Supabaseプロジェクト分離」を参照（最重要）** |
| G-5/G-6/G-7 完全性/ログ/例外 | N/A | サーバ・CI実行時処理が無い（GitHubのブランチ保護は推奨：G-5-4） |
| G-8 暗号化 | ✅ | HTTPS前提（HSTS）。秘密鍵のハードコード無し。publishableキーは公開前提のキー（秘密情報ではない／G-8-3非抵触） |
| G-9 LLM入力サニタイズ | N/A | LLM API連携が無い |

### Part H｜モダンセキュリティヘッダ（全レスポンス）

| ヘッダ | 設定 | 配信元 |
|---|---|---|
| Content-Security-Policy | `default-src 'self'` 基調。script=self+esm.sh、style=self+Google Fonts、connect=self+ghqプロジェクト(REST/wss)、`object-src 'none'`/`base-uri 'self'`/`form-action 'self'`/`frame-ancestors 'none'`/`upgrade-insecure-requests` | `<meta>`（frame-ancestors除く）＋ vercel.json / _headers |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains` | vercel.json / _headers |
| X-Content-Type-Options | `nosniff` | 同上 |
| X-Frame-Options | `DENY` | 同上 |
| Referrer-Policy | `strict-origin-when-cross-origin` | `<meta name=referrer>`＋ヘッダ |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=()`（位置情報APIを使わない設計の裏打ち） | vercel.json / _headers |
| Cross-Origin-Opener-Policy | `same-origin` | 同上 |

> 既知の逸脱（リスク受容）：`script-src`/`style-src` に `'unsafe-inline'` を許可している。理由＝「1枚で動く」設計を保つためインライン `<style>`・`<script>`・`onload` 属性を使用。**PII・認証が無くXSSの被害資産がほぼ無い**ため、Part F のリスク区分上「低」と判断。将来ビルド工程（バンドラ）を入れる場合は、JS/CSSを外部ファイル化し nonce/hash 方式へ移行して `'unsafe-inline'` を撤廃する（H-1 完全準拠への道筋）。

> HSTS `preload` は付けていない。ドメイン（issoku.org 等）確定・HTTPS安定運用の確認後に hstspreload.org へ登録し `preload` を追加する（基準 H-2 の注記に従う）。

### Part I｜よろづやアーキテクチャ固有

| 項目 | 状況 | 備考 |
|---|---|---|
| I-1-A RLS | ⚠ | 接続先 ghq の全公開テーブルは RLS 有効を確認済。ただし下記の分離課題あり |
| I-1-B キー管理 | ✅ | `service_role` キーはクライアントに**含まれていない**。露出しているのは publishable キーのみ（I-1-B-2 適合） |
| I-1-C MFA等 | ⚠ | Supabase Dashboard の MFA は組織運用側で有効化推奨（I-1-C-3） |
| I-2 Vercel | ✅ | `NEXT_PUBLIC_` 機密混入無し（ビルド無し）。セキュリティヘッダを `vercel.json` で配信（I-2-3） |
| I-4 CORS/レート | ✅ | CORSワイルドカード不使用。Realtime は `eventsPerSecond: 2` でクライアント側レート抑制 |

---

## 重要：Supabaseプロジェクト分離（基準 G-4 / I-1-B-1）— 最優先の設計課題

**現状**：本サイトは公開・匿名でありながら、**よろづやの内部司令システム `yorozuya-ghq`（プロジェクト `dcxoouslwkfohdbacipa`）のpublishableキー**を `index.html` に埋め込んで間借りしている。ghq には業務データ（`messages`／`artifacts`／`audit_logs`／`ghq_manager_comments` 13,764行 ほか）が存在する。

**評価**：現時点では ghq の全テーブルで RLS が有効なため即時の漏洩は無い。しかし基準 **I-1-B-1**（「anon/publishableキーは露出して安全という前提は、RLSが正しく機能していることが条件」）と **G-4**（最小権限・安全な設計）の観点では、**公開サイトに内部システムのキーを置くこと自体が設計上のリスク**である：

1. ghq に将来 RLS 未設定のテーブルが1つでも増えれば、その瞬間に全世界へ露出する。
2. Realtime の認可設定次第で、`zaundo-hall` 以外のチャネル購読や postgres_changes 受信の余地が生じうる。
3. 公開キーと内部アプリのキーが共通＝障害・侵害のブラスト半径が結合する。

**推奨対応**：the_un-do 専用の Supabase プロジェクト（在室Presenceのみ・テーブル0）を新設し、URL とキーをそれへ差し替える。公開キーが触れる対象を「何も無い」状態にして分離する。

- 影響：`index.html` の `SB_URL`／`SB_KEY`、本ファイル、`vercel.json`／`_headers` の `connect-src` ホストを更新。
- 留意：同組織は既に2プロジェクト稼働中（Freeの上限）。3つ目の常時稼働には有料プラン化か既存の一時停止が要る可能性がある。

**判断（2026-06-25）**：上記の留意（無料枠の上限）を踏まえ、**当面は ghq の間借りを据え置き＝未分離リスクを受容**する。前提（ghq 全テーブルの RLS 有効）が崩れないことを公開前および定期点検で確認する。**無料枠が空き次第、専用プロジェクトへ分離する**（本項を再評価）。なお ghq に新規テーブルを追加する際は、RLS を必ず有効化してから公開キーの露出範囲を再確認すること。

**追記（2026-06-29）**：`?count`（過去24時間の延べ着席数）のため、ghq に **集計専用テーブル `zaundo_sit_hourly`（`hour`＋`cnt` のみ・PIIなし）** と関数 `zaundo_bump_sit()` / `zaundo_sits_24h()` を追加した。RLS を有効化し**ポリシーを置かない**ことで anon の直接 select/insert を不可とし、公開（anon）キーで触れるのは上記2関数（集計値の +1 と合計取得）のみ＝**業務データ（messages/artifacts等）への露出は増えていない**。上記方針どおり「RLS 有効化＋露出範囲の再確認」を実施済み。

---

## 診断サイクル（基準 F-2 を本リポジトリ向けに縮約）

- 公開（デプロイ）前：本マトリクスの ✅/⚠ を再確認。CSP違反がブラウザコンソールに出ないことを確認。
- 依存更新時：esm.sh 固定バージョンを明示的に更新し、Realtime動作を再確認。
- 四半期：Part H ヘッダの実配信を securityheaders.com 等で監査。
