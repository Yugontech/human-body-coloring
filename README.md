# 人型シルエット 4色塗りWebアプリ

`assets/silhouette.svg` 専用の塗り絵アプリです。  
HTML / CSS / Vanilla JavaScript だけで動作します（ビルド不要）。

## ファイル構成

- `index.html`
- `styles.css`
- `app.js`
- `assets/silhouette.svg`

## 起動方法

- `index.html` を直接開いて起動できます。
- 簡易サーバー経由でも起動できます。

```bash
cd /path/to/your-repo
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。

## 実装ポイント

- 2レイヤー構成:
  - `paintCanvas`: 塗りレイヤー
  - `outlineCanvas`: 輪郭線レイヤー（最前面）
- `silhouette.svg` の `viewBox` / `path` を `app.js` に固定定義して `Path2D` 化
- マスク生成:
  - `Path2D` の塗りをマスクに使い、`destination-in` で外側描画を除去
  - 輪郭線付近はマスクから除外し、線を塗りつぶしにくくしている
- 輪郭表示:
  - SVG の線色 / 線幅を使って輪郭専用レイヤーを生成
- 操作:
  - 4色パレット / 消しゴム / クリア / Undo（最大20）/ PNG保存
  - ブラシサイズ（2〜40）
  - Pointer Events でマウス / タッチ / ペン対応
- 描画品質:
  - 高DPI対応（`devicePixelRatio`）
  - リサイズ時も描画内容を保持して再描画

## 動作確認想定ブラウザ

- Google Chrome
- Microsoft Edge
- Safari

## GitHub Actionsで自動デプロイ（GitHub Pages）

このリポジトリには `/.github/workflows/deploy-pages.yml` を同梱しています。  
`main` ブランチに push すると、自動で GitHub Pages にデプロイされます。

事前設定:

1. GitHub リポジトリの `Settings` → `Pages` を開く
2. `Build and deployment` の `Source` を `GitHub Actions` にする
3. `main` に push する（または Actions タブから手動実行）
