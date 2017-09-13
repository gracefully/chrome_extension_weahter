var storage = new $.storage(), version = '5.3.7';
if (storage.get('skin') == null || storage.get('skin') == "") {
    storage.set('skin', {"id": "0", "name": getI18nMsg('defaultSkin')}, true)
}
if (storage.get('selectCity') == null || storage.get('selectCity') == "") {
    storage.set('selectCity', '0')
}
if (storage.get('CurrentVersion') < '5.0.0') {
    storage.remove('dateSelect');
    storage.remove('showLunar');
    storage.remove('dsCodeMode');
    storage.remove('timeSpan');
    storage.remove('tempCurveColor');
    storage.remove('realtimeColor');
    storage.remove('autoOpen');
    storage.remove('showInTab');
    storage.remove('isSundayFirst');
    storage.remove('dayCount')
}
if (storage.get('cityList') == null || storage.get('cityList') == "" || storage.get('cityNameList') == null || storage.get('cityNameList') == "") {
    storage.set('cityList', '0');
    storage.set('cityNameList', getI18nMsg('autoCity'))
}
if (storage.get('CurrentVersion') == null || storage.get('CurrentVersion') == "" || version > storage.get('CurrentVersion')) {
    storage.set('CurrentVersion', version)
}
if (storage.get('openNotification') == null || storage.get('openNotification') == "") {
    storage.set('openNotification', 1)
}
var _curStorage = objClone(storage.db);
var _cityList = storage.get('cityList');
var reg = /^\d+$/;
_cityList = _cityList.split(',');
$.each(_curStorage, function (i, n) {
    if (reg.test(i) && _cityList.indexOf(i) == -1) {
        storage.remove(i)
    }
});
var weather = new $.weather();
setInterval(function () {
    weather.init()
}, 10 * 60000);
setTimeout(function () {
    notificationShow()
}, 10000);
setInterval(function () {
    notificationShow()
}, 60000 * 60);