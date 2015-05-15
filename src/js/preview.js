(function(CodeMirror, Markdown) {
	"use strict";

	var converter = new Markdown.Converter();
	Markdown.Extra.init(converter);

	CodeMirror.defineOption("preview", false, function(cm, val, old) {
		if (old == CodeMirror.Init) old = false;
		if (!old == !val) return;
		if (val) {
			setPreview(cm);
		} else {
			setNormal(cm);
		}
	});

	function setPreview(cm) {
		var wrap = cm.getWrapperElement();
		wrap.className += " CodeMirror-has-preview";

		refreshPreview(wrap, cm);
	}

	function refreshPreview(wrap, cm) {
		var previewNodes = wrap.getElementsByClassName("CodeMirror-preview");
		var previewNode;
		if(previewNodes.length == 0) {
			var previewNode = document.createElement('div');
			previewNode.className = "CodeMirror-preview";
			wrap.appendChild(previewNode);
		} else {
			previewNode = previewNodes[0];
		}
		previewNode.innerHTML = converter.makeHtml(cm.getValue());
	}

	function setNormal(cm) {
		var wrap = cm.getWrapperElement();
		wrap.className = wrap.className.replace(/\s*CodeMirror-has-preview\b/, "");
		cm.refresh();
	}
})(CodeMirror, Markdown);
