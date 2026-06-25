# 人型シルエット 4色塗りWebアプリ

`silhouette.svg` 専用の塗り絵アプリです。  
HTML / CSS / Vanilla JavaScript だけで動作します（ビルド不要）。

## ファイル構成

- `index.html`
- `styles.css`
- `app.js`
- `silhouette.svg`

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
  - `insidePaintGroup`: 人型の中に描いたSVGストローク
  - `outsidePaintGroup`: 人型の外に描いたSVGストローク
  - `insideEraserMaskGroup` / `outsideEraserMaskGroup`: 消しゴム用SVGマスク
  - `silhouette-outline`: 輪郭線（最前面）
- 起動時に `silhouette.svg` の `viewBox` / 最初の `path` を読み取り、インラインSVGとして表示
- マスク生成:
  - `clipPath` で人型シルエットの内側だけに描画を制限
  - 輪郭線がアウトライン化されたcompound pathの場合は、内側サブパスを塗り領域として使用
  - 消しゴムはSVGマスクに黒いストロークを追加して、塗りストロークを非表示化
- 輪郭表示:
  - SVG の線色 / 線幅を使って輪郭線を最前面に描画
- 操作:
  - 4色パレット / 消しゴム / すべて消去 / 元に戻す・やり直し（最大20）/ PNG保存 / SVG保存
  - ブラシ太さプリセット（5 / 10 / 15 / 20px）
  - 描画範囲切り替え（人の中 / 人の外）
  - キャンバス上部に現在の描画範囲（人の中 / 人の外）とツール（ブラシ / 消しゴム）を表示
  - キャンバス拡大縮小（50%〜250%）
  - 拡大中はミニマップで現在表示している位置を確認可能
  - PC表示ではサイドバー幅をドラッグまたはキーボードで調整可能
  - スマートフォンでは初回だけ操作ガイドを表示し、2本指ピンチで焦点位置を保った拡大縮小、2本指移動でパンに対応
  - すべて消去は確認ダイアログで誤操作を防止
  - ID入力欄（保存時ファイル名に反映）
  - Pointer Events でマウス / タッチ / ペン対応
  - web/モバイル表示ともに凡例の表示/非表示をトグル可能
- SVG保存:
  - ペイントと消しゴムをSVGの `path` として保存
  - 各ストロークに `data-order` / `data-tool` / `data-region` / `data-color` / `data-brush-size` / `data-created-at` を付与
  - `<metadata>` 内に描画順付きのJSON履歴を埋め込み
  - 非表示の `paint-history` グループにも描画順でストローク履歴を保存
- 描画品質:
  - 表示中のシルエット・塗り・消しゴムはSVG要素として保持
  - キャンバス表示は `silhouette.svg` の `viewBox` 比率に合わせた長方形
  - 拡大表示時も輪郭とストロークはベクターとして描画
  - 拡大縮小時は表示中心またはピンチ位置を基準にスクロール位置を補正
  - PNG保存時のみSVGを高解像度（長辺2500px）にラスタライズ

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
