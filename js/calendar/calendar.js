(function($){$.fn.calendar=function(){return new calendar(this)};var calendar=(function(el){var calendar=function(el){this.container=el};calendar.prototype={container:"",content:"",year:"",month:"",today:{},dateList:[],almanac:{},solarTermsDate:[],lunarOpts:[0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0],solarTermsOpts:[5.4055,20.12,3.87,18.73,5.63,20.646,4.81,20.1,5.52,21.04,5.678,21.37,7.108,22.83,7.5,23.13,7.646,23.042,8.318,23.438,7.438,22.36,7.18,21.94,5.4055,20.12],solarTermsName:["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至","小寒","大寒"],IFestival:{"0101":"元旦节","0214":"情人节","0305":"雷锋日","0308":"妇女节","0312":"植树节","0401":"愚人节","0501":"劳动节","0504":"青年节","0601":"儿童节","0701":"建党日","0801":"建军节","0910":"教师节","1001":"国庆节","1224":"平安夜","1225":"圣诞节"},TFestival:{"正月初一":"春节","正月初五":"破五","二月初二":"春龙节","五月初六":"立夏节","七月十五":"盂兰盆节","七月三十":"地藏节","腊月廿三":"小年","腊月三十":"除夕","正月十五":"元宵节","五月初五":"端午节","七月初七":"乞巧节","八月十五":"中秋节","九月初九":"重阳节","腊月初八":"腊八节","腊月廿四":"扫房日"},week:[getI18nMsg('weekDate_0'),getI18nMsg('weekDate_1'),getI18nMsg('weekDate_2'),getI18nMsg('weekDate_3'),getI18nMsg('weekDate_4'),getI18nMsg('weekDate_5'),getI18nMsg('weekDate_6')],Holiday:[],UnHoliday:[],init:function(){var self=this;var curDate=new Date();self.year=curDate.getFullYear();self.month=curDate.getMonth();self.today=self.getDateItem(self.year,self.month+1,curDate.getDate());self.content=$(self.template());self.content.find(".prev").bind("click",function(){self.prevMonth();self.showDate()});self.content.find(".next").bind("click",function(){self.nextMonth();self.showDate()});self.content.find(".today").bind("click",function(){self.year=new Date().getFullYear();self.month=new Date().getMonth();self.today=self.getDateItem(self.year,self.month+1,new Date().getDate());self.showDate();self.showDateInfo()});self.content.siblings('.back').unbind('click').bind('click',function(){self.container.animate({height:"0px"},200,function(){self.container.hide();$(".main").show().animate({opacity:"1"},50,function(){window.onmousewheel=wheel})})});self.container.append(self.content);self.initSolarTermsDate();if(self.Holiday.length==0){var holidayApi="http://hao.weidunewtab.com/tianqi/json/holiday.json";$.ajax({url:holidayApi,dataType:"json",timeout:3000,success:function(holidayObj){self.Holiday=holidayObj.Holiday;self.UnHoliday=holidayObj.UnHoliday;self.showDate();self.showDateInfo()},error:function(){showErrorMsg(getI18nMsg("holidayFail"));self.showDate();self.showDateInfo()}})}else{self.showDate();self.showDateInfo()}},showDate:function(){var self=this;var dateItem="";self.getDateList();var gz=getGanzhiYmd(new Date(this.year,this.month));self.container.find(".now").html(this.year+"年"+(this.month+1)+"月"+gz.dateString);for(var i=0;i<Math.ceil(self.dateList.length/7);i++){dateItem+='<div class="dateItem">';$.each(self.week,function(k,v){dateItem+='<div class="day'+((self.dateList[i*7+k].isCurMonth!==true)?" notCurMonth":"")+'" date="'+self.dateList[i*7+k].fullDate+'"><div class="' + (typeof(self.dateList[i * 7 + k].isWork) != "undefined" ? ('dWork ' + self.dateList[i * 7 + k].isWork) : 'dWork') + '"></div><div class="dNumber"'  + (self.dateList[i * 7 + k].isCurMonth !== true ? " style=\"color:#979797;\"" : "") + '>' + self.dateList[i * 7 + k].date + '</div><div class="dLunar"' + (typeof(self.dateList[i * 7 + k].holiday) != "undefined" ? " style=\"color:#3eb20d;\"" : "") + '>' + (typeof(self.dateList[i * 7 + k].holiday) != "undefined" ? self.dateList[i * 7 + k].holiday : self.dateList[i * 7 + k].lunar.day) + '</div></div>'});dateItem+='</div>'}self.container.find(".dateList").html(dateItem);$(".day").css("height",((215-parseInt(self.dateList.length/7))/parseInt(self.dateList.length/7))+"px");self.container.find(".day[date='"+self.today.year+"-"+self.today.month+"-"+self.today.date+"']").addClass("selected");self.container.find(".day").unbind("click").bind("click",function(){self.container.find(".day").removeClass("selected");$(this).addClass("selected");var _temps=$(this).attr("date").split("-");self.today=self.getDateItem(_temps[0],_temps[1],_temps[2]);self.showDateInfo()})},showDateInfo:function(){var self=this;var month=addZero(self.today.month,2);var date=addZero(self.today.date,2);var curDateKey="d"+month+date;var curDateObj=new Date(self.today.year,self.today.month-1,self.today.date);var ganzhi=getGanzhiYmd(new Date(self.today.year,self.today.month-1,self.today.date));self.container.find(".dateZG").html(ganzhi.month+"月 "+ganzhi.day+"日");self.container.find(".dateTime").html(self.today.year+'年'+self.today.month+'月 '+self.week[curDateObj.getDay()]);self.container.find(".dateDay").html(self.today.date);self.container.find(".dateLunar").html(self.today.lunar.month+self.today.lunar.day);self.container.find(".dateLunarZG").html(ganzhi.dateString);if(typeof self.almanac[self.today.year]=="undefined"){var almanacAPI="http://hao.weidunewtab.com/tianqi/huangli/index.php?y=";self.almanac[self.today.year]={};$.ajax({url:almanacAPI+self.today.year,dataType:"json",timeout:3000,success:function(data){self.almanac[self.today.year]=data;self.showDateInfo()},error:function(){showErrorMsg(getI18nMsg("huangliFail"))}});return}var yijiData=self.almanac[self.today.year][curDateKey];self.container.find(".yiItem").remove();self.container.find(".jiItem").remove();if(typeof yijiData!="undefined"){var yi=yijiData.y.split(".").slice(0,4);$.each(yi,function(i,n){self.container.find(".yi").append('<div class="yiItem">'+n+'</div>')});var ji=yijiData.j.split(".").slice(0,4);$.each(ji,function(i,n){self.container.find(".ji").append('<div class="jiItem">'+n+'</div>')})}},template:function(){var self=this;var weekDateItem="";$.each(self.week,function(i,n){weekDateItem+='<div class="weekDateItem"><div' + ((i == 0 || i == 6) ? " style=\"color:#b12c2c;\"" : "") + '>' + self.week[i] + '</div></div>'});if(storage.get('isSundayLast')==1){weekDateItem="";$.each(self.week,function(i,n){if(i>0){weekDateItem+='<div class="weekDateItem"><div' + ((i == 6) ? " style=\"color:#b12c2c;\"" : "") + '>' + self.week[i] + '</div></div>'}});weekDateItem+='<div class="weekDateItem"><div style="color:#b12c2c;">' + self.week[0] + '</div></div>'}return'<div class="back"></div><div class="dateContainer"><div class="dateTable"><div class="nowDate"><div class="prev"></div><div class="now"></div><div class="next"></div><div class="today"></div></div><div class="weekDate">' + weekDateItem + '</div><div class="dateList"></div></div><div class="dateInfo"><div class="dateTime"></div><div class="dateDay"></div><div class="dateLunar"></div><div class="dateLunarZG"></div><div class="dateZG"></div><div class="yiji"><div class="yi"><div class="head">宜</div></div><div class="ji"><div class="head">忌</div></div></div></div></div>'},initSolarTermsDate:function(){var self=this;self.solarTermsDate=[];if(self.year<2000||self.year>2099){return}var _y=parseInt(self.year.toString().substr(2,2));tempyear=this.year;for(var i=0;i<26;i++){var temp=parseInt(_y*0.2422+self.solarTermsOpts[i])-parseInt((_y-1)/4);switch(i){case 0:if(self.year==1982)temp++;else if(self.year==2019)temp--;break;case 1:if(self.year==2082)temp++;break;case 13:if(self.year==1922)temp++;break;case 16:if(self.year==1927)temp++;break;case 17:if(self.year==1942)temp++;break;case 18:if(self.year==2089)temp++;break;case 20:if(self.year==2089)temp++;break;case 21:if(self.year==1978)temp++;break;case 22:if(self.year==1954)temp++;break;case 23:if(self.year==1918||self.year==2021)temp++;break;case 24:if(self.year==1982)temp++;else if(this.year==2019)temp--;break;case 25:if(self.year==2082)temp++;break}self.solarTermsDate.push((i>=24?self.year+1:self.year)+"-"+parseInt(i/2+1<13?i/2+1:1)+"-"+temp.toString())}},getDateList:function(){var self=this;var dateList=[];var y,m,d,total,index;var date=new Date(self.year,self.month);var isSundayLast=parseInt(storage.get('isSundayLast'));index=date.getDay();if(index==0&&isSundayLast==1){index=7}total=self.getMonthDays(self.month==0?self.year-1:self.year,self.month==0?12:self.month);for(var i=0+isSundayLast;i<index;i++){y=self.month==0?self.year-1:self.year;m=self.month==0?12:self.month;d=total-index+1+i;dateList.push(self.getDateItem(y,m,d))}total=self.getMonthDays(self.year,self.month+1);for(var i=0;i<total;i++){y=self.year;m=self.month+1;d=i+1;dateList.push(self.getDateItem(y,m,d))}date=new Date(self.year,self.month,total);index=date.getDay();for(var i=0;i<6+isSundayLast-index;i++){y=self.month==11?self.year+1:self.year;m=self.month==11?1:self.month+2;d=i+1;dateList.push(self.getDateItem(y,m,d))}self.dateList=dateList},getDateItem:function(y,m,d){var self=this;var dateItem={year:y,month:m,date:d,isCurMonth:!!(m==self.month+1),lunar:self.getLunar(new Date(y,m-1,d))};key=addZero(m,2)+addZero(d,2);if(typeof self.IFestival[key]!="undefined"){dateItem.holiday=self.IFestival[key]}dateItem.fullDate=y+"-"+m+"-"+d;var solarTermsIndex=self.solarTermsDate.indexOf(dateItem.fullDate);if(solarTermsIndex!=-1){dateItem.holiday=self.solarTermsName[solarTermsIndex]}if(typeof self.TFestival[dateItem.lunar.month+dateItem.lunar.day]!="undefined"){dateItem.holiday=self.TFestival[dateItem.lunar.month+dateItem.lunar.day]}if(self.Holiday.indexOf(y+"-"+m+"-"+d)!=-1){dateItem.isWork="notWork"}if(self.UnHoliday.indexOf(y+"-"+m+"-"+d)!=-1){dateItem.isWork="work"}return dateItem},getLunarYearDays:function(y){var i,sum=348;for(i=0x8000;i>0x8;i>>=1){sum+=(this.lunarOpts[y-1900]&i)?1:0}return(sum+this.getLeapMonthDays(y))},getLunarMonthDays:function(y,m){return((this.lunarOpts[y-1900]&(0x10000>>m))?30:29)},getLeapMonthDays:function(y){if(this.getLeapMonth(y)){return((this.lunarOpts[y-1900]&0x10000)?30:29)}else{return(0)}},getLeapMonth:function(y){return(this.lunarOpts[y-1900]&0xf)},getMonthDays:function(year,month){if([1,3,5,7,8,10,12].indexOf(parseInt(month))!=-1){return 31}else if([4,6,9,11].indexOf(parseInt(month))!=-1){return 30}else{if((parseInt(year)%100!=0)&&(parseInt(year)%4==0)||(parseInt(year%400==0))){return 29}else{return 28}}},getLunar:function(dateObj){var self=this;var leap=0,temp=0,isleap=false;var day=(dateObj-new Date(1900,0,31))/86400000;for(var year=1900;year<2050&&day>0;year++){temp=self.getLunarYearDays(year);day-=temp}if(day<0){day+=temp;year--}leap=self.getLeapMonth(year);for(var month=1;month<13&&day>0;month++){if(leap>0&&month==(leap+1)&&isleap==false){--month;isleap=true;temp=self.getLeapMonthDays(year)}else{temp=self.getLunarMonthDays(year,month)}if(isleap==true&&month==(leap+1)){isleap=false}day-=temp}if(day==0&&leap>0&&month==leap+1){if(isleap){isleap=false}else{isleap=true;--month}}if(day<0){day+=temp;--month}return self.getLunarDay(month,day+1)},getLunarDay:function(m,d){var monthList=['正','二','三','四','五','六','七','八','九','十','十一','腊'];var dayList=['十','一','二','三','四','五','六','七','八','九','十'];var dayList2=['初','十','廿','卅'];m=monthList[m-1]+getI18nMsg("monthUnit");d=(d<=10?dayList2[0]:dayList2[Math.floor(d/10)])+dayList[Math.floor(d%10)];return{month:m,day:d}},prevMonth:function(){var self=this;if(self.month>0){self.month--}else{self.month=11;self.year--}},nextMonth:function(){var self=this;if(self.month<11){self.month++}else{self.month=0;self.year++}}};return calendar})()})(jQuery);var calendar=$(".calendar").calendar();