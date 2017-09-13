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
};

function loadScript(src, fn, efn, force) {
    fn = fn || function () {
    };
    efn = efn || function () {
        console.log(src + ' -- load error !')
    };
    force = force || false;
    if (force) {
        src += '?t=' + new Date().getTime()
    }
    var obj = document.createElement("script");
    obj.type = "text/javascript";
    obj.setAttribute("load_type", "js");
    obj.setAttribute("charset", "utf-8");
    obj.src = src;
    obj.charset = 'utf-8';
    document.getElementsByTagName("head").item(0).appendChild(obj);
    if (obj.readyState) {
        if (obj.complete) {
            fn()
        } else {
            obj.onreadystatechange = function () {
                if (obj.readyState == "complete" || obj.readyState == "loaded") {
                    fn()
                }
            }
        }
    } else {
        obj.onload = function () {
            fn()
        }
    }
    obj.onerror = function () {
        efn()
    }
}

function loadCss(src, force) {
    var force = force || false;
    if (force) {
        src += '?t=' + new Date().getTime()
    }
    var obj = document.createElement('link');
    obj.rel = 'stylesheet';
    obj.type = 'text/css';
    obj.setAttribute("load_type", "css");
    obj.href = src;
    document.getElementsByTagName('head').item(0).appendChild(obj)
}

function isContains(child, parent) {
    while (child && child != parent) {
        child = child.parentNode
    }
    return (child == parent)
}

function isContainsClass(child, parentClass) {
    while (child && !$(child).hasClass(parentClass)) {
        child = child.parentNode
    }
    return ($(child).hasClass(parentClass))
}

function formatDate(unixTime) {
    var curDate = new Date(unixTime);
    return curDate.getFullYear() + "-" + (curDate.getMonth() + 1) + "-" + curDate.getDate() + " " + curDate.getHours() + ":" + curDate.getMinutes() + ":" + curDate.getSeconds()
}

function objClone(obj) {
    if (typeof(obj) != 'object') {
        return obj
    }
    var re = {};
    if (obj.constructor == Array) {
        re = []
    }
    for (var i in obj) {
        re[i] = objClone(obj[i])
    }
    return re
}

function addZero(str, length) {
    str = str + "";
    return new Array(length - str.length + 1).join("0") + str
}

function wheel(event) {
    if (_wheelEvent) {
        if (_wheelFun) {
            clearTimeout(_wheelFun)
        }
        _wheelEvent = false;
        if (!event) event = window.event;
        if (event.wheelDelta) {
            delta = event.wheelDelta
        } else if (event.detail) {
            delta = event.detail
        }
        var id = storage.get('selectCity');
        var cityList = storage.get("cityList");
        cityList = cityList.split(",");
        if (delta < 0) {
            $(".pageSwitch.next").click()
        } else {
            $(".pageSwitch.pre").click()
        }
        event.returnValue = true;
        _wheelFun = setTimeout(function () {
            _wheelEvent = true
        }, 400)
    }
}

function getOpts(wObject) {
    return {
        type: "basic",
        title: wObject.city + getI18nMsg("weather"),
        message: getI18nMsg("today") + wObject.tempsLow[0] + "~" + wObject.tempsHigh[0] + " " + wObject.weather1 + "\r\n" + wObject["wind1"],
        iconUrl: "http://hao.weidunewtab.com/tianqi/images/weather/" + wObject["img1"] + ".png",
        buttons: [{
            title: getI18nMsg("tomorrow") + " " + wObject.tempsLow[1] + "~" + wObject.tempsHigh[1] + " " + wObject["weather2"] + "," + wObject["wind2"],
            iconUrl: "images/weather/" + wObject["img2"] + ".png"
        }, {
            title: getI18nMsg("afterTomorrow") + " " + wObject.tempsLow[2] + "~" + wObject.tempsHigh[2] + " " + wObject["weather3"] + "," + wObject["wind3"],
            iconUrl: "images/weather/" + wObject["img3"] + ".png"
        }]
    }
}

function notificationShow() {
    if (storage.get("openNotification") == "1") {
        var date = new Date();
        var notificationDate = storage.get("notificationDate");
        var curDate = date.getFullYear().toString() + addZero((date.getMonth() + 1), 2) + addZero(date.getDate(), 2);
        if (notificationDate != curDate) {
            storage.set("notificationDate", curDate);
            if (storage.get("selectCity") == "0") {
                weather.getAutoCityId(function (cityID) {
                    if (typeof cityID == 'string' && cityID.substr(0, 5) != 'ERROR') {
                        var _weatherData = storage.get(cityID, true);
                        if (_weatherData != null && _weatherData != "" && _weatherData.lastrefresh > (new Date().getTime() - 60 * 60000)) {
                            var nObj = getOpts(_weatherData);
                            if (typeof chrome.notifications != 'undefined') {
                                chrome.notifications.create("", nObj, function (id) {
                                })
                            } else if (typeof webkitNotifications != 'undefined' && typeof webkitNotifications.createHTMLNotification != "undefined") {
                                var nMessage = getI18nMsg("today") + " " + _weatherData.tempsLow[0] + "~" + _weatherData.tempsHigh[0] + " " + _weatherData["weather1"] + "," + _weatherData["wind1"];
                                webkitNotifications.createNotification(nObj.iconUrl, nObj.title, nMessage).show()
                            }
                        }
                    }
                })
            } else {
                var _weatherData = storage.get(storage.get("selectCity"), true);
                if (_weatherData != null && _weatherData != "" && _weatherData.lastrefresh > (new Date().getTime() - 60 * 60000)) {
                    var nObj = getOpts(_weatherData);
                    if (typeof chrome.notifications != 'undefined') {
                        chrome.notifications.create("", nObj, function (id) {
                        })
                    } else if (typeof webkitNotifications != 'undefined' && typeof webkitNotifications.createHTMLNotification != "undefined") {
                        var nMessage = getI18nMsg("today") + " " + _weatherData.tempsLow[0] + "~" + _weatherData.tempsHigh[0] + " " + _weatherData["weather1"] + "," + _weatherData["wind1"];
                        webkitNotifications.createNotification(nObj.iconUrl, nObj.title, nMessage).show()
                    }
                }
            }
        }
    }
}

