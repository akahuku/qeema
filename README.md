qeema
==========

# これはなに？

qeema は Chrome、Presto Opera、Firefox で動作するキーボード管理ライブラリです。通常 javascript でキーボードを管理するには keydown、keypress イベントに加え、 input、DOM3 Composition Event などをすべてリスンする必要があります。また、 キーボード周りはブラウザごとの差異が最も大きい要素の一つでもあるため制御は 非常に煩雑です。

qeema はそれらを吸収し、統合された単一のキー入力イベントを生成します。



# キー入力イベントが取り扱うキー

* 表示可能な文字
* Compose / Ctrl+Alt キーを用いて入力された、表示可能な文字
* IME を通して入力された、表示可能な文字
* PageUp、PageDown などの機能キー



# キー入力イベントのプロパティ

* code (number): 入力された文字のコードポイント。ただし、機能キーの場合は負の値
* char (string): 入力された文字そのもの。機能キーの場合は "<機能キー名>"
* key (string): 入力されたキーストローク。機能キーについて Shift、Ctrl、Alt が押されている場合に "S-"、"C-"、"A-" が付加される
* shift (boolean): Shift キーが押されていたとき true
* ctrl (boolean): Ctrl キーが押されていたとき true
* alt (boolean): Alt キーが押されていたとき true
* isSpecial (boolean): 機能キーであるとき true
* isCompositioned (boolean): IME を通して入力された文字列であるとき true
* isCompositionedFirst (boolean): IME を通して入力された文字列の先頭であるとき true
* isCompositionedLast (boolean): IME を通して入力された文字列の最後であるとき true



# キー入力イベントのリスン

qeema.js を読み込むと、グローバルオブジェクトに qeema オブジェクトが追加されます。以下のコードでイベントをリスンします。

```
qeema.install();
qeema.addListener(function (e) {
    // e がキー入力イベント
});
```

`qeema.install()` は最初に 1 度だけ呼びます。登録したキー入力イベントのリスナーで false を返すことにより、キー入力のデフォルトのアクションを取り消すことができます。アクションの取り消しの対象は IME を通した文字列の入力も含まれます。



# その他のイベント

* input
* compositionstart
* compositionupdate
* compositionend
* log

以下のコードでリスンすることができます:

```
qeema.addListener('input', function (e) {
	// e がキー入力イベント
});
```
`qeema.addListener(function (e) { ...})` は input イベントに対するハンドラ登録のショートカットです。

```
qeema.addListener('compositionstart', function (e) {
	// e.data が変換開始文字列 - 実質的に常に空文字
});
```

```
qeema.addListener('compositionupdate', function (e) {
	// e.data が変換中の文字列。このイベントは変換中複数発生します
});
```

```
qeema.addListener('compositionend', function (e) {
	// e.data が変換確定文字列
});
```

```
qeema.addListener('log', function (e) {
	// e.message がログされた文字列
});
```



# キー入力のバッファリング

# キー入力のエミュレート

# キー入力と非同期処理

# 認識する機能キー名とコード

* backspace (-8)
* tab (-9)
* enter (-13)
* pause (-19)
* esc (-27)
* space (-32)
* pageup (-33)
* pagedown (-34)
* end (-35)
* home (-36)
* left (-37)
* up (-38)
* right (-39)
* down (-40)
* insert (-45)
* delete (-46)
* os (-91)
* f1 (-112)
* f2 (-113)
* f3 (-114)
* f4 (-115)
* f5 (-116)
* f6 (-117)
* f7 (-118)
* f8 (-119)
* f9 (-120)
* f10 (-121)
* f11 (-122)
* f12 (-123)
* scrolllock (-145)
