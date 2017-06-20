//tabIndent.js
//html java c#
//
//html str note key fun sign
//str key fun note
//sign
//html
//lang style width height tab
//(HTML)(Note,Str,Fun,Key,Num),(sign)
//Note>Str>HTML>Fun>key>Num>sign
//
(function(){
  var _ce_btn="buttons",_ce_disabled="disabled",_ce_callback="callback",_ce_full="j_full",_ce_hidden="j_hidden",_def_w=300,_def_h=200;
  Jcode={
    init:function(element){
      if(element==undefined){
        J.tag("editor").each(function(item){
          _initFrame(item);
        });
        _initCodeMain(J.class("code_editor"));
      }else{
        if(element.tagName.toUpperCase()=="EDITOR"){
          _initFrame(element);
          _initCodeMain(element.findClass("code_editor"));
        }else{
          element.findTag("editor").each(function(item){
            _initFrame(item);
            _initCodeMain(item.findClass("code_editor"));
          });
        }
      }
    },
    fix:function(obj){
      var par=_checkParent(obj);
      if(obj.data("flag")){
        obj.data("flag",false);
        par.findClass("code_editor_view").css("left","3px");
      }else{
        obj.data("flag",true);
        par.findClass("code_editor_view").css("left","0px");
      }
    },
    clearColor:function(obj){
      var par=_checkParent(obj);
      par.findClass("code_editor").toggleClass("bg");
      par.findClass("code_editor_view").fadeToggle();
    },
    clearCode:function(obj){
      J.confirm("是否确认清空代码(该操作不可撤销)？",function(){
        var par=_checkParent(obj);
        par.findClass("code_editor_view").empty();
        par.findClass("code_editor").val("").focus();
      });
    },resetCode:function(obj){
      J.confirm("是否确认重置代码(该操作不可撤销)？",function(){
        var c=_checkParent(obj).findClass("code_editor");
        c.val(c.data("code")).focus();
        _geneViewCode(c);
      });
    },copy:function(obj){
      if(J.isMobile()){
        J.show('Sorry,this function is just for PC',"warn","slow");
      }else{
        var par=_checkParent(obj);
        if(par.findClass("code_editor").copy()){
          J.show('复制成功！');
        }else{
          par.findClass("code_editor").select();
          J.show("您的浏览器不支持该方法。请按Ctrl+V手动复制","info");
        }
      }
    },fullScreen:function(obj){
      _checkParent(obj).toggleClass(_ce_full);
      J.body().toggleClass(_ce_hidden);
    },fontSizeUp:function(obj){
      var n=_getFontSize(obj);
      if(n<35){
        _checkParent(obj).css({
          "font-size":(n+1)+"px",
          "line-height":(n+5)+"px"
        });
      }else{
        J.show("已达到最大大小(35px)")
      }
    },fontSizeDown:function(obj){
      var n=_getFontSize(obj);
      if(n>12){
        _checkParent(obj).css({
          "font-size":(n-1)+"px",
          "line-height":(n+3)+"px"
        });
      }else{
        J.show("已达到最小大小(12px)")
      }
    },submit:function(obj){
      var par=_checkParent(obj);
      par.code_callback.call(par,par.findClass("code_editor").val());
    },extend:function(a){
      if(typeof a=="array"){
        _code._key.appendArray(a);
      }else if(typeof a=="string"){
        _code._key.append(a);
      }else{
        throw new Error("extend:参数类型错误");
      }
    }
  };
  function _checkParent(obj){
    if(obj.tagName=="EDITOR"){
      return obj;
    }else{
      return obj.parent(2);
    }
  }
  function _checkFunction(f){
    if(f!=undefined){
      if(f.constructor==Function){
        return f;
      }else{
        return new Function("code",f);
      }
    }
    return (function(){});
  }
  function _getFontSize(obj){
    var par=_checkParent(obj);
    var fs=par.css("font-size");
    return parseInt(fs.substring(0,fs.length-2));
  }
  function _initFrame(item){
    if(item.findClass("code_editor").length==0){//防止两次初始化
      var cont=item.html().trim();
      var num=/^\d+$/;
      var w=item.hasAttr("width")?item.attr("width"):_def_w+"px";
      if(num.test(w)){
        w+="px";
      }
      var h=item.hasAttr("height")?item.attr("height"):_def_h+"px";
      if(num.test(h)){
        h+="px";
      }
      item.empty();
      item.append(J.new("pre.code_editor_view._bottom").html(cont));
      item.append(J.new("pre.code_editor_view").html(cont));
      var ta=J.new("textarea.code_editor[spellcheck=false]").html(cont).data("code",cont);
      if(item.hasAttr(_ce_disabled)){
        ta.attr(_ce_disabled,_ce_disabled).css("cursor","no-drop");
      }
      item.append(ta);
      var needSubmit=false;
      if(item.hasAttr(_ce_callback)){
        needSubmit=true;
        item.code_callback=_checkFunction(item.attr(_ce_callback));
      }
      item.css({
        width:w,
        height:h
      });
      if(h=="auto"){
        item.child().css("height",h);
        item.findClass("code_editor").data("height","auto").css("overflow-y","hidden");
      }else{
        item.child().css("height","100%");
      }
      if(w=="auto"){
        item.child().css("width",w);
        item.findClass("code_editor").data("width","auto").css("overflow-x","hidden");
      }else{
        item.child().css("width","100%");
      }
      var mh=45;
      if(item.hasAttr(_ce_btn)){
        item.child().css("padding-top","40px");
        mh+=40;
        var btn=item.attr(_ce_btn);
        var arr=[];
        if(btn==_ce_btn||btn=="true"||btn==""){
          J.each(_buttons,function(item,attr){
            if(attr!="submit"||needSubmit){
              arr.push(_getButton(item));
            }
          });
        }else{
          var ba=btn.split(";");
          ba.each(function(item){
            if(item!=""){
              if(item!="submit"||needSubmit){
                arr.push(_getButton(_buttons[item.toLowerCase()]));
              }
            }
          });
        }
        item.append(J.new("div.code_set_w").append(arr));
      }
      item.css("min-height",mh+"px");
      if(cont!=""){
        _geneViewCode(item.child(2));
      }
      if(window.navigator.userAgent.has("iPhone")){
        item.findClass("code_editor_view").css("left","3px");
      }
    }
  }
  function _getButton(a){
    return J.new("img").clk(a[0]).tip(a[1]).attr("src",a[2]);
  }
  var _buttons={
    fontsizeup:["Jcode.fontSizeUp(this)","放大字体","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOgSURBVEhLtZdLSFRhGIZzytIkdWFGJF0GhaQiMqJFYhCShEhitqhNYBERohG6kCjoIhFRhEQuuywqRCrDcBUqREQWia0SdUyJEHWsHBuby5meb+bj5OgMc4ZmXnj5/v+7vO9/Lp6mZZEQCARsMNswjGq/3//S5/O52QfB+gP5epjPNlVH/g8I2RDcidkdOAadcBKzr3CQ9QicgFPsZ4jt9JfDdJWIH5imwdMIjiM4S+wnXlHhQpgH82EJrKPWBeVgf+BtZnNUyjoYWolYE2YGIhOsz8USop5K32Fm3uvcE/a5WrYGBo8z6CWOIViqaRNyMJgN0zRlArNNzL6iFiC2sLd22+nPwvAzQ3MMVWs6DORLqLd6vd5q+pdr2gT1AjQG4Rw9B+lJ0VJ00FyLqBt2OhyOJVckQLhGDgZvaCoMYoROI/V5+MDSVTMgb+pvmmsRsElOhKCd01cQK6nfhXK4DvqqYAXcRc28evZFaMlLOcQ69rNmWJ6NGMttDN4iEWR/FpFpFZuXPqJf97PMtJIy7xD9W8jLn5lT1pqODhonEZHnewoh84rZF8F66uepP4Vu1j3kGiVHLKNvRVAEsN9O/iccdblc6zUdHTRegh4RXyi0EIieoC5/MhGfsQCNM9TlGT9HZ7WmowPRdTzLUQZ/sT6gaRN69YcQ7KDnZKTDUc+j1kePh3iMnuCdiwma66DgIyJFmjaBUBr5tTBDUybI5WJ4nx55V545nc4sLcWGCDLUIsNqXsUyW8sRQd3m8Xj2MfdY5ohvmCvUsnUwlMnwZYyniB602sjVEIuJBTCP9WbM9siHhJ57cFhNu6jvUKn4gUYKouUIyVs8raLfYR/LHuJbDjYieaJ8Yh3a85Cw5IsWNzj9GoRKiRcQfQRfiyk5MW+Ht1hXUt+vNRe8zn4v+difSytASF6sDUQ73AjDXh4xw/Sb3AHiJ9gs/VpOHjDJxLSfAwWBsaCTZbG2JAcYp2N0U9xC1iGwHSAc1bbkwO1252P0JWT5D+TGuRt13d3dEb+ICQFX3oCRTz0X4ge1i3CVtiYWCOdydb1qFgYOJG/9VZaJ+VW6GJiXYT4TsgsHxvLPaQNLa9/xeIBoKgbXotxy+ehMcrgj2p5YoJ+D8YuQ1VJQk7fdru2JBcJbubp3QadFwFg+NM3amnjwj8luzOUzGwZM5efTgLYlBzzPbfi0Qfmh6IPyKwZf34i2JA+YZ3Ch8l+jXig/BocNw2j6CzDK/h78B3eqAAAAAElFTkSuQmCC"],
    fontsizedown:["Jcode.fontSizeDown(this)","缩小字体","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKqSURBVEhLtZVfaI1xHMY5wppxssi/hkLUysjf5oqrKbtQI+4OqSnFjYkbK8qFW4mbKZFc6diNcsXNlKZdoDCTaa3EQpOinff4PHufHVtn5905x/s+9fT+fs/v+zzP+57Oec+sUsjn8zVBEBzM5XJZ+It9nusYfMoyw9lSj8YDAtcRfg2OqkxgPQKH4RdL0oT7zO+ytXoQcpzM7w5+yf4s3ANXIaXhctbbYTvrJ5oT2Hc6onJgvuAcFWfgHB+VBJ4WbvCtTFy7uKR8VB4IaLN5iHWT5bKAbQm+Z/LjvWh5ZjA/F+MniC/YZ7ki4FuDX9+DP6w3Wo4Ggyd0t5iylqoC/svOuWIpGgy+lwFkLOlTqOWGWmArPFCKzKVt0QPsVgh5zy1FQ8MCxv2WFLLBciSY22lLwUPxAJfZlkuDwWGHHLWkm6lj3yYtiswttkWebcohr89SNAg4Z8MdS1WBnA7n3LAUDQwLGNY38jfrzZYrAr56/IMqZt1seWYwfNJ3q7fVSstlAds8fFn7uyyXD0zXbX5H+V7LkWCukfnH8gG9Qut8VBkIuRRmjN9AN5dDhDdwrYUp1vPhCqhX5W045tm7aIscUx0IaCbooQInwH4QvoYDMGdZ+jdfr9r+/+AGGuFpQu/BF7Af9sEH6J1wB52r2b9SOfszcJntyYOyJsp/+Mm/cjnvo2RBsX5KIyqeAPtu9AaPJAN6UhTdCiv/Ae0D5eX/pqsBPWspGv+4JwNtlPLCqzgRUFL4KU4GOt1Bu8fiBx1pSvrDumJQfsqj8YPwVvdMC86PeDR+8NQ33VMEzn5SvtWj8YLghXT0hlXTQmc1Ho8XlK/n6YbCnmJwfsyj8YP8LZR/DKumAv2Rx5IBHZso6QnrpqDXI8mBj1V/pfqz6YGf4ZsgCA7/BV8WPydhVVSVAAAAAElFTkSuQmCC"],
    fullscreen:["Jcode.fullScreen(this)","全屏显示","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIFSURBVEhLrZYxSxxRFEZ3wQ0pRE0iaiESIWgTwS39BVYWIWwhpBNiaZMmP0BJetOlVwiymBQqaLkgQrpICJgtrCwCqWIhzGzOnfetYSEz+968OfB4M3fvPd/OMI5bi6XX6z1MkuQLuzf072i8PGmaLiG6k9ML+r9rvDx4GnYFrMRph0NrV+Px4GuZ0KmLoe9KY9XAbV9B+kf+XCoNxjeBcI+VOn0+lQVzpY+ReT/ZlQTjeYTo2Cn9iA7GMYPk1On8iQpmfgTBZ6cqhr6frPs/t9jgltMUQ8ghz8C87SrFBTO8K08u9JwR+sT62Rc5v1H9OpOUAdGbzJ4D8g49U2rP4PwV9VvWiUrh4J5E8M3FDEL9KyGzah2A+gotT3VaDI11Bl4gfM/xO47XrM7epHZhYX04P6f+LBuMAdcosn2n/Qe1D/Y5IWOsVdYWZXvgxrPBYWjQLr+h0j0mIaDN/l+Y21BrOIg7LOOjShl47Y1U+Brk8wO1hyNHn9eq2Qv/yJXyoeeErZ6JQnEKB6Jf3L6X7L5vpG1pwpEjGEJ/sM1JE47ThEFolzvTlKIccnmjK13WeHmczg9CL7nS5xqNQ86hEGpvpAWNxSNvIYSSmW5qpBrkHgrhvwl/y+EDjcbhtP7wBdp8gWmNl0e+IAhe13h5TMJV2O/hfe1F6xPLfnn4/T/NpVb7C5lEFoLauD3OAAAAAElFTkSuQmCC"],
    fix:["Jcode.fix(this)","修复重影问题","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIfSURBVEhLtZY/SJVRGMZvpVtItEhDRIuDukhCm2SOQZAIQalcrARDCQcXQWhxq8XphoMKgkJTt6mhTYVIG7LNwbGGSLdKvV/+3u8898v71+Gc84OXc87753m+77t3OLmzJElyvVQqLRK/iBPiA7l+leOByTXMPv2rgtw7eyi1xQGDNow+yjOD3C61drX5g+ZlbTNkXnSW/yG3qhZ/ECsQSzpm4HOL/B9n6eB8zEN1qcUPxH5KtKCUvfENzrupWxXUJtTmBwaJNM18AeEO1q9K1UBtXqN+ILQlzRTOB9rWhQeb1agfCN2X5rnwUCX6+zTqD3qb0m6KjJ9pzB/EutH8If2m0HfEkteoP5j3ILrh5JtjL84Szhyxi/abI/yaWCfecH5MvEgdqyD/VKPxwGRCfhWQD/ebNwKfcWdXw7ha4mEmzqsS+yJqiQcmT+RXAfnnaokHJmP6d1dAflIt8cAn38B8Si3xwGQU8xN5ZpCfIXqJe8QAEe4SUQbR4XrmZ6H+neUlcUljYcD8EeLHqUtzlokLGgsD5iOY/3X6Gdvk9rRPoe+hRsKA4FV0D00cM47JNNsW4grnNcsb7N9rJAwYdUrbxPdZsk9KzW42v1X7pnQYELe7WvlTH3K+qZLVbpdrwY3RbEX0s4kb7O2CcQfTu+x3XDbNFzUSDkyGpN8Qeh6oPSwIz8mjBt72ldrigPkAJiv2iYkvxFtyg66ay50CwM9LTCPXFy4AAAAASUVORK5CYII="],
    clearcolor:["Jcode.clearColor(this)","清除颜色","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAeCAYAAABAFGxuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOuSURBVFhHvZfbSxVRFMZPWBFiKWkRdiWqtx6iDIsi6iHpQplSRmAaPdRDRQT9BYFFkOaL9GBU2pNCBEUY1UMXCFKiiBQ1iqwH6WqYt/Sc02/tvZwcZ/JyZo4ffMxe37f2WuvMmTlnJpIIYrHYUlgYjUZvwFb4Gw4pe2AbrCWnKB6PL4PTdGu4kMI0yaXZJfgCxtAmDPIb4WWWm2CKlg0GBsqj6B04YLoEADUGYQM1d2n5yYPN2RSpgkNa1wX0DvgIflfJAdpP+BC+V8kDvGp6LNJ2EwMbdrOxXWt4gCefeqXmrid+pZZ4bWi54hEuJ75nHS/wZPD9kjsuKHqIDb/sVi/wBsnZrukGxCfVjrM+rrIB0lr29FrXC7x+DqWa7g+KHiFxzGsJf4i8PN1iQHxCbc9gxHJGe9T2BX6UvKO6xQ2MjfjdmmtA3A5fwj6VDIjvk7+CZSrHdcRvrGO8ZtFYpsIlxLeNMQ7IG2DfNh3HAj0No9GmmKQYvMoyS3w27CV2XeTEnfAp9Pvau9CfwU8aO0CT37pm6Lkx0ORazTBDCWh8yloWJHSizVXbAK1c7SDoom4BxzSYQc1Ko44A/lnTkPV0El5b2YL4CwdztobhV2SyoMZNLWfAEPPRvqptQNzGId1cnFb6B0z5KqvkrBGmcdxJ/MO6iYMaNTqTAVIWmmswAf3y5ExUaewB3gf4FsotHRg6RL4MRfM5xBXWcQO9TAbzXKDJBP16odzpLSp5gHdNBhvU2AHaOyh3TihnKgHUeQYjrpTTzDKF40Hib9aZOtCzXgb7rLEI8tsy+m6st+6U4ro0vqKBGYyzlKkzGSDXWXdKcUHujlwNDBiuXL/KWRwLiD23czJBP9rGNssZmUng/NcJiOXil5+JwA+Hw6BWP/R9thsJcir0yzK/KadVDxU06YZl1M+Bq+EauAEeQD8Hb8En8Dm8i17Mthk6lv0Th01SLCzQqE8G0BaJgyJbKPbfBzo/kC//DPKE0aGSA7THWjo4GO4wBce9rsiRu3cfywVQnsmyYQm6/PkbsG5Fm6elg4NixRT9o/U9wJPbplDTXUA/pmkGxEVqhQNq5tPf92UEXR6tCzTVBexSm2VBboNa4YHmiylcDaPaxwGSvAntYZmuuZlQXmI+2gwL4m70HFMwbFB4Bw0aoN+114T+ADqvb6PB/hItlRzQYCsDXIQtcMy3nmGQJ2d2lZZILmg0G8qPpdyF56G8rdcyh/yn1rGuEQ3/DFyo2yaJSOQv890x9+fnG9MAAAAASUVORK5CYII="],
    clearcode:["Jcode.clearCode(this)","清除代码","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIOSURBVEhL7Zc9aFNRGIazpdGxU0EQQagU689YJweXVgfnipQWFwdFhMxiqQhdXITiIkKwOreQOiQlBU1Rd4dMuovJTW7S+5Pc9vnO/fKjt5o2XnG5D7ycnPd853vPPTeUNHVUXNed9n3/aafTefY7sX5Ty+PBcZxz7Xb76/4QqHHQbd12PIIgSKOT9Dkh0vk8T/QJbaPiH1RGj6nPiLo9RNo+SqVSSXNVT9i4y6k/DOg9KuG/Q1tDJDVF3SPq9viI/7bVap3WuD4s3uFk/xQyNhnGNDKEE+WQ8J2CH3FKeza40YDxrkaG8E7OsnADrVH4QsY4RC/RSwn0PO8KOWc0sg/XIN9el0IfeTFKnjSrMVEIviTB8j7ihr73NSYK6xLshKUhXM0+V1bHr8vnLsxtVBv0qNtDVdQ3FWofaEwU1iPBAl4WLenUQPPnaO6Xw2zwHmcYG2r1wBsp+BYh13RqwHvEX7RJnRp4lznLssb5WAudPqMGLxJ8XacGQlZ42os6NeC9aTabpxgttXokwT/BehJsSIKFJFhIggcZNXiB4FmdGmi+TPB5nRrw1m3bnvgfwa/xJqg/XjCbLlMQ+QWC9xmVdWrgIF/wCuxRx9R94z+OPKOvVg+8hxoThSYXDtsUB/xAuKcxUQjOcF15rY0NHqZK7ymNORwK5Fu5igps2EGlv9AOfV6RfVXbK6nUARxpSe8JYAMtAAAAAElFTkSuQmCC"],
    resetcode:["Jcode.resetCode(this)","重置代码","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALwSURBVEhLtZdNbExhFIZbU1Xxk0Z3xEQTFSGk8RuprRULC+3CRkKiZSNBTGPnL13YCInubCyoCBWJkCJEBAsbi8ZC/SU0UemING3QmfGc775zzXXvTOdOZ57kzfd957znnG/Mz626OGSz2TZ0LJfLPclkMmk0jb6jR8RTaKWss4chjTTcp2HTrEUhbzzDfwDNV4v4UNxBo6fqGwvqXrBsV6vyoeggxROuS4VQP8nlj6jlzGA+qtpIaGjv7zs0jEYI/fAy0dAvpdb/oPAsCf9DwX4vsYxqAhB+Tv4Q2oCWEGpibUGbUA/5om8L+f0a4YH5N7JP5hmSu1hH5fUhNkaum22DyiIhn8BnF//kCgsglmZpl9UNfuClXDKrrQ+xzzTrkL0s8K+l7o1a+BC7x1LvTBwue+Ew5CZostUZY0LdKupDr5z4zrzhhGIhKJxC/Xi2oNjfS2r2UB/4V+R8yyXZd3qh0vg3jQmD/LfS4JymV6vdarNikWD8hqcHLVCvWFDXpVaFdFqiTYcQDB0iv0Y9KoL65fT5qpYOzqctsZTNT8UcnI0+cpX/3graJegV+H5zvmqDF7P5oJgF37PsVl1VoOeg192D80270Rw2b/MBlqT8VUN9fewi+cQQOkcs4QJVht7/f7Kv2Suutw+APFWH/s0MGnYTBecLStcOXpQ90wMPHWLdStcOZl7SPIddgsHrla4NzFmNAs9q5r5i8DxZosGXRAt1jAV1cxliT6MADD0sSzR4NlI4ggbYNypcFvgbqOu3QYUQs9+IZtnCcKsdmPw/CNgPEmtVuiTYk7psCHp0yRaG5DYKJ+X1IfaRpRetQIHvu53tYiiFL/QMNohfkT0aipdhCnzhCyE3jh6ii6hP62M0LksIcvfpu0gjimMmzLdVNyvoc4d+LWo9M9Q0UXQKTXkt4mF16DxDK3vCUWi/PNfRL/UsCb4/6C7b+P+LiIILrEPHaTqAXqIvaAyNotcMukH+JGs78v6SLEpd3V+6zXjkAInoGgAAAABJRU5ErkJggg=="],
    copy:["Jcode.copy(this)","复制代码","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFKSURBVEhL7Za7SgNBGEa38wl8B0FEghdQwfewsNAiKILaCTaWNhY+gQ8kxNZKxEDwEhRZjNm7nsUPiTgmM8PazYGPYYbZ7+ySFH9kIkmSmaqq9i1zQI6yLFvV437EcTxdFMV1WZaVTfI853rxTHrI11XjDm+/+OEA4iHSQ17ihe0r8jVVuYF46avSDqTvZIfcat9HvqI6e1y/WOI9cqej+uwR+bIq7WhCXMP+HvmCaifjIR5I3NXRN/z+vTRNW6oej4c4IW3+XA86+gHyJ+Tzqv8bV3EN0lPkJ6xXrJ2RXJIu8ht6Z6Uw4yOmfEj5GWub7I5ki/Nz3dmWwoyPeBLIK8QbUpj5DzHSIP5NEDdBEBsJ4iYIYiNB3AS2Yqe52hbEm1KYYTCb093GQJrxQePnbC5MMbRdcDlmZBkwG7/5hufrmbtPjlUvougTzebgrLsTaLEAAAAASUVORK5CYII="],
    submit:["Jcode.submit(this)","提交代码","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHkSURBVEhL7ZQ9LENRGIabDgbx1wWLMAiLVCwWExKzMBro0DBLJGwSu10MRoPNJmHCgviJxSYkpibcaEj/6zm9r1M0FeXcBU/y5es933u+957v3tvQP7+GYrEYJloKhUJHKpXqJQ8QnSoHQy6XmyXOiFvC4wZKYByTxC00bsrn81vysRhzalOSuYX+7Rjs+1ZlWDtPp9NRydzCaVoxOJaXxdxIMplsk8wtnudFMDiUl4W1HTN6ydxC/3qe6Z5vVYa13UQi0SiZezKZzKa8LJz0gNQsiXuy2eyKb1UG0wvzvCVxDwbT8rKwdotptyTuoXkUk6T8SnCdYX1YEveYtxSTU/lZWJuTJBh4W9fkZeFZr6kcDBiMy8vCSc9IDZLUBuNrpOkouV9LFVAz/0zXvp0P1898ToOSfB32htkcJ65eGzHKHW5iRBILaxtG8xb0iyrXBs1W1eMdNMwTC5IZ3ZhKFupHpDpJaoMxzdOg4LeqhFrc6MgnWirBtfl0hkpNvgtNYow3p54f8aht67eFCaxr+8+g0SQ38Ki+n4LuntSlrT/HPEfiyW9fHSawrC3uwHiCE1UbuzntDSkiuVtoPuPbVGJqkgUDBtPEJRN4IN8x3iPyksrBYv6piD6ih8MGM94/Qij0AhsuMvn6QO+1AAAAAElFTkSuQmCC"]
  };
  function _initCodeMain(item){
    item.on({
      mouseleave:function(){
        //showResult(false);
      },
      keydown:_codeChange,
      keyup:function(e){
        if(e.keyCode==13||e.keyCode==9){
          _geneViewCode(this);
        }
      },
      input:function(){
        //showResultHtml();
        _geneViewCode(this);
      },
      scroll:function(event){
        _getView(this).scrollTo(this.scroll(),null,10).scrollXTo(this.scrollX(),null,10);
      },
      //onclick:moveCursor
    });
    _tabEnable(item);
  }
  var _code={
    _str:1,
    _key:["if","else","for","switch","while","try","catch","finally","new ","return","this","break",
        "default","case","continue","throw","throws","in ",//common
    "function","var","undefined","typeof",//js
    "important",//css
    "private","protected","public","abstract","static","void",
    "boolean","byte","char","int ","double","enum","const","final","float","long","short","true","True",
      "false","False","null","String","string","object",
    "assert","class ","do","extends","goto","implements","import","instanceof","interface","native",
      "package","strictfp","super","synchronized","transient","volatile",
    "operator","out ","override","params","readonly","ref","sbyte","sealed","sizeof","stackalloc",
    "struct","uint","ulong","unchecked","unsafe","ushort","using","virtual","void","volatile","as ",
    "base","bool","checked","decimal","delegate","event","explicit","extern","foreach","internal",
    "is ","lock","namespace"//c#
   ],
    _tag:3,
    _attr:4,
    _sign:["#","=","&gt;","&lt;","{","}","\\(","\\)","\\[","\\]",",","&&","\\.",
      "\\?","\\|","\\+","-",";\n",":","!","%","\\^"],//转义
  };
  J.ready(function(){
    J.tag("head").append(J.new("style").txt("editor{width:300px;height:200px;border:1px solid rgba(255,255,255,.5);display:inline-block;position:relative;white-space:pre;background-color:#222;border-radius:5px;overflow:hidden!important;font-size:18px;line-height:22px;min-width:245px!important;text-align:left!important}editor.j_full{position:fixed;top:0;left:0;width:100%!important;height:100%!important;border:0;border-radius:0;z-index:10000}.j_hidden{overflow:hidden!important}.code_editor,.code_editor_view{width:100%;background-color:transparent;font-size:inherit;padding:10px;line-height:inherit;font-family:Microsoft Yahei;overflow:auto;position:absolute;white-space:pre;border:0;outline:0;-webkit-appearance:none;word-break:break-all;word-wrap:normal;margin:0}.code_set_w{background-color:rgba(100,100,100,.6);width:100%;height:30px;position:absolute;top:0;border-radius:5px 5px 0 0;border-bottom:1px solid #aaa;text-align:right;padding-right:5px;white-space:normal;font-size:18px;line-height:22px}.code_set_w img{width:20px;height:20px;margin:5px 3px;cursor:pointer}.code_editor_view{background-color:transparent;color:transparent}.code_editor_view._bottom{color:#888}.code_editor{position:relative;color:rgba(255,255,255,.5);border-color:transparent;transition:background-color .3s;-o-transition:background-color .3s;-moz-transition:background-color .3s;-webkit-transition:background-color .3s;resize:none}.code_editor.bg{background-color:rgba(20,20,20,.9)}cd_key{color:#22b5ff}cd_sign{color:#f0d}cd_fun,cd_fun *{color:#001dff}cd_dfun,cd_dfun *{color:#b2ff00}cd_num{color:#fff}cd_tag,cd_tag *{color:#ff8d00}cd_str,cd_str *{color:red!important}cd_note,cd_note *{color:#019d00!important}"));
    Jcode.init();
  });

  function _tabEnable(obj){
    obj.on("keydown",_keyDown,true);
  }
  function _keyDown(e) {
    var a = '\t';
    var b = a.length;
    if (e.keyCode === 9) {
      e.preventDefault();
      var c = this.selectionStart,
        currentEnd = this.selectionEnd;
      if (e.shiftKey === false) {
        if (!_isMultiLine(this)) {
          this.value = this.value.slice(0, c) + a + this.value.slice(c);
          this.selectionStart = c + b;
          this.selectionEnd = currentEnd + b
        } else {
          var d = _findStartIndices(this),
            l = d.length,
            newStart = undefined,
            newEnd = undefined,
            affectedRows = 0;
          while (l--) {
            var f = d[l];
            if (d[l + 1] && c != d[l + 1]) f = d[l + 1];
            if (f >= c && d[l] < currentEnd) {
              this.value = this.value.slice(0, d[l]) + a + this.value.slice(d[l]);
              newStart = d[l];
              if (!newEnd) newEnd = (d[l + 1] ? d[l + 1] - 1 : 'end');
              affectedRows++
            }
          }
          this.selectionStart = newStart;
          this.selectionEnd = (newEnd !== 'end' ? newEnd + (b * affectedRows) : this.value.length)
        }
      } else {
        if (!_isMultiLine(this)) {
          if (this.value.substr(c - b, b) == a) {
            this.value = this.value.substr(0, c - b) + this.value.substr(c);
            this.selectionStart = c - b;
            this.selectionEnd = currentEnd - b
          } else if (this.value.substr(c - 1, 1) == "\n" && this.value.substr(c, b) == a) {
            this.value = this.value.substring(0, c) + this.value.substr(c + b);
            this.selectionStart = c;
            this.selectionEnd = currentEnd - b
          }
        } else {
          var d = _findStartIndices(this),
            l = d.length,
            newStart = undefined,
            newEnd = undefined,
            affectedRows = 0;
          while (l--) {
            var f = d[l];
            if (d[l + 1] && c != d[l + 1]) f = d[l + 1];
            if (f >= c && d[l] < currentEnd) {
              if (this.value.substr(d[l], b) == a) {
                this.value = this.value.slice(0, d[l]) + this.value.slice(d[l] + b);
                affectedRows++
              } else {}
              newStart = d[l];
              if (!newEnd) newEnd = (d[l + 1] ? d[l + 1] - 1 : 'end')
            }
          }
          this.selectionStart = newStart;
          this.selectionEnd = (newEnd !== 'end' ? newEnd - (affectedRows * b) : this.value.length)
        }
      }
    } else if (e.keyCode === 13 && e.shiftKey === false) {
      cursorPos = this.selectionStart,
      d = _findStartIndices(this),
      numStartIndices = d.length,
      startIndex = 0,
      endIndex = 0,
      tabMatch = new RegExp("^" + a.replace('\t', '\\t').replace(/ /g, '\\s') + "+", 'g'),
      lineText = '';
      tabs = null;
      for (var x = 0; x < numStartIndices; x++) {
        if (d[x + 1] && (cursorPos >= d[x]) && (cursorPos < d[x + 1])) {
          startIndex = d[x];
          endIndex = d[x + 1] - 1;
          break
        } else {
          startIndex = d[numStartIndices - 1];
          endIndex = this.value.length
        }
      }
      lineText = this.value.slice(startIndex, endIndex);
      tabs = lineText.match(tabMatch);
      if (tabs !== null) {
        e.preventDefault();
        var h = tabs[0];
        var i = h.length;
        var j = cursorPos - startIndex;
        if (i > j) {
          i = j;
          h = h.slice(0, j)
        }
        this.value = this.value.slice(0, cursorPos) + "\n" + h + this.value.slice(cursorPos);
        this.selectionStart = cursorPos + i + 1;
        this.selectionEnd = this.selectionStart
      }
    }
  }
  function _isMultiLine(a) {
    var b = a.value.slice(a.selectionStart, a.selectionEnd),
      nlRegex = new RegExp(/\n/);
    if (nlRegex.test(b)) return true;
    else return false
  }
  function _findStartIndices(a) {
    var b = a.value,
      startIndices = [],
      offset = 0;
    while (b.match(/\n/) && b.match(/\n/).length > 0) {
      offset = (startIndices.length > 0 ? startIndices[startIndices.length - 1] : 0);
      var c = b.search("\n");
      startIndices.push(c + offset + 1);
      b = b.substring(c + 1)
    }
    startIndices.unshift(0);
    return startIndices;
  }


  //html str note key fun sign
  //str key fun note
  //sign
  //html
  //lang style width height tab
  //(HTML)(Note,Str,Fun,Key,Num),(sign)
  //Note>Str>HTML>Fun>key>Num>sign

  //html  
  //sign

  function _getView(obj,i){
    if(i!=undefined){
      return obj.parent().child(i);
    }
    return obj.parent().findClass("code_editor_view");
  }
  function _codeChange(e){
    if(this.attr("jet-change")=="0"){
      this.attr("jet-change","1");
    }
    if(e.keyCode==13||e.keyCode==9){
      _geneViewCode(this);
    }
    //_geneViewCode();
  }
  function _geneViewCode(obj){
    //moveCursor();.replaceAll("<","&lt;").replaceAll(">","&gt;")
    var html=obj.val().replaceAll("<","&lt;").replaceAll(">","&gt;")+" ";//为了不让最后一个字符是换行
    html=_geneHtmlElement(html);
    html=_geneKey(html);
    html=_geneFun(html);
    //html=_geneDefineFun(html);
    html=_geneNumber(html);
    html=_geneString(html);
    html=_geneNote(html);
    html=_geneHtmlNote(html);
    _getView(obj,1).html(html); 
    
    var htmlSign=_geneSign(obj.val().replaceAll("<","&lt;").replaceAll(">","&gt;")+" ");
    _getView(obj,0).html(htmlSign); 
    _checkSizeAuto(obj);
  }
  function _checkSizeAuto(obj){
    _checkSizeAutoPart(obj,"height");
    _checkSizeAutoPart(obj,"width");
  }
  function _checkSizeAutoPart(obj,s){
    if(obj.data(s)=="auto"){
      var n=obj.prev().css(s);
      if(n=="auto"){
        setTimeout(function(){obj.css(s,obj.prev().css(s));},0);
      }else{
        obj.css(s,n);
      }
    }
  }

  function _geneSign(html){
    _code._sign.each(function(a){
      html=html.replaceAll(a,"<cd_sign>"+(a.has("\\")?a.substring(1):a)+"</cd_sign>");
    });
    return html;
  }
  function _geneDefineFun(html){//js
    var dFun=html.match(/(function)(.*?)(<)/g);
    if(dFun!=null){
      dFun.each(function(a,i){
        dFun[i]=a.substring(a.lastIndexOf(" ")+1,a.length-1);
      });
      dFun.sortByAttr("length",false);
      dFun.each(function(a,i){
        if(a!=""&&a!="function"){//匿名函数排除掉
          html=html.replaceAll(a,"<cd_dfun>"+a+"</cd_dfun>");
        }
      });
    }
    return html;
  }
  var _funReg=/(\.)(.*?)(\()/g;
  function _geneFun(html){
    var arr=html.match(_funReg);
    if(arr!=null){
      arr.each(function(a,i){
        arr[i]=arr[i].replace(a,a[0]+"<cd_fun>"+a.substring(1,a.length-1)+"</cd_fun>(");
      });
      return html.replaceAll(_funReg,arr);
    }
    return html;
  }
  function _geneKey(html){
    _code._key.each(function(a){
      html=html.replaceAll(a,"<cd_key>"+a+"</cd_key>");
    });
    return html;
  }
  function _geneHtmlElement(html){
    return _geneCommon(html,/(&lt;)(.*?)(&gt;)/g,"cd_tag");
  }
  function _geneNumber(html){
    return _geneCommon(html,/(\d+)/g,"cd_num");
  }
  function _geneString(html){
    return _geneCommon(html,/((")(.*?)("))|((')(.*?)('))/g,"cd_str");
  }
  function _geneNote(html){
    return _geneCommon(html,/((\/\/)(.*?)(\n))|((\/\*)((.|\n)*?)(\*\/))/g,"cd_note");
  }
  function _geneHtmlNote(html){
    return _geneCommon(html,/(&lt;!--)((.|\n)*?)(--&gt;)/g,"cd_note");
  }
  function _geneCommon(html,reg,tag){
    var arr=html.match(reg);
    if(arr!=null){
      arr.each(function(a,i){
        arr[i]="<"+tag+">"+a+"</"+tag+">";
      });
      html=html.replaceAll(reg,arr);
    }
    return html;
  }
})();
var Jcode;