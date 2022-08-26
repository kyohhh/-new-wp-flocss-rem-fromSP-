/*
src 参照元を指定
dest 出力先を指定
watch ファイルを監視する
series(順番に処理)とparallel(同時に処理)
*/

/* package */
const { src, dest, watch, series, parallel } = require("gulp");
// const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const sassGlob = require("gulp-sass-glob");
const mmq = require("gulp-merge-media-queries");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");
const cleanCSS = require("gulp-clean-css");
const cssnext = require("postcss-cssnext")
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");


 // WordPress theme name
// const themeDir = "WordPressTheme";

// ソースフォルダ
const srcPath = {
	css: './src/sass/**/*.scss',
	php: "./src/*.php",
	js: "./src/js/**/*.js",
	img: "./src/images/**/*",
}

// WordPress Localフォルダのディレクトリ
const userDir = require("os").homedir(); //ユーザーディレクトリを指定
const themeDir = `${userDir}/Local Sites/○○/app/public/wp-content/themes/○○`; //テーマディレクトリを指定

//ファイルの吐き出し
const destPath = {
	css: `${themeDir}/assets/css`,
	php: `${themeDir}/`,
	js: `${themeDir}/assets/js/`,
	img: `${themeDir}/assets/images/`,
}

// =======
// ブラウザーシンク（リアルタイムでブラウザに反映させる処理）
// =======
const browserSync = require("browser-sync");
const browserSyncFunc = () => {
	browserSync.init({
    	proxy: "http://○○.local/", //Localのドメインを指定
	});
};
const browserSyncReload = (done) => {
	browserSync.reload();
	done();
};


// =======
// phpファイルのコピー
// =======

const phpDest = () => {
	return src(srcPath.php)
		.pipe(
			//エラーが発生しても処理を続ける、タスクが完了したらメッセージを表示orエラーメッセージを表示
			plumber({
			errorHandler: notify.onError("Error: <%= error.message %>"),
			})
		)
		.pipe(dest(destPath.php));
};

/* compile sass */
// gulp.task("sass", function() {
// return gulp

// =======
// JS圧縮
// =======
const uglify = require("gulp-uglify");
const jsMin = () => {
	return src(srcPath.js)
    .pipe(
		plumber({
			errorHandler: notify.onError("Error: <%= error.message %>"),
		})
    )
    .pipe(dest(destPath.js))
    .pipe(uglify()) //JSファイルを圧縮
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest(destPath.js));
};

// =======
// Sass >> css
// =======
const cssSass = () => {
	return src(srcPath.css)
		.pipe(sourcemaps.init())
		.pipe(
			// エラーが起きても処理を続ける
			plumber({
				errorHandler: notify.onError('Error:<%= error.message %>')
			}))
		.pipe(sassGlob())
		.pipe(sass({ outputStyle: 'expanded' })) //指定できるキー expanded compressed
		.pipe(postcss([autoprefixer({ // autoprefixer
			grid: true
		})]))
		.pipe(postcss([cssdeclsort({ // sort
			order: "alphabetical"
		})]))
		.pipe(mmq()) // media query mapper
		.pipe(dest(destPath.css))
		.pipe(cleanCSS())
		.pipe(rename({ extname: '.min.css' })) //ファイル名を変更
		.pipe(sourcemaps.write('./map'))
		.pipe(dest(destPath.css))
		.pipe(notify({
			message: 'Sassをコンパイルしたよ〜^^/',
			onLast: true
		}))
}

// =======
// 画像圧縮
// =======
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");

const imageCompression = () => {
	return src(srcPath.img)
    .pipe(
		imagemin(
			[
				mozjpeg({ quality: 80 }), //画質
				pngquant({
					quality: [0.6, 0.7], // 画質
					speed: 1, // スピード
				}),
				imagemin.svgo(),
			],
			{
				verbose: true, //ログを吐き出す
			}
		)
    )
    .pipe(dest(destPath.img));
};


// ファイル変更を検知
const watchFiles = () => {
	watch(srcPath.php, series(phpDest, browserSyncReload));
	watch(srcPath.css, series(cssSass, browserSyncReload))
	watch(srcPath.js, series(jsMin, browserSyncReload));
	watch(srcPath.img, series(imageCompression, browserSyncReload))
}

// npx gulpで出力する内容
exports.default = series(
	// series(cssSass),
	series(phpDest, cssSass, jsMin, imageCompression), //順番に処理
	parallel(watchFiles, browserSyncFunc) //同時に処理
	);
