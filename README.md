# モフケア LP(事前登録ページ)

「モフケア」— やさしいセルフケア習慣アプリ(iOS)の事前登録ランディングページ。

公開URL: https://koshiro740-alt.github.io/mofucare-lp/

## 構成

ビルド不要の静的1ページです。

- `index.html` — ページ本体
- `style.css` — スタイル(モバイルファースト)
- `main.js` — 事前登録フォーム送信・見出しA/Bテスト・計測イベント
- `vendor-count.js` — GoatCounter の計測スクリプト(同梱・[ISCライセンス](https://opensource.org/licenses/ISC))
- `assets/` — 画像(mofucare 本体リポの素材から生成)

## しくみ

- **事前登録フォーム**: Supabase の `preregistrations` テーブルに REST API で直接 insert。
  テーブル定義は mofucare 本体リポの `supabase/migrations/20260711090000_preregistrations.sql`。
  RLS で insert のみ許可(select 不可)なので、埋め込んである publishable キーから登録済みメールは読み出せません。
- **A/Bテスト**: `?v=b` を付けるとヒーロー見出しが2案目に切り替わり、登録時に `variant` カラムへ記録されます。
- **計測**: GoatCounter(Cookie 不使用)。サイトコード `mofucare`。登録完了時に `preregister-a` / `preregister-b` イベントを送信。

## 更新のしかた

ファイルを編集して main ブランチに push すると GitHub Pages に反映されます(数分かかります)。

画像を作りなおすときは mofucare 本体リポの素材から生成します(生成スクリプトはLP制作セッションのログ参照。合成は body_stage3 + 表情パーツの重ね合わせ)。
