function getI18nMsg(msgname) {
    try {
        return chrome.i18n.getMessage(msgname)
    } catch (err) {
        return msgname
    }
};

function initChromeI18n(obj) {
    var _data, key, _mKey;
    var arr = ['content', 'value', 'title', 'placeholder'];
    for (var i = 0, l = arr.length; i < l; i++) {
        _mKey = arr[i];
        key = 'data-i18n-' + _mKey + '';
        if (typeof obj != 'undefined') {
            _data = obj.find('[' + key + ']')
        } else {
            _data = $('[' + key + ']')
        }
        if (_data.length > 0) {
            for (var n = 0; n < _data.length; n++) {
                var message = getI18nMsg(_data[n].getAttribute(key));
                if (message) {
                    switch (_mKey) {
                        case'content':
                            $(_data[n]).html(message);
                            break;
                        case'value':
                            $(_data[n]).val(message);
                            break;
                        default:
                            $(_data[n]).attr(_mKey, message)
                    }
                }
            }
        }
    }
};$(document).ready(function () {
    initChromeI18n();
    $.ajax({
        url: "http://hao.weidunewtab.com/tianqi/update.htm", timeout: 3000, success: function (data) {
            $(".top3").html(data)
        }, error: function () {
            $(".top3").html(getI18nMsg('updateFail'))
        }
    });
    $("#commit").click(function () {
        var content = $("#content").val();
        var email = $("#email").val();
        if (content != '') {
            $.ajax({
                url: "http://hao.weidunewtab.com/weidu/suggest_weather.php",
                data: {comments: content, email: email},
                type: "post",
                timeout: 3000,
                success: function (data) {
                    if (data == 'SUCCESS') {
                        alert(getI18nMsg('commitSuccess'));
                        window.location.reload(true)
                    }
                },
                error: function () {
                }
            })
        }
    })
});