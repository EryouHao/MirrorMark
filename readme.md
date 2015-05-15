## Overview

MirrorMark is a simple, yet extensible Markdown editor created with [Codemirror](http://www.codemirror.net).

See [Demo](http://musicbed.github.io/MirrorMark/).

## Install

```
bower install mirrormark
```

## Dependencies
* Codemirror
* Font Awesome (for toolbar icons)

### CSS

```
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link href="./css/mirrormark.package.min.css" rel="stylesheet" />
```
* `mirrormark.css` contains the theme for the editor and toolbar. If you'd like to adjust the theme create your own `{theme}.css` file and namespace the selectors with your theme name.
* You can load always load each components' CSS individually.

### Javascript

```javascript
<script src="./js/mirrormark.package.min.js"></script>
```
* If you are so inclined, you can just load `mirrormark.js` and CodeMirror separately

## Basic Usage
### HTML
```
<textarea id="textarea1"></textarea>
```

### Javascript
```
textarea1 = mirrorMark(document.getElementById("textarea1"), { showToolbar: true });
textarea1.render();
```

## Custom Actions, Keymaps, and Toolbar.
MirrorMark allows you to add custom actions, keymaps, and toolbar options. Below is an example of how to add two actions at runtime and a tool icon with a dropdown to call these two actions.

### HTML
```
<textarea id="textarea2"></textarea>
```

### Javascript
```
var customActions = {
	// Inserts three images wrapped in a <div>
	"threeUp": function threeUp() {
		var html = [];
		html.push("<div class='threeUp'>");
		html.push("	<img src='' />");
		html.push("	<img src='' />");
		html.push("	<img src='' />");
		html.push("</div>");

		this.insert(html);
	},
	"fourUp": function fourUp() {
		var html = [];
		html.push("<div class='fourUp'>");
		html.push("	<img src='' />");
		html.push("	<img src='' />");
		html.push("	<img src='' />");
		html.push("	<img src='' />");
		html.push("</div>");

		this.insert(html);
	}
}

var customKeyMaps = {
	"Shift-Cmd-Alt-3": "threeUp",
	"Shift-Cmd-Alt-4": "fourUp",
};

var customTools = [{
	name: "threeUp",
	action: null,
	className: "fa fa-fighter-jet",
	nested: [
		{
			name: "threeUp",
			action: "threeUp",
			showName: true
		},
		{
			name: "fourUp",
			action: "fourUp",
			showName: true
		}
	]
}];

textarea2 = mirrorMark(document.getElementById("textarea2"), { autofocus: true, showToolbar: true });
textarea2.registerActions(customActions);
textarea2.registerKeyMaps(customKeyMaps);
textarea2.registerTools(customTools);
textarea2.render();
```

## Options
When instantiating the editor you can pass the various Codemirror options available. There is also an option to opt to show toolbar ``` showToolbar: true ``` (Default: false) and the option to change the theme ``` theme: name ```.

## Custom Methods
* ***registerActions(actions)*** - Accepts an object with an Action name as the key and an anonymous function for the value.
* ***registerKeymaps(keymaps)*** - Accepts an object with Keymap name as the key and an anonymous function for the value.
* ***RegisterTools(tools, replace)*** - Accepts an array of custom tool objects with the option of replacing (default: false) the existing toolbar.

## Insertion Methods
* ***this.insert(string)*** - Inserts a string at the current cursor position
* ***this.insertBefore(string, cursorOffset)*** - Inserts a string at the current cursor position and then moves the cursor to the cursorOffset (int).
* ***this.insertAround(start, end)*** - Inserts a given string value at the start and end of a selection.

## Things coming
- [x] Windows support for Keymaps
- [ ] Fullscreen editing (Partial - the toolbar is not displayed)
- [ ] Preview mode
- [ ] Status bar
