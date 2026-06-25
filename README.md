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

- SVGレイヤー構成:
  - `silhouetteFill`: 白い人型シルエット
  - `paintGroup`: ユーザーが描いたSVGストローク
  - `eraserMaskGroup`: 消しゴム用SVGマスク
  - `silhouette-outline`: 輪郭線（最前面）
- `silhouette.svg` の `viewBox` / `path` を `app.js` に固定定義し、インラインSVGとして表示
- マスク生成:
  - `clipPath` で人型シルエットの内側だけに描画を制限
  - 消しゴムはSVGマスクに黒いストロークを追加して、塗りストロークを非表示化
- 輪郭表示:
  - SVG の線色 / 線幅を使って輪郭線を最前面に描画
- 操作:
  - 4色パレット / 消しゴム / すべて消去 / 一つ前に戻る（最大20）/ PNG保存
  - ブラシ太さプリセット（5 / 10 / 15 / 20px）
  - ID入力欄（保存時ファイル名に反映）
  - Pointer Events でマウス / タッチ / ペン対応
  - web/モバイル表示ともに凡例の表示/非表示をトグル可能
- 描画品質:
  - 表示中のシルエット・塗り・消しゴムはSVG要素として保持
  - 拡大表示時も輪郭とストロークはベクターとして描画
  - PNG保存時のみSVGを高解像度（2500px四方）にラスタライズ

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
