"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _easyDomUtil = _interopRequireDefault(require("easy-dom-util"));

require("./style");

var _event = require("./event");

var _buttons = require("./buttons");

var _size = require("./size");

var _line = require("./line");

var _activeLine = require("./activeLine");

var _util = require("./util");

var _version = _interopRequireDefault(require("./version"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Editor =
/*#__PURE__*/
function () {
  function Editor(_ref) {
    var el = _ref.el,
        code = _ref.code,
        _ref$lineIndex = _ref.lineIndex,
        lineIndex = _ref$lineIndex === void 0 ? true : _ref$lineIndex,
        _ref$buttons = _ref.buttons,
        buttons = _ref$buttons === void 0 ? 'all' : _ref$buttons,
        _ref$fontSize = _ref.fontSize,
        fontSize = _ref$fontSize === void 0 ? 16 : _ref$fontSize,
        _ref$theme = _ref.theme,
        theme = _ref$theme === void 0 ? 'dark' : _ref$theme,
        _ref$trim = _ref.trim,
        trim = _ref$trim === void 0 ? true : _ref$trim,
        _ref$disabled = _ref.disabled,
        disabled = _ref$disabled === void 0 ? false : _ref$disabled,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 300 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 200 : _ref$height,
        _ref$tab = _ref.tab,
        tab = _ref$tab === void 0 ? '\t' : _ref$tab,
        onload = _ref.onload,
        onsubmit = _ref.onsubmit,
        _ref$fullScreen = _ref.fullScreen,
        fullScreen = _ref$fullScreen === void 0 ? false : _ref$fullScreen;

    _classCallCheck(this, Editor);

    this.el = _easyDomUtil["default"].query(el);
    this.els = {};
    this._mark = {
      lineHeight: 20
    };
    this.config = {
      el: el,
      lineIndex: lineIndex,
      buttons: buttons,
      fontSize: fontSize,
      onsubmit: onsubmit,
      theme: theme,
      trim: trim,
      disabled: disabled,
      onload: onload,
      width: width,
      height: height,
      tab: tab,
      code: code,
      fullScreen: fullScreen
    };
    initCodeFrame.call(this);
    this.fontSize(this.config.fontSize);

    if (this.config.onload) {
      this.config.onload.call(this);
    }
  }

  _createClass(Editor, [{
    key: "fix",
    value: function fix() {
      if (!this._mark.flag) {
        this._mark.flag = true;
        this.els.bottomView.style('left', '3px');
        this.els.topView.style('left', '3px');
      } else {
        this._mark.flag = false;
        this.els.bottomView.style('left', '0px');
        this.els.topView.style('left', '0px');
      }
    }
  }, {
    key: "changeTheme",
    value: function changeTheme(theme) {
      if (typeof theme === 'undefined') {
        theme = this.el.hasClass('j-c-dark') ? 'normal' : 'dark';
      }

      this.el[theme === 'dark' ? 'addClass' : 'rmClass']('j-c-dark');
      this.config.theme = theme;
      return theme;
    }
  }, {
    key: "clearCode",
    value: function clearCode() {
      if (window.confirm('是否确认清空代码(该操作不可撤销)？')) {
        this.els.bottomView.empty();
        this.els.topView.empty();
        this.els.codearea.value('').el.focus();
      }
    }
  }, {
    key: "resetCode",
    value: function resetCode() {
      if (window.confirm('是否确认重置代码(该操作不可撤销)？')) {
        var c = this.els.codearea;
        c.value(c.data('code').replace(/&lt;/g, '<').replace(/&gt;/g, '>')).el.focus();

        _event.geneViewCode.call(this);
      }
    }
  }, {
    key: "copy",
    value: function copy() {
      if ((0, _util.copy)(this.code())) {
        alert('复制成功');
        return true;
      } else {
        this.els.codearea.select();
        alert('您的浏览器不支持该方法。请按Ctrl+V手动复制');
        return false;
      }
    }
  }, {
    key: "fullScreen",
    value: function fullScreen(_fullScreen) {
      var _ce_full = 'j_full',
          _ce_hidden = 'j_hidden';

      if (typeof _fullScreen === 'undefined') {
        _fullScreen = !this.el.hasClass(_ce_full);
      }

      if (_fullScreen) {
        this.el.addClass(_ce_full);

        _easyDomUtil["default"].query('body').addClass(_ce_hidden);
      } else {
        this.el.rmClass(_ce_full);

        _easyDomUtil["default"].query('body').rmClass(_ce_hidden);
      }

      this.config.fullScreen = _fullScreen;
      return _fullScreen;
    }
  }, {
    key: "fontSize",
    value: function fontSize(size) {
      var _this = this;

      var par = this.el;

      if (size !== undefined) {
        par.style({
          'font-size': size + 'px',
          'line-height': size + 4 + 'px'
        });
        countLineHeight.call(this, par.query('._bottom')[0], function (lineHeight) {
          _this._mark.lineHeight = lineHeight;

          if (_this.config.height === 'auto') {
            _event.geneViewCode.call(_this);
          }

          par.style({
            'line-height': _this._mark.lineHeight + 'px'
          });

          _line.setLineHeight.call(_this);

          _activeLine.setActiveLineHeight.call(_this);
        });
        this.config.fontSize = size;
        return size;
      } else {
        var fs = par.style('font-size');
        return parseInt(fs.substring(0, fs.length - 2));
      }
    }
  }, {
    key: "fontSizeUp",
    value: function fontSizeUp() {
      var n = this.fontSize();

      if (n < 35) {
        return this.fontSize(n + 1);
      }

      alert('已达到最大大小(35px)');
      return n;
    }
  }, {
    key: "fontSizeDown",
    value: function fontSizeDown() {
      var n = this.fontSize();

      if (n > 12) {
        return this.fontSize(n - 1);
      }

      alert('已达到最小大小(12px)');
      return n;
    }
  }, {
    key: "submit",
    value: function submit() {
      if (typeof this.config.onsubmit === 'function') this.config.onsubmit.call(this, this.code());
    }
  }, {
    key: "code",
    value: function code(_code) {
      var c = this.els.codearea;

      if (typeof _code == 'undefined') {
        return c.value();
      } else {
        c.value(_code).el.focus();

        _event.geneViewCode.call(this);
      }
    }
  }, {
    key: "disable",
    value: function disable(disabled) {
      if (typeof disabled === 'undefined') {
        disabled = this.els.codearea.attr('disabled') === 'true';
      }

      if (disabled) {
        this.els.codearea.attr('disabled', 'true');
      } else {
        this.els.codearea.rmAttr('disabled');
      }

      this.config.disabled = disabled;
      return disabled;
    }
  }]);

  return Editor;
}();

function initCodeFrame() {
  var item = this.el;
  this.el.addClass('j-code');
  var code = this.config.code ? this.config.code : this.el.html();

  if (this.config.trim === true) {
    while (code[0] == '\n') {
      code = code.substr(1);
    }

    code = code.replace(/(\s*$)/g, '');
  }

  this.els.activeLine = (0, _activeLine.initActiveLine)();
  this.els.bottomView = _easyDomUtil["default"].create('pre.code_editor_view._bottom').html(code);
  this.els.topView = _easyDomUtil["default"].create('pre.code_editor_view').html(code);
  this.els.codearea = _easyDomUtil["default"].create('textarea.code_editor[spellcheck=false]').html(code);
  this.els.codearea.data('code', code);

  if (this.config.disabled) {
    this.disable(true);
  }

  if (this.config.fullScreen) {
    this.fullScreen(true);
  }

  if (this.config.theme === 'normal') {
    this.changeTheme('normal');
  }

  item.empty().append(this.els.activeLine, this.els.bottomView, this.els.topView, this.els.codearea);

  _size.initSize.call(this);

  _line.initLine.call(this);

  _buttons.initButtons.call(this);

  if (code !== '') {
    _event.geneViewCode.call(this);
  }

  if (window.navigator.userAgent.indexOf('iPhone') !== -1) {
    this.els.bottomView.style('left', '3px');
    this.els.topView.style('left', '3px');
  }

  _event.initEvent.call(this);
}

function countLineHeight(el, cb) {
  var _this2 = this;

  el.style('height', 'auto');
  setTimeout(function () {
    var length = 100,
        strLine = '';

    for (var i = 0; i < length; i++) {
      strLine += '1\n';
    }

    var content = el.html();
    el.html(strLine);
    var padding = el.style('padding').replace(/px/g, '').split(' ');

    if (padding.length === 1) {
      padding[2] = padding[0];
    }

    var lineHeight = (el.el.offsetHeight - parseInt(padding[0]) - parseInt(padding[2])) / length; // 50是padding

    el.html(content);
    el.style('height', _this2.config.height + (typeof _this2.config.height === 'number' ? 'px' : ''));
    cb(lineHeight);
  }, 10);
}

Editor.version = _version["default"];
Editor.tool = _easyDomUtil["default"];

Editor.create = function (config) {
  return new Editor(config);
};

var _default = Editor;
exports["default"] = _default;