var _errorMsgFun = "";

function showErrorMsg(msg) {
    $(".errorMsg").html(msg);
    $(".errorMsg").show();
    clearTimeout(_errorMsgFun);
    _errorMsgFun = setTimeout(function () {
        $(".errorMsg").hide()
    }, 3000)
}

function getWeatherAnimationConfig(id) {
    var weatherAnimationConfig = {
        0: {'bg': 'sun', 'animation': ["sun"]},
        1: {'bg': 'cloud', 'animation': ["cloud"]},
        2: {'bg': 'cloud', 'animation': ["cloud"]},
        3: {'bg': 'sun', 'animation': ["sun"]},
        4: {'bg': 'rain', 'animation': ["moreCloud", "thunder", "rain"]},
        5: {'bg': 'rain', 'animation': ["moreCloud", "thunder", "rain"]},
        6: {'bg': 'rain', 'animation': ["rain"]},
        7: {'bg': 'rain', 'animation': ["rain"]},
        8: {'bg': 'rain', 'animation': ["rain"]},
        9: {'bg': 'rain', 'animation': ["rain"]},
        10: {'bg': 'rain', 'animation': ["moreCloud", "rain"]},
        11: {'bg': 'rain', 'animation': ["moreCloud", "rain"]},
        12: {'bg': 'rain', 'animation': ["moreCloud", "rain"]},
        13: {'bg': 'snow', 'animation': ["sun", "snow"]},
        14: {'bg': 'snow', 'animation': ["snow"]},
        15: {'bg': 'snow', 'animation': ["snow"]},
        16: {'bg': 'snow', 'animation': ["moreCloud", "snow"]},
        17: {'bg': 'snow', 'animation': ["moreCloud", "snow"]},
        18: {'bg': 'cloud', 'animation': ["cloud"]},
        19: {'bg': 'snow', 'animation': ["snow"]},
        20: {'bg': 'sun', 'animation': ["sun", "wind"]},
        21: {'bg': 'rain', 'animation': ["rain"]},
        22: {'bg': 'rain', 'animation': ["rain"]},
        23: {'bg': 'rain', 'animation': ["moreCloud", "rain"]},
        24: {'bg': 'rain', 'animation': ["moreCloud", "rain"]},
        25: {'bg': 'rain', 'animation': ["moreCloud", "rain"]},
        26: {'bg': 'snow', 'animation': ["snow"]},
        27: {'bg': 'snow', 'animation': ["snow"]},
        28: {'bg': 'snow', 'animation': ["moreCloud", "snow"]},
        29: {'bg': 'cloud', 'animation': ["cloud", "wind"]},
        30: {'bg': 'cloud', 'animation': ["moreCloud", "wind"]},
        31: {'bg': 'cloud', 'animation': ["moreCloud", "wind"]}
    };
    id = (typeof weatherAnimationConfig[id] != "undefined") ? id : 0;
    return weatherAnimationConfig[id]
}

