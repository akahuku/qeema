document.addEventListener('DOMContentLoaded', function () {
	var rulerTimer;

	function $ (id) {
		return document.getElementById(id);
	}

	function dolog (str) {
		var t1 = $('t1');
		var pad = t1.value == '' ? '' : '\n';
		t1.value += pad + str;
		t1.scrollTop = Math.max(0, t1.scrollHeight - t1.clientHeight);
	}

	function log (str) {
		dolog(str);

		if (rulerTimer) {
			clearTimeout(rulerTimer);
		}

		rulerTimer = setTimeout(function () {
			dolog('----------');
			rulerTimer = null;
		}, 1000);
	}

	function escape (s) {
		return ('' + s).replace(/[\u0000-\u001f\u007f]/g, function ($0) {
			return '^' +
				   ($0 == '\u007f' ? '_' : String.fromCharCode($0.charCodeAt(0) + 64));
		});
	}

	function getModifiers (e) {
		result = [];
		if (e.shift) result.push('S');
		if (e.ctrl) result.push('C');
		if (e.alt) result.push('A');
		return (result.join('') + '---').substr(0, 3);
	}

	function getComposition (e) {
		result = [];
		if (e.isCompositioned) result.push('yes');
		if (e.isCompositionedFirst) result.push('(first)');
		if (e.isCompositionedLast) result.push('(last)');
		if (result.length == 0) result.push('no');
		return result.join(' ');
	}

	function repeat (s, len) {
		var result = '';
		for (var i = 0; i < len; i++) {
			result += s;
		}
		return result;
	}

	function lset (s, len) {
		return (s + repeat(' ', len)).substring(0, len);
	}

	function rset (s, len) {
		return (repeat(' ', len) + s).substr(-len);
	}

	function keydown (e) {
		if (e.shiftKey && e.keyCode == 16 || e.ctrlKey && e.keyCode == 17 || e.altKey && e.keyCode == 18) return;
		if ($('p2').checked) {
			log('keydown:  keyCode: ' + rset(e.keyCode, 3) + '    charCode: ' + rset(e.charCode, 3));
		}
	}

	function keypress (e) {
		if ($('p2').checked) {
			log('keypress: keyCode: ' + rset(e.keyCode, 3) + '    charCode: ' + rset(e.charCode, 3));
		}
	}

	function keyup (e) {
		if (e.shiftKey && e.keyCode == 16 || e.ctrlKey && e.keyCode == 17 || e.altKey && e.keyCode == 18) return;
		if ($('p2').checked) {
			log('keyup:    keyCode: ' + rset(e.keyCode, 3) + '    charCode: ' + rset(e.charCode, 3));
		}
	}

	function paste (e) {
		log('paste event fired');
	}

	// test
	function testParseKeyDesc () {
		var last;
		var vie = qeema.VirtualInputEvent;
		try {
			[
				// key desc                          code                           char      key             shift  ctrl   alt    isspecial
				['a',                  new vie(null, 97,                            'a',      'a',            false, false, false, false)],

				['\ue000<space>',      new vie(null, 32,                            ' ',      ' ',            false, false, false, true)],
				['\ue000#1',           new vie(null, -112,                          '',       '<f1>',         false, false, false, true)],
				['\ue000<C-a>',        new vie(null, 1,                             '\u0001', '\u0001',       false, true,  false, false)],
				['\ue000<esc>',        new vie(null, 27,                            '\u001b', '\u001b',       false, false, false, true)],
				['\ue000<S-esc>',      new vie(null, -(0x8000 | 27),                '\u001b', '<S-esc>',      true,  false, false, true)],
				['\ue000<delete>',     new vie(null, 127,                           '\u007f', '\u007f',       false, false, false, true)],
				['\ue000<A-PageDown>', new vie(null, -(0x2000 | 34),                '',       '<A-pagedown>', false, false, true,  true)],
				['\ue000<A-s>',        new vie(null, -(0x2000 | 'S'.charCodeAt(0)), '',       '<A-S>',        false, false, true,  false)],
				['\ue000<A-GT>',       new vie(null, -(0x2000 | '>'.charCodeAt(0)), '',       '<A-GT>',       false, false, true,  false)],
				['\ue000<A-LT>',       new vie(null, -(0x2000 | '<'.charCodeAt(0)), '',       '<A-LT>',       false, false, true,  false)],
				['\ue000<bar>',        new vie(null, '|'.charCodeAt(0),             '|',      '<bar>',        false, false, false, false)]
			].forEach(function (t, index) {
				try {
					var a = qeema.parseKeyDesc(last = t[0]);
					for (var i in a.prop) {
						if (a.prop[i] != t[1][i]) {
							throw new Error(
								'property "' + i + '":' +
								' expected: ' + escape(t[1][i]) +
								', actual: ' + escape(a.prop[i]));
						}
					}
				}
				catch (e) {
					log('*** parseKeyDesc #' + index + ' "' + t[0] + '" FAILED ***');
					throw e;
				}
			});
			return true;
		}
		catch (e) {
			log('exception: ' + e.message);
			console.log(last + ': ' + e.message);
			debugger;
			last != undefined && qeema.parseKeyDesc(last);
		}
	}

	function testObjectFromCode () {
		var last;
		var vie = qeema.VirtualInputEvent;
		try {
			[
				// code                              code                           char      key             shift  ctrl   alt    isspecial
				[97,                   new vie(null, 97,                            'a',      'a',            false, false, false, false)],

				[32,                   new vie(null, 32,                            ' ',      ' ',            false, false, false, true)],
				[-112,                 new vie(null, -112,                          '',       '<f1>',         false, false, false, true)],
				[1,                    new vie(null, 1,                             '\u0001', '\u0001',       false, true,  false, false)],
				[27,                   new vie(null, 27,                            '\u001b', '\u001b',       false, false, false, true)],
				[-32795,               new vie(null, -(0x8000 | 27),                '\u001b', '<S-esc>',      true,  false, false, true)],
				[127,                  new vie(null, 127,                           '\u007f', '\u007f',       false, false, false, true)],
				[-8226,                new vie(null, -(0x2000 | 34),                '',       '<A-pagedown>', false, false, true,  true)],
				[-8275,                new vie(null, -(0x2000 | 'S'.charCodeAt(0)), '',       '<A-S>',        false, false, true,  false)],
				[-8254,                new vie(null, -(0x2000 | '>'.charCodeAt(0)), '',       '<A-GT>',       false, false, true,  false)],
				[-8252,                new vie(null, -(0x2000 | '<'.charCodeAt(0)), '',       '<A-LT>',       false, false, true,  false)],
				[124,                  new vie(null, '|'.charCodeAt(0),             '|',      '|',            false, false, false, false)]
			].forEach(function (t, index) {
				try {
					var a = qeema.objectFromCode(last = t[0]);
					for (var i in a) {
						if (a[i] != t[1][i]) {
							throw new Error(
								'property "' + i + '":' +
								' expected: ' + escape(t[1][i]) +
								', actual: ' + escape(a[i]));
						}
					}
				}
				catch (e) {
					log('*** objectFromCode #' + index + ' "' + t[0] + '" FAILED ***');
					throw e;
				}
			});
			return true;
		}
		catch (e) {
			log('exception: ' + e.message);
			console.log(last + ': ' + e.message);
			debugger;
			last != undefined && qeema.objectFromCode(last);
		}
	}

	// boot

	[document].forEach(function (target) {
		target.addEventListener('keydown', keydown, false);
		target.addEventListener('keypress', keypress, false);
		target.addEventListener('keydown', keyup, false);
		target.addEventListener('paste', paste, false);
	});

	qeema
		.install()
		.addListener(function (e) {
			log(
				'[code: ' + rset(e.code, 6) + ']' +
				' [char: ' + lset(escape(e.char), 16) + ']' +
				' [key: ' + lset(escape(e.key), 16) + ']' +
				' [modifier: ' + getModifiers(e) + ']' +
				' [isSpecial: ' + lset(e.isSpecial, 5) + ']' +
				' [composition: ' + getComposition(e) + ']'
			);
			if ($('p1').checked) {
				return false;
			}
		})
		.addListener('compositionstart', function (e) {
			if ($('p3').checked) {
				log('composition start: "' + e.data + '"');
			}
		})
		.addListener('compositionupdate', function (e) {
			if ($('p3').checked) {
				log('composition update: "' + e.data + '"');
			}
		})
		.addListener('compositionend', function (e) {
			if ($('p3').checked) {
				log('composition end: "' + e.data + '"');
			}
		})
		.addListener('log', function (e) {
			log('internal log: ' + e.message);
		});

	//
	
	document.body.addEventListener('click', function (e) {
		var elm = e.target;
		if (elm.nodeName.toLowerCase() != 'input') return;
		if (!/^p\d+/.test(elm.id)) return;
		localStorage.setItem(elm.id, elm.checked ? '1' : '0');
		log(e.target.parentNode.textContent.replace(/^\s+|\s+$/g, '') + ': ' + elm.checked);
	}, false);

	(function () {
		for (var i = 1; i <= 7; i++) {
			var id = 'p' + i;
			var elm = $(id);
			if (!elm) continue;
			var value = localStorage.getItem(id);
			if (typeof value == 'string') {
				elm.checked = value == '1';
			}
			else {
				localStorage.setItem(id, elm.checked ? '1' : '0');
			}
		}
	})();

	//
	
	$('p4').addEventListener('click', function (e) {
		qeema.log = qeema.logBasic = e.target.checked;
	}, false);

	$('p5').addEventListener('click', function (e) {
		qeema.log = qeema.logComposition = e.target.checked;
	}, false);

	$('p6').addEventListener('click', function (e) {
		qeema.log = qeema.logInput = e.target.checked;
	}, false);

	$('p7').addEventListener('click', function (e) {
		qeema.handlePasteEvent = e.target.checked;
	}, false);

	$('b1').addEventListener('click', function (e) {
		var t = $('c1');
		t.focus();
		qeema.editable.setSelectionRange(t, 1);
	}, false);

	//
	$('t1').value = '';
	$('t2').value = '';
	qeema.log = qeema.logBasic = $('p4').checked;
	qeema.log = qeema.logComposition = $('p5').checked;
	qeema.log = qeema.logInput = $('p6').checked;
	qeema.handlePasteEvent = $('p7').checked;

	// do test
	testParseKeyDesc() && testObjectFromCode();

}, false);

// vim:set ts=4 sw=4 fenc=UTF-8 ff=unix ft=javascript fdm=marker :
