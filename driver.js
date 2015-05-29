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

	function getChar (e) {
		return e.char.replace(/[\u0000-\u001f\u007f]/g, function ($0) {
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
				'[code: ' + rset(e.code, 4) + ']' +
				' [char: ' + lset(getChar(e), 16) + ']' +
				' [key: ' + lset(e.key, 16) + ']' +
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
}, false);

// vim:set ts=4 sw=4 fenc=UTF-8 ff=unix ft=javascript fdm=marker :