function getGanzhiYmd(m) {
    var P = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63];
    var K = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    var J = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    var tg = ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"];
    var dz = ["申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未"];
    var sx = ["猴", "鸡", "狗", "猪", "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊"];
    var yearCyl, monCyl, dayCyl, year, month, day;
    var isLeap;
    var k, j = 0, h = 0;
    var l = new Date(1900, 0, 31);
    var n = (m - l) / 86400000;
    dayCyl = n + 40;
    monCyl = 14;
    for (k = 1900; k < 2050 && n > 0; k++) {
        var dh, dj = 348;
        for (dh = 32768; dh > 8; dh >>= 1) {
            dj += (P[k - 1900] & dh) ? 1 : 0
        }
        if (P[k - 1900] & 15) {
            h = dj + (P[k - 1900] & 65536 ? 30 : 29)
        } else {
            h = dj
        }
        n -= h;
        monCyl += 12
    }
    if (n < 0) {
        n += h;
        k--;
        monCyl -= 12
    }
    year = k;
    yearCyl = k - 1864;
    j = P[k - 1900] & 15;
    isLeap = false;
    for (k = 1; k < 13 && n > 0; k++) {
        if (j > 0 && k == (j + 1) && isLeap == false) {
            --k;
            isLeap = true;
            if (P[year - 1900] & 15) {
                h = ((P[year - 1900] & 65536) ? 30 : 29)
            } else {
                h = 0
            }
        } else {
            h = ((P[year - 1900] & (65536 >> k)) ? 30 : 29)
        }
        if (isLeap == true && k == (j + 1)) {
            isLeap = false
        }
        n -= h;
        if (isLeap == false) {
            monCyl++
        }
    }
    if (n == 0 && j > 0 && k == j + 1) {
        if (isLeap) {
            isLeap = false
        } else {
            isLeap = true;
            --k;
            --monCyl
        }
    }
    if (n < 0) {
        n += h;
        --k;
        --monCyl
    }
    month = k;
    day = n + 1;
    return {
        "year": K[(parseInt(yearCyl) % 10)] + J[(parseInt(yearCyl) % 12)],
        "month": K[(parseInt(monCyl) % 10)] + J[(parseInt(monCyl) % 12)],
        "day": K[(parseInt(dayCyl) % 10)] + J[(parseInt(dayCyl) % 12)],
        "dateString": " " + tg[m.getFullYear().toString().substr(m.getFullYear().toString().length - 1, 1)] + dz[m.getFullYear() % 12] + getI18nMsg("yearUnit") + " [ " + sx[m.getFullYear() % 12] + getI18nMsg("yearUnit") + " ]"
    }
};(function ($) {
    $.storage = function () {
        return new storage()
    };
    var storage = (function () {
        var storage = function () {
        };
        storage.prototype = {
            db: localStorage, get: function (key, isJson) {
                try {
                    return isJson === true ? JSON.parse(this.db.getItem(key)) : this.db.getItem(key)
                } catch (err) {
                    console.log(err);
                    return null
                }
            }, set: function (key, value, isJson) {
                try {
                    if (isJson === true) {
                        this.db.setItem(key, JSON.stringify(value))
                    } else {
                        this.db.setItem(key, value)
                    }
                } catch (err) {
                    console.log(err)
                }
            }, remove: function (key) {
                try {
                    this.db.removeItem(key)
                } catch (err) {
                    console.log(err)
                }
            }
        };
        return storage
    })()
})(jQuery);
(function ($) {
    $.weather = function () {
        return new weather()
    };
    $.fn.weather = function () {
        return new weather(this)
    };
    var weather = (function (el) {
        var weather = function (el) {
            if (typeof el != "undefined") {
                this.container = el
            }
            this.init()
        };
        weather.prototype = {
            container: "", init: function (id, refresh) {
                var self = this;
                if (typeof id == "undefined" || id == "") {
                    id = storage.get('selectCity')
                }
                var _cityList = storage.get('cityList');
                _cityList = _cityList.split(',');
                if (_cityList.indexOf(id) == -1) {
                    self.init(_cityList[0]);
                    return
                }
                if (typeof refresh != "undefined" && refresh === true) {
                    var _curStorage = objClone(storage.db);
                    $.each(_curStorage, function (i, n) {
                        var reg = /^\d+$/;
                        if (reg.test(i)) {
                            storage.remove(i)
                        }
                    })
                }
                storage.set("selectCity", id);
                self.loadData(id)
            }, loadData: function (id) {
                var self = this;
                if (id == 0) {
                    self.getAutoCityId()
                } else {
                    var data = storage.get(id, true);
                    if (data == null || data.lastrefresh <= (new Date().getTime() - 60 * 60000)) {
                        self.getWeatherData(id)
                    } else {
                        setTimeout(function () {
                            self.fillData(data)
                        }, 100)
                    }
                }
            }, fillData: function (weahterObj) {
                var self = this;
                var date = new Date();
                var skin = storage.get('skin', true);
                var skinPath = "http://hao.weidunewtab.com/tianqi/skin/" + skin.id + "/";
                chrome.browserAction.setIcon({path: "images/weather/" + weahterObj["img1"] + ".png"});
                chrome.browserAction.setBadgeBackgroundColor({color: [0, 97, 255, parseInt(0.5 * 255)]});
                chrome.browserAction.setBadgeText({text: weahterObj.temp.toString()});
                var browserTip = weahterObj.city + getI18nMsg('curTemp') + weahterObj.temp + '\r\n' + getI18nMsg('today') + weahterObj.weather1 + " " + weahterObj.tempsLow[0] + "~" + weahterObj.tempsHigh[0] + '\r\n' + getI18nMsg('tomorrow') + weahterObj.weather2 + " " + weahterObj.tempsLow[1] + "~" + weahterObj.tempsHigh[1] + '\r\n' + getI18nMsg('afterTomorrow') + weahterObj.weather3 + " " + weahterObj.tempsLow[2] + "~" + weahterObj.tempsHigh[2] + '\r\n\r\n' + getI18nMsg('lastRefresh') + formatDate(weahterObj.lastrefresh);
                chrome.browserAction.setTitle({title: browserTip});
                if (self.container != "") {
                    var bgImg = new Image();
                    var weatherAnimationConfig = getWeatherAnimationConfig(weahterObj.img1);
                    var bgImgUrl = skinPath + weatherAnimationConfig['bg'] + ".jpg";
                    self.container.parent().css('backgroundImage', 'url(' + bgImgUrl + ')');
                    self.container.find('.num').html('<a href="http://www.weather.com.cn/weather/' + weahterObj.id + '.shtml" target="_blank">' + weahterObj.temp + '</a>');
                    if (weahterObj.temp.indexOf("-") > -1) {
                        self.container.find('.num').addClass("s")
                    } else {
                        self.container.find('.num').removeClass("s")
                    }
                    self.container.find('.detail').html('<a href="http://www.weather.com.cn/weather/' + weahterObj.id + '.shtml" target="_blank">' + getI18nMsg("detail") + '</a>');
                    self.container.find('.todayTemp').html(self.getTemp(weahterObj.temp1, 1) + "~" + self.getTemp(weahterObj.temp1, 0));
                    self.container.find('.desc').html(weahterObj.weather1);
                    self.container.find('.humidity').html(getI18nMsg("humidity") + " " + weahterObj.SD);
                    self.container.find('.wind').html(weahterObj.wind1);
                    var ganzhi = getGanzhiYmd(new Date());
                    self.container.find('.dateBasic').html((date.getMonth() + 1).toString() + "/" + date.getDate().toString() + " " + ganzhi.dateString);
                    self.container.find('.dateMore').html("[ " + getI18nMsg("permanentCalendar") + " ▶ ]");
                    self.container.find('.pmValue').css("color", self.getPMColor(weahterObj.PM25));
                    self.container.find('.pmValue').html(weahterObj.PM25);
                    if (weahterObj.PM25 == getI18nMsg("PMNull")) {
                        self.container.find('.pmUrl').hide();
                        self.container.find('.pmValue').removeAttr("title");
                        self.container.find('.pmValue').removeAttr("href")
                    } else {
                        self.container.find('.pmValue').attr("title", weahterObj.AQIPrompt);
                        self.container.find('.pmValue').attr("href", weahterObj.PM25Url);
                        self.container.find('.pmValue').attr("target", "_blank");
                        self.container.find('.pmUrl').css("color", self.getPMColor(weahterObj.PM25));
                        self.container.find('.pmUrl').attr("title", weahterObj.AQIPrompt);
                        self.container.find('.pmUrl').show();
                        self.container.find('.pmUrl').attr("href", weahterObj.PM25Url);
                        self.container.find('.pmUrl').attr("target", "_blank")
                    }
                    self.container.find('.cityName').html(weahterObj.city);
                    var curTimeStamp = Date.parse(weahterObj.date_y.replace(getI18nMsg('yearUnit'), "/").replace(getI18nMsg('monthUnit'), "/").replace(getI18nMsg('dateUnit'), "/"));
                    var weekWeatherHtml = '';
                    for (var i = 1; i < 6; i++) {
                        var curDate = new Date(curTimeStamp + (i - 1) * 3600 * 24 * 1000);
                        weekWeatherHtml += '<div class="weatherItem"><div class="img" title="' + weahterObj['weather' + i] + ',' + weahterObj['wind' + i] + '" style="background-image:url(images/weather/' + weahterObj["img" + i] + '.png);"></div><div class="info"><div class="week">' + getI18nMsg('weekDate_' + curDate.getDay()) + ' / ' + curDate.getDate() + getI18nMsg("dateUnit") + '</div><div class="weather">' + weahterObj['weather' + i] + '</div><div class="desc">' + weahterObj.tempsLow[i - 1] + "~" + weahterObj.tempsHigh[i - 1] + '</div></div></div>'
                    }
                    self.container.find('.weekWeather').html(weekWeatherHtml);
                    var temps = [parseInt(weahterObj.tempsHigh[0]), parseInt(weahterObj.tempsHigh[1]), parseInt(weahterObj.tempsHigh[2]), parseInt(weahterObj.tempsHigh[3]), parseInt(weahterObj.tempsHigh[4])];
                    self.container.find(".weekWeather").drawLine(temps);
                    var selectCity = storage.get('selectCity');
                    var _cityList = storage.get('cityList');
                    _cityList = _cityList.split(',');
                    var _cityNameList = storage.get('cityNameList');
                    _cityNameList = _cityNameList.split(',');
                    self.container.find(".navigate").css('left', 270 - (_cityList.length * 20 / 2) + "px");
                    self.container.find('.navigate').empty();
                    if (_cityList.length > 1) {
                        for (var i = 0; i < _cityList.length; i++) {
                            if (parseInt(selectCity) == _cityList[i]) {
                                self.container.find('.navigate').append('<span class="curr" cityID="' + _cityList[i] + '"></span>')
                            } else {
                                self.container.find('.navigate').append('<span class="page" cityID="' + _cityList[i] + '" title="' + _cityNameList[i] + '"></span>')
                            }
                        }
                    }
                    self.container.find('.navigate').find(".page").unbind('click').bind('click', function () {
                        var selectID = $(this).attr("cityID");
                        self.container.parent().animate({opacity: "0"}, 100, function () {
                            self.init(selectID)
                        })
                    });
                    if (_cityList.length > 1) {
                        var _cityIndex = _cityList.indexOf(selectCity);
                        self.container.find(".pageSwitch").show();
                        self.container.find(".pageSwitch").unbind('click').bind('click', function () {
                            if ($(this).hasClass('next')) {
                                _cityIndex++
                            } else {
                                _cityIndex--
                            }
                            if (_cityIndex < 0) {
                                _cityIndex = _cityList.length - 1
                            } else if (_cityIndex > _cityList.length - 1) {
                                _cityIndex = 0
                            }
                            self.container.parent().animate({opacity: "0"}, 100, function () {
                                self.init(_cityList[_cityIndex])
                            })
                        })
                    } else {
                        self.container.find(".pageSwitch").hide();
                        self.container.find(".pageSwitch").unbind('click')
                    }
                    self.container.find('.dress').html(weahterObj.ds);
                    if (weahterObj.ds == getI18nMsg("tempNull")) {
                        self.container.find('.dress').css("cursor", "text");
                        self.container.find('.dress').attr('title', "")
                    } else {
                        self.container.find('.dress').attr('title', weahterObj.zs);
                        self.container.find('.dress').css("cursor", "pointer")
                    }
                    self.container.find('.light').html(weahterObj.uv);
                    self.container.find('.trval').html(weahterObj.ly);
                    self.container.find('.wash').html(weahterObj.xc);
                    self.container.show();
                    self.container.css("opacity", "1");
                    self.container.parent().animate({opacity: "1"}, 100);
                    setTimeout(function () {
                        var weatherAnimation = self.container.weatherAnimation();
                        weatherAnimation.clear();
                        weatherAnimation.run(weatherAnimationConfig['animation'])
                    }, 0);
                    if (storage.get("autoTip") == "1") {
                        self.container.find(".tipsData").show();
                        self.container.find(".tipsData ul").css("height", "190px");
                        self.container.find(".tipsData ul").show()
                    }
                    self.container.find(".tips").unbind("click").bind("click", function (e) {
                        if (self.container.find(".tipsData").css("display") != "none") {
                            storage.set("autoTip", "0");
                            self.container.find(".tipsData ul").animate({height: "0px"}, 200, function () {
                                self.container.find(".tipsData ul").hide();
                                self.container.find(".tipsData").hide()
                            })
                        } else {
                            storage.set("autoTip", "1");
                            self.container.find(".tipsData").show();
                            self.container.find(".tipsData ul").show();
                            self.container.find(".tipsData ul").animate({height: "190px"}, 200)
                        }
                    });
                    self.container.find(".refresh").unbind("click").bind("click", function () {
                        self.container.parent().animate({opacity: "0"}, 100, function () {
                            self.init("", true)
                        })
                    });
                    self.container.find(".setting").unbind("click").bind("click", function () {
                        window.onmousewheel = null;
                        if (weatherSetting == null) {
                            weatherSetting = self.container.next('.settingData').weatherSetting()
                        }
                        self.container.animate({opacity: 0}, 100, function () {
                            self.container.hide();
                            $(".settingData").show();
                            $(".settingData").animate({height: "320px"}, 200)
                        })
                    });
                    self.fillLunarCalendar();
                    window.onmousewheel = wheel;
                    self.container.find(".date").unbind("click").bind("click", function () {
                        window.onmousewheel = null;
                        if (typeof calendar == "undefined") {
                            loadCss("./js/calendar/css/calendar.css");
                            loadScript("./js/calendar/calendar.js", function () {
                                calendar.init()
                            })
                        } else {
                            calendar.init()
                        }
                        self.container.animate({opacity: 0}, 100, function () {
                            self.container.hide();
                            $(".calendar").show();
                            $(".calendar").animate({height: "320px"}, 200)
                        })
                    })
                }
            }, fillLunarCalendar: function () {
                var self = this;
                var date = new Date();
                var lunarAPI = "http://hao.weidunewtab.com/tianqi/huangli/index.php";
                var curDate = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString();
                var lunarCalendar = storage.get('lunarCalendar', true);
                if (lunarCalendar != null && lunarCalendar.time == curDate) {
                    self.container.find('.fitting').attr('title', lunarCalendar['y']);
                    self.container.find('.fitting').html(lunarCalendar['y'].indexOf(" ", 8) == -1 ? lunarCalendar['y'] : lunarCalendar['y'].substr(0, lunarCalendar['y'].indexOf(" ", 8)));
                    self.container.find('.notFitting').attr('title', lunarCalendar['j']);
                    self.container.find('.notFitting').html(lunarCalendar['j'].indexOf(" ", 8) == -1 ? lunarCalendar['j'] : lunarCalendar['j'].substr(0, lunarCalendar['j'].indexOf(" ", 8)))
                } else {
                    $.ajax({
                        url: lunarAPI + "?t=" + curDate, dataType: "json", timeout: 3000, success: function (data) {
                            var _lunarCalendar = {};
                            _lunarCalendar['y'] = data.y.replace(/\./ig, " ");
                            _lunarCalendar['j'] = data.j.replace(/\./ig, " ");
                            _lunarCalendar.time = curDate;
                            storage.set('lunarCalendar', _lunarCalendar, true);
                            self.fillLunarCalendar()
                        }, error: function () {
                            showErrorMsg(getI18nMsg("huangliFail"))
                        }
                    })
                }
            }, getAutoCityId: function (fn) {
                var self = this;
                var autoCityAPI = "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json";
                var cityIDAPI = "http://hao.weidunewtab.com/tianqi/city.php";
                var cityID = 101010100;
                $.ajax({
                    url: autoCityAPI + "&t=" + new Date().getTime(), dataType: "json", success: function (result) {
                        if (typeof result == 'object') {
                            if (result.city) {
                                $.ajax({
                                    url: cityIDAPI + "?city=" + result.city, timeout: 3000, success: function (data) {
                                        if (typeof fn == "function") {
                                            fn(data)
                                        } else {
                                            if (typeof data == 'string' && data.substr(0, 5) != 'ERROR') {
                                                cityID = data
                                            }
                                            self.loadData(cityID)
                                        }
                                    }, error: function () {
                                        if (typeof fn != "function") {
                                            self.loadData(cityID)
                                        }
                                    }
                                })
                            } else {
                                if (typeof fn != "function") {
                                    self.loadData(cityID)
                                }
                            }
                        }
                    }, error: function () {
                        if (typeof fn != "function") {
                            self.loadData(cityID)
                        }
                    }
                })
            }, getWeatherData: function (id) {
                var self = this;
                var curAPI = 'http://hao.weidunewtab.com/myapp/weather/data/indexInTime.php?cityID=' + id;
                var totalAPI = 'http://hao.weidunewtab.com/myapp/weather/data/index.php?cityID=' + id;
                $.ajax({
                    url: totalAPI + '&t=' + new Date().getTime(), timeout: 3000, dataType: 'json', error: function () {
                        showErrorMsg(getI18nMsg("weatherFail"));
                        clearTimeout(_errorMsgFun)
                    }, success: function (result) {
                        var totalAPIObj = result;
                        var extra = totalAPIObj.weatherinfo.extra;
                        if (extra) {
                            storage.set('extra', extra, true)
                        } else {
                            storage.remove('extra')
                        }
                        $.ajax({
                            url: curAPI + '&t=' + new Date().getTime(),
                            timeout: 3000,
                            dataType: 'json',
                            error: function () {
                                showErrorMsg(getI18nMsg("weatherFail"));
                                clearTimeout(_errorMsgFun)
                            },
                            success: function (data) {
                                var weatherObj = {};
                                weatherObj.temp = data.weatherinfo.temp;
                                if (weatherObj.temp == getI18nMsg('tempIsNull')) {
                                    weatherObj.temp = getI18nMsg('tempNull')
                                } else {
                                    weatherObj.temp += "º"
                                }
                                weatherObj.SD = data.weatherinfo.SD;
                                weatherObj.time = totalAPIObj.weatherinfo.time;
                                weatherObj.date_y = totalAPIObj.weatherinfo.date_y;
                                weatherObj.city = totalAPIObj.weatherinfo.city;
                                weatherObj.temp1 = totalAPIObj.weatherinfo.temp1;
                                weatherObj.temp2 = totalAPIObj.weatherinfo.temp2;
                                weatherObj.img1 = totalAPIObj.weatherinfo.img1;
                                weatherObj.img2 = totalAPIObj.weatherinfo.img3;
                                weatherObj.img3 = totalAPIObj.weatherinfo.img5;
                                weatherObj.img4 = totalAPIObj.weatherinfo.img7;
                                weatherObj.img5 = totalAPIObj.weatherinfo.img9;
                                weatherObj.ds = totalAPIObj.weatherinfo.index == "" ? getI18nMsg("tempNull") : totalAPIObj.weatherinfo.index;
                                weatherObj.ly = totalAPIObj.weatherinfo.index_tr == "" ? getI18nMsg("tempNull") : totalAPIObj.weatherinfo.index_tr;
                                weatherObj.xc = totalAPIObj.weatherinfo.index_xc == "" ? getI18nMsg("tempNull") : totalAPIObj.weatherinfo.index_xc;
                                weatherObj.zs = totalAPIObj.weatherinfo.index_d == "" ? getI18nMsg("tempNull") : totalAPIObj.weatherinfo.index_d;
                                weatherObj.uv = totalAPIObj.weatherinfo.index_uv == "" ? getI18nMsg("tempNull") : totalAPIObj.weatherinfo.index_uv;
                                weatherObj.zs48 = totalAPIObj.weatherinfo.index48_d == "" ? getI18nMsg("tempNull") : totalAPIObj.weatherinfo.index48_d;
                                weatherObj.uv48 = totalAPIObj.weatherinfo.index48_uv == "" ? getI18nMsg("tempNull") : totalAPIObj.weatherinfo.index48_uv;
                                weatherObj.weather1 = totalAPIObj.weatherinfo.weather1;
                                weatherObj.weather2 = totalAPIObj.weatherinfo.weather2;
                                weatherObj.weather3 = totalAPIObj.weatherinfo.weather3;
                                weatherObj.weather4 = totalAPIObj.weatherinfo.weather4;
                                weatherObj.weather5 = totalAPIObj.weatherinfo.weather5;
                                weatherObj.wind1 = totalAPIObj.weatherinfo.wind1;
                                weatherObj.wind2 = totalAPIObj.weatherinfo.wind2;
                                weatherObj.wind3 = totalAPIObj.weatherinfo.wind3;
                                weatherObj.wind4 = totalAPIObj.weatherinfo.wind4;
                                weatherObj.wind5 = totalAPIObj.weatherinfo.wind5;
                                weatherObj.tempsHigh = [];
                                weatherObj.tempsLow = [];
                                weatherObj.tempsHigh.push(self.getTemp(totalAPIObj.weatherinfo.temp1, 0));
                                weatherObj.tempsHigh.push(self.getTemp(totalAPIObj.weatherinfo.temp2, 0));
                                weatherObj.tempsHigh.push(self.getTemp(totalAPIObj.weatherinfo.temp3, 0));
                                weatherObj.tempsHigh.push(self.getTemp(totalAPIObj.weatherinfo.temp4, 0));
                                weatherObj.tempsHigh.push(self.getTemp(totalAPIObj.weatherinfo.temp5, 0));
                                weatherObj.tempsLow.push(self.getTemp(totalAPIObj.weatherinfo.temp1, 1));
                                weatherObj.tempsLow.push(self.getTemp(totalAPIObj.weatherinfo.temp2, 1));
                                weatherObj.tempsLow.push(self.getTemp(totalAPIObj.weatherinfo.temp3, 1));
                                weatherObj.tempsLow.push(self.getTemp(totalAPIObj.weatherinfo.temp4, 1));
                                weatherObj.tempsLow.push(self.getTemp(totalAPIObj.weatherinfo.temp5, 1));
                                weatherObj.lastrefresh = new Date().getTime();
                                weatherObj.id = id;
                                storage.set(id, weatherObj, true);
                                self.getPMData(id, weatherObj)
                            }
                        })
                    }
                })
            }, getPMData: function (id, weatherObj) {
                var self = this;
                var pmAPI = 'http://hao.weidunewtab.com/tianqi/json/index.php';
                $.ajax({
                    url: pmAPI + '?id=' + id + '&t=' + new Date().getTime(),
                    dataType: "json",
                    timeout: 3000,
                    success: function (data) {
                        if (data == null || data == "") {
                            weatherObj.PM25 = getI18nMsg('PMNull');
                            weatherObj.PM25Url = "";
                            weatherObj.AQIPrompt = ""
                        } else {
                            weatherObj.PM25 = self.getPMLv(data.AQIValue);
                            weatherObj.PM25Url = data.url;
                            weatherObj.AQIPrompt = getI18nMsg("PM25Index") + data.AQIValue + "，" + data.AQIPrompt
                        }
                        weatherObj.lastrefresh = new Date().getTime();
                        storage.set(id, weatherObj, true);
                        self.fillData(weatherObj)
                    },
                    error: function () {
                        showErrorMsg(getI18nMsg("pm25Fail"));
                        self.fillData(weatherObj)
                    }
                })
            }, getTemp: function (str, isLow) {
                var _temps = str.split('~');
                var _returnTemps = [];
                if (parseInt(_temps[0].replace("℃", "")) < parseInt(_temps[1].replace("℃", ""))) {
                    _returnTemps[0] = _temps[1];
                    _returnTemps[1] = _temps[0]
                } else {
                    _returnTemps = _temps
                }
                return _returnTemps[isLow]
            }, getPMLv: function (val) {
                if (val >= 0 && val <= 50) {
                    return getI18nMsg("fine")
                } else if (val > 50 && val <= 100) {
                    return getI18nMsg("good")
                } else if (val > 100 && val <= 150) {
                    return getI18nMsg("lightPollution")
                } else if (val > 150 && val <= 200) {
                    return getI18nMsg("middleLevelPollution")
                } else if (val > 200 && val <= 300) {
                    return getI18nMsg("severePollution")
                } else if (val > 300) {
                    return getI18nMsg("severeContamination")
                } else {
                    return getI18nMsg("PMNull")
                }
            }, getPMColor: function (val) {
                if (val == getI18nMsg("fine")) {
                    return '#00e400'
                } else if (val == getI18nMsg("good")) {
                    return '#ffda00'
                } else if (val == getI18nMsg("lightPollution")) {
                    return '#ff7e00'
                } else if (val == getI18nMsg("middleLevelPollution")) {
                    return '#ff0000'
                } else if (val == getI18nMsg("severePollution")) {
                    return '#99004c'
                } else if (val == getI18nMsg("severeContamination")) {
                    return '#7e0023'
                } else {
                    return '#FFF'
                }
            }
        };
        return weather
    })()
})(jQuery);
(function ($) {
    $.fn.weatherSetting = function () {
        return new weatherSetting(this)
    };
    var weatherSetting = (function (el) {
        var weatherSetting = function (el) {
            if (typeof el != "undefined") {
                this.container = el
            }
            this.init()
        };
        weatherSetting.prototype = {
            container: "", cityList: "", cityNameList: "", init: function () {
                var self = this;
                self.container.append(self.template());
                if (storage.get("openNotification") != "0") {
                    self.container.find('#openNotification').attr("checked", "checked")
                }
                if (storage.get("isSundayLast") != "0") {
                    self.container.find('#isSundayLast').attr("checked", "checked")
                }
                self.container.find('#openNotification').unbind('click').bind('click', function () {
                    if ($(this).attr("checked") == "checked") {
                        storage.set('openNotification', 1)
                    } else {
                        storage.set('openNotification', "0")
                    }
                });
                self.container.find('#isSundayLast').unbind('click').bind('click', function () {
                    if ($(this).attr("checked") == "checked") {
                        storage.set('isSundayLast', 1)
                    } else {
                        storage.set('isSundayLast', "0")
                    }
                });
                self.container.find('.back').unbind('click').bind('click', function () {
                    self.container.animate({height: "0px"}, 200, function () {
                        self.container.hide();
                        self.container.find(".selectCityManage").hide();
                        weather.init("")
                    })
                });
                self.cityList = storage.get('cityList').split(',');
                self.cityNameList = storage.get('cityNameList').split(',');
                $.each(self.cityList, function (i, n) {
                    self.container.find(".add").parent().before('<div class="cityItem"><div class="city">' + self.cityNameList[i] + '</div><div class="delete" cityID="' + n + '" cityName="' + self.cityNameList[i] + '"></div></div>')
                });
                self.container.find(".delete").unbind("click").bind("click", function () {
                    if (self.cityList.length > 1) {
                        var _index = self.cityList.indexOf($(this).attr("cityID").toString());
                        self.cityList.splice(_index, 1);
                        self.cityNameList.splice(self.cityNameList.indexOf($(this).attr("cityName")), 1);
                        $(this).parent().remove();
                        storage.set('cityList', self.cityList.join(","));
                        storage.set('cityNameList', self.cityNameList.join(","))
                    } else {
                        showErrorMsg(getI18nMsg('isLastCityError'))
                    }
                });
                self.container.find(".add").unbind('click').bind('click', function () {
                    self.container.find(".selectCityManage").show()
                });
                self.container.find(".selectCity").selectCity(function (result) {
                    if (self.cityList.indexOf(result[0]) == -1 && self.cityNameList.indexOf(result[1]) == -1) {
                        self.cityList.push(result[0].toString());
                        self.cityNameList.push(result[1]);
                        var cityObj = $('<div class="cityItem"><div class="city">' + result[1] + '</div><div class="delete" cityID="' + result[0] + '" cityName="' + result[1] + '"></div></div>');
                        cityObj.find('.delete').unbind("click").bind("click", function () {
                            if (self.cityList.length > 1) {
                                var _index = self.cityList.indexOf($(this).attr("cityID").toString());
                                self.cityList.splice(_index, 1);
                                self.cityNameList.splice(self.cityNameList.indexOf($(this).attr("cityName")), 1);
                                $(this).parent().remove();
                                storage.set('cityList', self.cityList.join(","));
                                storage.set('cityNameList', self.cityNameList.join(","))
                            } else {
                                showErrorMsg(getI18nMsg('isLastCityError'))
                            }
                        });
                        self.container.find(".add").before(cityObj);
                        storage.set('cityList', self.cityList.join(","));
                        storage.set('cityNameList', self.cityNameList.join(","))
                    }
                });
                var skinAPI = "http://hao.weidunewtab.com/tianqi/skin/skin.json";
                var skin = storage.get('skin', true);
                var selectSkin = skin.id;
                $.ajax({
                    url: skinAPI + "?t=" + new Date().getTime(),
                    dataType: "json",
                    timeout: 3000,
                    success: function (data) {
                        $.each(data, function (i, n) {
                            var skinObj = $('<input type="radio" name="skin" id="skin_' + n.id + '" value="' + n.id + '" title="' + n.name + '" ' + (selectSkin == n.id ? "checked" : "") + '/><label for="skin_' + n.id + '" class="skinName">' + n.name + '</label>');
                            $(skinObj[0]).unbind("click").bind("click", function () {
                                storage.set('skin', {"id": $(this).val(), "name": $(this).attr("title")}, true);
                                var _bgImg = self.container.parent().css("backgroundImage");
                                _bgImg = _bgImg.replace(/\/\d+\//, '/' + $(this).val() + '/');
                                self.container.parent().css("backgroundImage", _bgImg)
                            });
                            self.container.find(".skinList").append(skinObj)
                        })
                    },
                    error: function () {
                        showErrorMsg(getI18nMsg("skinFail"))
                    }
                })
            }, template: function () {
                return '<div class="back"></div><div class="helpBanner"><a href="help/help.html" target="_blank">' + getI18nMsg('update') + '</a><a href="help/help.html#middle" target="_blank">' + getI18nMsg('suggest') + '</a></div><div class="settingOptions"><div class="optionItem"><div class="optionName">' + getI18nMsg('skinManage') + '</div><div class="skinList"></div></div><div class="optionItem"><div class="optionName">' + getI18nMsg('cityManage') + '</div><div class="cityList"><div class="cityItem"><div class="city add"></div></div></div></div><div class="optionItem selectCityManage" style="display:none;"><div class="optionName">' + getI18nMsg('selectCity') + '</div><div class="selectCity"></div></div><div class="optionItem"><div class="optionName">' + getI18nMsg('openNotification') + '</div><div><input type="checkbox" id="openNotification"/><label for="openNotification" class="notificationName">' + getI18nMsg('notification') + '</label></div></div><div class="optionItem"><div class="optionName">' + getI18nMsg('isSundayLast') + '</div><div><input type="checkbox" id="isSundayLast"/></div></div>'
            }
        };
        return weatherSetting
    })()
})(jQuery);