# wp-flocss-rem-fromSPの使い方
**wp-flocss-rem-fromSPをカスタムしてみました**

- 構成
	- src
		- images
		- js
		- sass
		- *.php
	- .gitignore
	- gulpfile.js
	- index.php
	- package.json


## できるようになること
- phpファイルのコピー
- jsの圧縮
- 画像の圧縮
- sassのコンパイル＆圧縮
**Dart Sass非対応**
- ブラウザシンク（自動リロード）


## gulpfile.js
- WordPress Localフォルダのディレクトリ
	- 変更する
- ブラウザーシンク
	- Localのドメインを指定
- ソースフォルダ・ファイルの吐き出し場所は必要に応じて変更する


## src
### php
- src内のphpファイルに記述

### JSの記述
- src内のjsフォルダ内
- 自動圧縮してくれる

### 画像
- src内のimagesフォルダ内に入れる
- 必要に応じてフォルダを作成してその中にいれる
- 自動圧縮してくれる

### sass
- src内のsassフォルダ内に記述

## 使い方
- npm i でインストール → node_modulesが生成される
- npx gulp で起動 → WordPress Localフォルダのディレクトリが生成される
	- 直下に『style.css』を作成し、以下の記述をする（テーマ名は、任意）

style.css
```css
/*
Theme Name: 〇〇
*/

```

# -new-wp-flocss-rem-fromSP-
