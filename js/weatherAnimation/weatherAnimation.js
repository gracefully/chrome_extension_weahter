(function($){$.fn.weatherAnimation=function(){return new weatherAnimation(this)};var weatherAnimation=(function(el){var weatherAnimation=function(el){this.container=el};weatherAnimation.prototype={container:"",run:function(opt){var self=this;if(opt&&opt.length>0){$.each(opt,function(i,n){switch(n){case"sun":self.sun();break;case"rain":self.rain();break;case"cloud":self.cloud();break;case"moreCloud":self.moreCloud();break;case"thunder":self.thunder();break;case"wind":self.wind();break;case"snow":self.snow();break}})}},sun:function(){var self=this;var sunDiv=$('<div class="sun animationItem"><img src="./js/weatherAnimation/images/sun/sun.png" /></div>');self.container.prepend(sunDiv)},rain:function(){var self=this;var number=120;for(var i=0;i<number;i++){var rainDiv=$('<div class="rain animationItem"></div>');rainDiv.css({"top":self.randomInteger(100,-300)+"px","left":self.randomInteger(0,530)+"px","webkitAnimationName":"rain_animation","webkitAnimationDuration":self.randomFloat(1,3)+"s,"+self.randomFloat(1,3)+"s"});var rainImage=$('<img />');rainImage.attr("src","./js/weatherAnimation/images/rain/drop"+self.randomInteger(1,4)+".png");rainImage.css({"webkitAnimationName":(Math.random()<0.5)?"rain_clockwiseSpin":"rain_counterclockwiseSpinAndFlip","webkitAnimationDuration":self.randomFloat(1,3)+"s"});rainDiv.prepend(rainImage);self.container.prepend(rainDiv)}},cloud:function(){var self=this;var number=10;for(var i=0;i<number;i++){var cloudDiv=$('<div class="cloud animationItem"></div>');cloudDiv.css({"top":self.randomInteger(-20,10)+"px","left":self.randomInteger(-120,340)+"px","webkitAnimationName":"cloud_fade, cloud_float","webkitAnimationDuration":self.randomFloat(100,250)+"s,"+self.randomFloat(40,80)+"s"});var cloudImage=$('<img />');var spinAnimationName=(Math.random()<0.5)?"cloud_clockwiseSpin":"cloud_counterclockwiseSpinAndFlip";cloudImage.attr("src","./js/weatherAnimation/images/cloud/cloud"+self.randomInteger(1,5)+".png");cloudImage.css({"webkitAnimationName":spinAnimationName,"webkitAnimationDuration":self.randomFloat(40,80)+"s"});cloudDiv.prepend(cloudImage);self.container.prepend(cloudDiv)}},moreCloud:function(){var self=this;var number=20;for(var i=0;i<number;i++){var cloudDiv=$('<div class="cloud animationItem"></div>');cloudDiv.css({"top":self.randomInteger(-40,-15)+"px","left":self.randomInteger(-200,540)+"px","webkitAnimationName":"cloud_fade, cloud_float","webkitAnimationDuration":self.randomFloat(100,250)+"s,"+self.randomFloat(40,80)+"s"});var cloudImage=$('<img />');var spinAnimationName=(Math.random()<0.5)?"cloud_clockwiseSpin":"cloud_counterclockwiseSpinAndFlip";cloudImage.attr("src","./js/weatherAnimation/images/cloud/cloud"+self.randomInteger(1,17)+".png");cloudImage.css({"webkitAnimationName":spinAnimationName,"webkitAnimationDuration":self.randomFloat(40,80)+"s"});cloudDiv.prepend(cloudImage);self.container.prepend(cloudDiv)}},thunder:function(){var self=this;var thunderDiv=$('<div class="thunder animationItem"><img src="./js/weatherAnimation/images/thunder/thunder.png" /></div>');var thunderPlusDiv=$('<div class="thunderPlus animationItem"><img src="./js/weatherAnimation/images/thunder/thunderPlus.png" /></div>');self.container.prepend(thunderDiv);self.container.prepend(thunderPlusDiv)},wind:function(){var self=this;var num=6;for(var i=0;i<num;i++){var windDiv=$('<div class="wind animationItem"></div>');windDiv.css({"top":self.randomInteger(200,320)+"px","left":self.randomInteger(-100,540)+"px","webkitAnimationName":"wind_fade, wind_float","webkitAnimationDuration":self.randomFloat(4,8)+"s,"+self.randomFloat(6,20)+"s"});var windImage=$("<img />");windImage.attr("src","./js/weatherAnimation/images/wind/wind"+self.randomInteger(1,9)+".png");windImage.css({"webkitAnimationName":(Math.random()<0.5)?"wind_clockwiseSpin":"wind_counterclockwiseSpinAndFlip","webkitAnimationDuration":self.randomFloat(6,20)+"s"});windDiv.prepend(windImage);self.container.prepend(windDiv)}},snow:function(){var self=this;var num=120;for(var i=0;i<num;i++){var snowDiv=$('<div class="snow animationItem"></div>');snowDiv.css({"top":self.randomInteger(100,-400)+"px","left":self.randomInteger(0,540)+"px","webkitAnimationName":"snow_animation","webkitAnimationDuration":self.randomFloat(5,7)+"s,"+self.randomFloat(5,7)+"s"});var windImage=$("<img />");windImage.attr("src","./js/weatherAnimation/images/snow/snow"+self.randomInteger(1,4)+".png");windImage.css({"webkitAnimationName":(Math.random()<0.5)?"snow_clockwiseSpin":"snow_counterclockwiseSpinAndFlip","webkitAnimationDuration":"5s"});snowDiv.prepend(windImage);self.container.prepend(snowDiv)}},clear:function(){var self=this;self.container.find('.animationItem').remove()},randomInteger:function(low,high){return low+Math.floor(Math.random()*(high-low))},randomFloat:function(low,high){return low+Math.random()*(high-low)}};return weatherAnimation})()})(jQuery);