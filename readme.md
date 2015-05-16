# MirrorMark
[Demo](http://squiddev.github.io/MirrorMark/).
MirrorMark is a simple, yet extensible Markdown editor created with [Codemirror](http://www.codemirror.net).

## Features
 - Preview mode
 - Fullscreen
 - Syntax highlighting, including in fenced code blocks

## Install
```
bower install --save squiddev/mirrormark
```

### Dependencies
* [Codemirror](http://codemirror.net) (packaged with `mirrormark.package.js/css`)
* [Pagedown Extra](https://github.com/jmcmanus/pagedown-extra) (packaged with `mirrormark.package.js`)
* [Font Awesome](http://fortawesome.github.io/Font-Awesome/) (for toolbar icons - though this is optional)

### CSS

```html
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link href="./css/mirrormark.package.min.css" rel="stylesheet" />
```
You can load always load each components' CSS individually. `mirrormark.css` contains the theme for the editor, toolbar and preview.

### Javascript

```html
<script src="./js/mirrormark.package.min.js"></script>
```
If you are so inclined, you can just load `mirrormark.js` and CodeMirror separately

## Basic Usage
### HTML
```html
<textarea id="textarea1"></textarea>
```

### Javascript
```javascript
textarea1 = mirrorMark(document.getElementById("textarea1"), { showToolbar: false });
textarea1.render();
```

or if you are feeling groovy:

```javascript
var mirrors = document.querySelectorAll('[mirrormark]')
for(var i = 0; i < mirrors.length; i++) {
	mirrorMark(mirrors[i]).render();
}
```

## Options
When instantiating the editor you can pass the various Codemirror options available.
There is also an option to opt to show toolbar `showToolbar: false` (Default: true) and the option to change the theme `theme: name`.


## Custom Actions, Keymaps, and Toolbar.
MirrorMark allows you to add custom actions, keymaps, and toolbar options. Included in the [demo](http://squiddev.github.io/MirrorMark/) is an example of how to add custom options.

### Custom Methods
* `registerActions(actions)` - Accepts an object with an Action name as the key and an anonymous function for the value.
* `registerKeymaps(keymaps)` - Accepts an object with Keymap name as the key and an anonymous function for the value.
* `registerTools(tools, replace)` - Accepts an array of custom tool objects with the option of replacing (default: false) the existing toolbar.

### Insertion Methods
* `this.insert(string)` - Inserts a string at the current cursor position
* `this.toggleBefore(string)` - Toggles a string at the beginning of a line
* `this.toggleAround(start, end)` - Toggles a string at the beginning and end of a selection
