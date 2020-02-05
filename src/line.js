import $ from 'easy-dom-util';
import {fixNum} from './util';

let lineTop = 10;

export function initLine () {
    if (this.config.lineIndex) {
        this.mark.line = true;
        this.els.line = $.create('div.code_line_w').append(
            $.create('div').text('01').style('line-height', this.mark.lineHeight + 'px')
        );
        this.el.append(this.els.line);
    } else {
        this.mark.line = false;
        let pl = '10px';
        this.els.view1.style('padding-left', pl);
        this.els.view2.style('padding-left', pl);
        this.els.codearea.style('padding-left', pl);
    }
}

export function setLinePT (top) {
    if (!this.mark.line) {return;}
    lineTop = 10 + top;
    this.els.line.style('padding-top', lineTop + 'px');
    lineTop += 10;
}

export function reinitLine () {
    if (!this.mark.line) {return;}
    var len = this.els.line.el.children.length;
    var lines = getLines.call(this);
    initLineDivHeight.call(this, lines);
    if (lines > len) {
        for (var i = 1; i <= lines - len; i++) {
            this.els.line.append($.create('div').text(fixNum(len + i)).style('line-height', this.mark.lineHeight + 'px'));
        }
    } else if (lines < len) {
        for (var i = lines; i < len; i++) {
            this.els.line.child(lines).remove();
        }
    }
}

export function initLineDivHeight (lines) {
    if (this.els.line) {
        if (typeof lines === 'undefined') {lines = getLines.call(this);}
        this.els.line.style('height', this.mark.lineHeight * lines + lineTop + 'px');
    }
}

function getLines () {
    return this.els.codearea.value().split('\n').length;
}

export function setLineHeight () {
    if (this.mark.line) {
        this.els.line.child().forEach((lineItem) => {
            lineItem.style({
                height: this.mark.lineHeight + 'px',
                'line-height': this.mark.lineHeight + 'px'
            });
        });
        initLineDivHeight.call(this);
    }
}
export function setLineTop (top) {
    this.els.line.style('top', top + 'px');
}