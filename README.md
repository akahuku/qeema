qeema
==========

# これはなに？

qeema は Chrome、Presto Opera、Firefox で動作するキーボード管理ライブラリです。
通常 javascript でキーボードを管理するには keydown、keypress イベントに加え、
input、DOM3 Composition Event などをすべてリスンする必要があります。また、
キーボード周りはブラウザごとの差異が最も大きい要素の一つでもあるため制御は
非常に煩雑です。

qeema はそれらを吸収し、統合された単一のキー入力イベントを生成します。



# キー入力イベントが取り扱うキー

* 表示可能な文字
* Compose キーを用いて入力された、表示可能な文字
* PageUp、PageDown などの機能キー
* IME を通して入力された文字



# キー入力イベントのプロパティ

* code (number): 入力された文字のコードポイント。ただし、機能キーの場合は負の値
* char (string): 入力された文字そのもの。機能キーの場合は "<機能キー名>"
* key (string): 入力されたキーストローク。Shift、Ctrl、Alt が押されている場合に
  "S-"、"C-"、"A-" が付加される
* shift (boolean): Shift キーが押されていたとき true
* ctrl (boolean): Ctrl キーが押されていたとき true
* alt (boolean): Alt キーが押されていたとき true
* isSpecial (boolean): 機能キーであるとき true
* isCompositionedFirst (boolean): IME を通して入力された文字列の先頭であるとき true
* isCompositionedLast (boolean): IME を通して入力された文字列の最後であるとき true



# キー入力イベントのリスン

qeema.js を読み込むと、グローバルオブジェクトに qeema オブジェクトが追加されま
す。以下のコードでイベントをリスンします。

`qeema.install();
qeema.addListener(function (e) {
    // e がキー入力イベント
});`

`qeema.install()` は最初に 1 度だけ呼びます。このリスナーが false を返すことに
より、キー入力のデフォルトのアクションを取り消すことができます。



# その他のイベント

* compositionstart
* compositionupdate
* compositionend
* log

以下のコードでリスンすることができます:

`qeema.addListener('compositionstart', function (e) {
	// e.data が変換開始文字列 - 実質的に常に空文字
});`

`qeema.addListener('compositionupdate', function (e) {
	// e.data が変換中の文字列。このイベントは変換中複数発生します
});`

`qeema.addListener('compositionend', function (e) {
	// e.data が変換確定文字列
});`

`qeema.addListener('log', function (e) {
	// e.message がログされた文字列
});`



# キー入力のバッファリング

# キー入力のエミュレート

# キー入力と非同期処理

# 認識する機能キー名

* backspace
* tab
* enter
* pause
* esc
* space
* pageup
* pagedown
* end
* home
* left
* up
* right
* down
* insert
* delete
* os
* f1
* f2
* f3
* f4
* f5
* f6
* f7
* f8
* f9
* f10
* f11
* f12
* scrolllock
