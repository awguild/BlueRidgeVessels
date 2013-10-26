/*
 * jQuery Nivo slider1 v3.0.1
 * http://nivo.dev7studios.com
 *
 * Copyright 2012, Dev7studios
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
    var nivoslider1 = function(element, options){
        // Defaults are below
        var settings1 = $.extend({}, $.fn.nivoslider1.defaults, options);

        // Useful variables. Play carefully.
        var vars1 = {
            currentSlide: 0,
            currentImage: '',
            totalSlides: 0,
            running: false,
            paused: false,
            stop: false,
            controlNav1El: false
        };

        // Get this slider1
        var slider1 = $(element);
        slider1.data('nivo:vars1', vars1).addClass('nivoslider1');

        // Find our slider1 child1ren
        var kids1 = slider1.child1ren();
        kids1.each(function() {
            var child1 = $(this);
            var link = '';
            if(!child1.is('img')){
                if(child1.is('a')){
                    child1.addClass('nivo-imageLink1');
                    link = child1;
                }
                child1 = child1.find('img:first');
            }
            // Get img width & height
            var child1Width = (child1Width === 0) ? child1.attr('width') : child1.width(),
                child1Height = (child1Height === 0) ? child1.attr('height') : child1.height();

            if(link !== ''){
                link.css('display','none');
            }
            child1.css('display','none');
            vars1.totalSlides++;
        });
         
        // If randomStart
        if(settings1.randomStart){
            settings1.startSlide = Math.floor(Math.random() * vars1.totalSlides);
        }
        
        // Set startSlide
        if(settings1.startSlide > 0){
            if(settings1.startSlide >= vars1.totalSlides) { settings1.startSlide = vars1.totalSlides - 1; }
            vars1.currentSlide = settings1.startSlide;
        }
        
        // Get initial image
        if($(kids1[vars1.currentSlide]).is('img')){
            vars1.currentImage = $(kids1[vars1.currentSlide]);
        } else {
            vars1.currentImage = $(kids1[vars1.currentSlide]).find('img:first');
        }
        
        // Show initial link
        if($(kids1[vars1.currentSlide]).is('a')){
            $(kids1[vars1.currentSlide]).css('display','block');
        }
        
        // Set first background
        var slider1Img = $('<img class="nivo-main-image1" src="#" />');
        slider1Img.attr('src', vars1.currentImage.attr('src')).show();
        slider1.append(slider1Img);

        // Detect Window Resize
        $(window).resize(function() {
            slider1.children('img').width(slider1.width());
            slider1Img.attr('src', vars1.currentImage.attr('src'));
            slider1Img.stop().height('auto');
            $('.nivo-slice1').remove();
            $('.nivo-box1').remove();
        });

        //Create caption
        slider1.append($('<div class="nivo-caption1"></div>'));
        
        // Process caption function
        var processCaption = function(settings1){
            var nivoCaption = $('.nivo-caption1', slider1);
            if(vars1.currentImage.attr('title') != '' && vars1.currentImage.attr('title') != undefined){
                var title = vars1.currentImage.attr('title');
                if(title.substr(0,1) == '#') title = $(title).html();   

                if(nivoCaption.css('display') == 'block'){
                    setTimeout(function(){
                        nivoCaption.html(title);
                    }, settings1.animSpeed);
                } else {
                    nivoCaption.html(title);
                    nivoCaption.stop().fadeIn(settings1.animSpeed);
                }
            } else {
                nivoCaption.stop().fadeOut(settings1.animSpeed);
            }
        }
        
        //Process initial  caption
        processCaption(settings1);
        
        // In the words of Super Mario "let's a go!"
        var timer = 0;
        if(!settings1.manualAdvance && kids1.length > 1){
            timer = setInterval(function(){ nivoRun1(slider1, kids1, settings1, false); }, settings1.pauseTime);
        }
        
        // Add Direction nav
        if(settings1.directionNav1){
            slider1.append('<div class="nivo-directionNav1"><a class="nivo-prevNav1">'+ settings1.prevText +'</a><a class="nivo-nextNav1">'+ settings1.nextText +'</a></div>');
            
            // Hide Direction nav
            if(settings1.directionNav1Hide){
                $('.nivo-directionNav1', slider1).hide();
                slider1.hover(function(){
                    $('.nivo-directionNav1', slider1).show();
                }, function(){
                    $('.nivo-directionNav1', slider1).hide();
                });
            }
            
            $('a.nivo-prevNav1', slider1).live('click', function(){
                if(vars1.running) { return false; }
                clearInterval(timer);
                timer = '';
                vars1.currentSlide -= 2;
                nivoRun1(slider1, kids1, settings1, 'prev');
            });
            
            $('a.nivo-nextNav1', slider1).live('click', function(){
                if(vars1.running) { return false; }
                clearInterval(timer);
                timer = '';
                nivoRun1(slider1, kids1, settings1, 'next');
            });
        }
        
        // Add Control nav
        if(settings1.controlNav1){
            vars1.controlNav1El = $('<div class="nivo-control1Nav1"></div>');
            slider1.after(vars1.controlNav1El);
            for(var i = 0; i < kids1.length; i++){
                if(settings1.controlNav1Thumbs){
                    vars1.controlNav1El.addClass('nivo-thumbs-enabled');
                    var child1 = kids1.eq(i);
                    if(!child1.is('img')){
                        child1 = child1.find('img:first');
                    }
                    if(child1.attr('data-thumb')) vars1.controlNav1El.append('<a class="nivo-control1" rel="'+ i +'"><img src="'+ child1.attr('data-thumb') +'" alt="" /></a>');
                } else {
                    vars1.controlNav1El.append('<a class="nivo-control1" rel="'+ i +'">'+ (i + 1) +'</a>');
                }
            }

            //Set initial active link
            $('a:eq('+ vars1.currentSlide +')', vars1.controlNav1El).addClass('active');
            
            $('a', vars1.controlNav1El).bind('click', function(){
                if(vars1.running) return false;
                if($(this).hasClass('active')) return false;
                clearInterval(timer);
                timer = '';
                slider1Img.attr('src', vars1.currentImage.attr('src'));
                vars1.currentSlide = $(this).attr('rel') - 1;
                nivoRun1(slider1, kids1, settings1, 'control');
            });
        }
        
        //For pauseOnHover setting
        if(settings1.pauseOnHover){
            slider1.hover(function(){
                vars1.paused = true;
                clearInterval(timer);
                timer = '';
            }, function(){
                vars1.paused = false;
                // Restart the timer
                if(timer === '' && !settings1.manualAdvance){
                    timer = setInterval(function(){ nivoRun1(slider1, kids1, settings1, false); }, settings1.pauseTime);
                }
            });
        }
        
        // Event when Animation finishes
        slider1.bind('nivo:animFinished1', function(){
            slider1Img.attr('src', vars1.currentImage.attr('src'));
            vars1.running = false; 
            // Hide child1 links
            $(kids1).each(function(){
                if($(this).is('a')){
                   $(this).css('display','none');
                }
            });
            // Show current link
            if($(kids1[vars1.currentSlide]).is('a')){
                $(kids1[vars1.currentSlide]).css('display','block');
            }
            // Restart the timer
            if(timer === '' && !vars1.paused && !settings1.manualAdvance){
                timer = setInterval(function(){ nivoRun1(slider1, kids1, settings1, false); }, settings1.pauseTime);
            }
            // Trigger the afterChange callback
            settings1.afterChange.call(this);
        }); 
        
        // Add slices for slice animations
        var createSlices = function(slider1, settings1, vars1) {
        	if($(vars1.currentImage).parent().is('a')) $(vars1.currentImage).parent().css('display','block');
            $('img[src="'+ vars1.currentImage.attr('src') +'"]', slider1).not('.nivo-main-image1,.nivo-control1 img').width(slider1.width()).css('visibility', 'hidden').show();
            var sliceHeight = ($('img[src="'+ vars1.currentImage.attr('src') +'"]', slider1).not('.nivo-main-image1,.nivo-control1 img').parent().is('a')) ? $('img[src="'+ vars1.currentImage.attr('src') +'"]', slider1).not('.nivo-main-image1,.nivo-control1 img').parent().height() : $('img[src="'+ vars1.currentImage.attr('src') +'"]', slider1).not('.nivo-main-image1,.nivo-control1 img').height();

            for(var i = 0; i < settings1.slices; i++){
                var sliceWidth = Math.round(slider1.width()/settings1.slices);
                
                if(i === settings1.slices-1){
                    slider1.append(
                        $('<div class="nivo-slice1" name="'+i+'"><img src="'+ vars1.currentImage.attr('src') +'" style="position:absolute; width:'+ slider1.width() +'px; height:auto; display:block !important; top:0; left:-'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px;" /></div>').css({ 
                            left:(sliceWidth*i)+'px', 
                            width:(slider1.width()-(sliceWidth*i))+'px',
                            height:sliceHeight+'px', 
                            opacity:'0',
                            overflow:'hidden'
                        })
                    );
                } else {
                    slider1.append(
                        $('<div class="nivo-slice1" name="'+i+'"><img src="'+ vars1.currentImage.attr('src') +'" style="position:absolute; width:'+ slider1.width() +'px; height:auto; display:block !important; top:0; left:-'+ ((sliceWidth + (i * sliceWidth)) - sliceWidth) +'px;" /></div>').css({ 
                            left:(sliceWidth*i)+'px', 
                            width:sliceWidth+'px',
                            height:sliceHeight+'px',
                            opacity:'0',
                            overflow:'hidden'
                        })
                    );
                }
            }
            
            $('.nivo-slice1', slider1).height(sliceHeight);
            slider1Img.stop().animate({
                height: $(vars1.currentImage).height()
            }, settings1.animSpeed);
        };
        
        // Add boxes for box animations
        var createBoxes1 = function(slider1, settings1, vars1){
        	if($(vars1.currentImage).parent().is('a')) $(vars1.currentImage).parent().css('display','block');
            $('img[src="'+ vars1.currentImage.attr('src') +'"]', slider1).not('.nivo-main-image1,.nivo-control1 img').width(slider1.width()).css('visibility', 'hidden').show();
            var boxWidth = Math.round(slider1.width()/settings1.boxCols),
                boxHeight = Math.round($('img[src="'+ vars1.currentImage.attr('src') +'"]', slider1).not('.nivo-main-image1,.nivo-control1 img').height() / settings1.boxRows);
            
                        
            for(var rows = 0; rows < settings1.boxRows; rows++){
                for(var cols = 0; cols < settings1.boxCols; cols++){
                    if(cols === settings1.boxCols-1){
                        slider1.append(
                            $('<div class="nivo-box1" name="'+ cols +'" rel="'+ rows +'"><img src="'+ vars1.currentImage.attr('src') +'" style="position:absolute; width:'+ slider1.width() +'px; height:auto; display:block; top:-'+ (boxHeight*rows) +'px; left:-'+ (boxWidth*cols) +'px;" /></div>').css({ 
                                opacity:0,
                                left:(boxWidth*cols)+'px', 
                                top:(boxHeight*rows)+'px',
                                width:(slider1.width()-(boxWidth*cols))+'px'
                                
                            })
                        );
                        $('.nivo-box1[name="'+ cols +'"]', slider1).height($('.nivo-box1[name="'+ cols +'"] img', slider1).height()+'px');
                    } else {
                        slider1.append(
                            $('<div class="nivo-box1" name="'+ cols +'" rel="'+ rows +'"><img src="'+ vars1.currentImage.attr('src') +'" style="position:absolute; width:'+ slider1.width() +'px; height:auto; display:block; top:-'+ (boxHeight*rows) +'px; left:-'+ (boxWidth*cols) +'px;" /></div>').css({ 
                                opacity:0,
                                left:(boxWidth*cols)+'px', 
                                top:(boxHeight*rows)+'px',
                                width:boxWidth+'px'
                            })
                        );
                        $('.nivo-box1[name="'+ cols +'"]', slider1).height($('.nivo-box1[name="'+ cols +'"] img', slider1).height()+'px');
                    }
                }
            }
            
            slider1Img.stop().animate({
                height: $(vars1.currentImage).height()
            }, settings1.animSpeed);
        };

        // Private run method
        var nivoRun1 = function(slider1, kids1, settings1, nudge){          
            // Get our vars1
            var vars1 = slider1.data('nivo:vars1');
            
            // Trigger the lastSlide callback
            if(vars1 && (vars1.currentSlide === vars1.totalSlides - 1)){ 
                settings1.lastSlide.call(this);
            }
            
            // Stop
            if((!vars1 || vars1.stop) && !nudge) { return false; }
            
            // Trigger the beforeChange callback
            settings1.beforeChange.call(this);

            // Set current background before change
            if(!nudge){
                slider1Img.attr('src', vars1.currentImage.attr('src'));
            } else {
                if(nudge === 'prev'){
                    slider1Img.attr('src', vars1.currentImage.attr('src'));
                }
                if(nudge === 'next'){
                    slider1Img.attr('src', vars1.currentImage.attr('src'));
                }
            }
            
            vars1.currentSlide++;
            // Trigger the slideshowEnd callback
            if(vars1.currentSlide === vars1.totalSlides){ 
                vars1.currentSlide = 0;
                settings1.slideshowEnd.call(this);
            }
            if(vars1.currentSlide < 0) { vars1.currentSlide = (vars1.totalSlides - 1); }
            // Set vars1.currentImage
            if($(kids1[vars1.currentSlide]).is('img')){
                vars1.currentImage = $(kids1[vars1.currentSlide]);
            } else {
                vars1.currentImage = $(kids1[vars1.currentSlide]).find('img:first');
            }
            
            // Set active links
            if(settings1.controlNav1){
                $('a', vars1.controlNav1El).removeClass('active');
                $('a:eq('+ vars1.currentSlide +')', vars1.controlNav1El).addClass('active');
            }
            
            // Process caption
            processCaption(settings1);            
            
            // Remove any slices from last transition
            $('.nivo-slice1', slider1).remove();
            
            // Remove any boxes from last transition
            $('.nivo-box1', slider1).remove();
            
            var currentEffect = settings1.effect,
                anims = '';
                
            // Generate random effect
            if(settings1.effect === 'random'){
                anims = new Array('sliceDownRight','sliceDownLeft','sliceUpRight','sliceUpLeft','sliceUpDown','sliceUpDownLeft','fold','fade',
                'boxRandom','boxRain','boxRainReverse','boxRainGrow','boxRainGrowReverse');
                currentEffect = anims[Math.floor(Math.random()*(anims.length + 1))];
                if(currentEffect === undefined) { currentEffect = 'fade'; }
            }
            
            // Run random effect from specified set (eg: effect:'fold,fade')
            if(settings1.effect.indexOf(',') !== -1){
                anims = settings1.effect.split(',');
                currentEffect = anims[Math.floor(Math.random()*(anims.length))];
                if(currentEffect === undefined) { currentEffect = 'fade'; }
            }
            
            // Custom transition as defined by "data-transition" attribute
            if(vars1.currentImage.attr('data-transition')){
                currentEffect = vars1.currentImage.attr('data-transition');
            }
        
            // Run effects
            vars1.running = true;
            var timeBuff = 0,
                i = 0,
                slices = '',
                firstSlice = '',
                totalBoxes = '',
                boxes = '';
            
            if(currentEffect === 'sliceDown' || currentEffect === 'sliceDownRight' || currentEffect === 'sliceDownLeft'){
                createSlices(slider1, settings1, vars1);
                timeBuff = 0;
                i = 0;
                slices = $('.nivo-slice1', slider1);
                if(currentEffect === 'sliceDownLeft') { slices = $('.nivo-slice1', slider1)._reverse(); }
                
                slices.each(function(){
                    var slice = $(this);
                    slice.css({ 'top': '0px' });
                    if(i === settings1.slices-1){
                        setTimeout(function(){
                            slice.animate({opacity:'1.0' }, settings1.animSpeed, '', function(){ slider1.trigger('nivo:animFinished1'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({opacity:'1.0' }, settings1.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            } else if(currentEffect === 'sliceUp' || currentEffect === 'sliceUpRight' || currentEffect === 'sliceUpLeft'){
                createSlices(slider1, settings1, vars1);
                timeBuff = 0;
                i = 0;
                slices = $('.nivo-slice1', slider1);
                if(currentEffect === 'sliceUpLeft') { slices = $('.nivo-slice1', slider1)._reverse(); }
                
                slices.each(function(){
                    var slice = $(this);
                    slice.css({ 'bottom': '0px' });
                    if(i === settings1.slices-1){
                        setTimeout(function(){
                            slice.animate({opacity:'1.0' }, settings1.animSpeed, '', function(){ slider1.trigger('nivo:animFinished1'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({opacity:'1.0' }, settings1.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            } else if(currentEffect === 'sliceUpDown' || currentEffect === 'sliceUpDownRight' || currentEffect === 'sliceUpDownLeft'){
                createSlices(slider1, settings1, vars1);
                timeBuff = 0;
                i = 0;
                var v = 0;
                slices = $('.nivo-slice1', slider1);
                if(currentEffect === 'sliceUpDownLeft') { slices = $('.nivo-slice1', slider1)._reverse(); }
                
                slices.each(function(){
                    var slice = $(this);
                    if(i === 0){
                        slice.css('top','0px');
                        i++;
                    } else {
                        slice.css('bottom','0px');
                        i = 0;
                    }
                    
                    if(v === settings1.slices-1){
                        setTimeout(function(){
                            slice.animate({opacity:'1.0' }, settings1.animSpeed, '', function(){ slider1.trigger('nivo:animFinished1'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({opacity:'1.0' }, settings1.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    v++;
                });
            } else if(currentEffect === 'fold'){
                createSlices(slider1, settings1, vars1);
                timeBuff = 0;
                i = 0;
                
                $('.nivo-slice1', slider1).each(function(){
                    var slice = $(this);
                    var origWidth = slice.width();
                    slice.css({ top:'0px', width:'0px' });
                    if(i === settings1.slices-1){
                        setTimeout(function(){
                            slice.animate({ width:origWidth, opacity:'1.0' }, settings1.animSpeed, '', function(){ slider1.trigger('nivo:animFinished1'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            slice.animate({ width:origWidth, opacity:'1.0' }, settings1.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            } else if(currentEffect === 'fade'){
                createSlices(slider1, settings1, vars1);
                
                firstSlice = $('.nivo-slice1:first', slider1);
                firstSlice.css({
                    'width': slider1.width() + 'px'
                });
    
                firstSlice.animate({ opacity:'1.0' }, (settings1.animSpeed*2), '', function(){ slider1.trigger('nivo:animFinished1'); });
            } else if(currentEffect === 'slideInRight'){
                createSlices(slider1, settings1, vars1);
                
                firstSlice = $('.nivo-slice1:first', slider1);
                firstSlice.css({
                    'width': '0px',
                    'opacity': '1'
                });

                firstSlice.animate({ width: slider1.width() + 'px' }, (settings1.animSpeed*2), '', function(){ slider1.trigger('nivo:animFinished1'); });
            } else if(currentEffect === 'slideInLeft'){
                createSlices(slider1, settings1, vars1);
                
                firstSlice = $('.nivo-slice1:first', slider1);
                firstSlice.css({
                    'width': '0px',
                    'opacity': '1',
                    'left': '',
                    'right': '0px'
                });

                firstSlice.animate({ width: slider1.width() + 'px' }, (settings1.animSpeed*2), '', function(){ 
                    // Reset positioning
                    firstSlice.css({
                        'left': '0px',
                        'right': ''
                    });
                    slider1.trigger('nivo:animFinished1'); 
                });
            } else if(currentEffect === 'boxRandom'){
                createBoxes1(slider1, settings1, vars1);
                
                totalBoxes = settings1.boxCols * settings1.boxRows;
                i = 0;
                timeBuff = 0;

                boxes = shuffle($('.nivo-box1', slider1));
                boxes.each(function(){
                    var box = $(this);
                    if(i === totalBoxes-1){
                        setTimeout(function(){
                            box.animate({ opacity:'1' }, settings1.animSpeed, '', function(){ slider1.trigger('nivo:animFinished1'); });
                        }, (100 + timeBuff));
                    } else {
                        setTimeout(function(){
                            box.animate({ opacity:'1' }, settings1.animSpeed);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 20;
                    i++;
                });
            } else if(currentEffect === 'boxRain' || currentEffect === 'boxRainReverse' || currentEffect === 'boxRainGrow' || currentEffect === 'boxRainGrowReverse'){
                createBoxes1(slider1, settings1, vars1);
                
                totalBoxes = settings1.boxCols * settings1.boxRows;
                i = 0;
                timeBuff = 0;
                
                // Split boxes into 2D array
                var rowIndex = 0;
                var colIndex = 0;
                var box2Darr = [];
                box2Darr[rowIndex] = [];
                boxes = $('.nivo-box1', slider1);
                if(currentEffect === 'boxRainReverse' || currentEffect === 'boxRainGrowReverse'){
                    boxes = $('.nivo-box1', slider1)._reverse();
                }
                boxes.each(function(){
                    box2Darr[rowIndex][colIndex] = $(this);
                    colIndex++;
                    if(colIndex === settings1.boxCols){
                        rowIndex++;
                        colIndex = 0;
                        box2Darr[rowIndex] = [];
                    }
                });
                
                // Run animation
                for(var cols = 0; cols < (settings1.boxCols * 2); cols++){
                    var prevCol = cols;
                    for(var rows = 0; rows < settings1.boxRows; rows++){
                        if(prevCol >= 0 && prevCol < settings1.boxCols){
                            /* Due to some weird JS bug with loop vars1 
                            being used in setTimeout, this is wrapped
                            with an anonymous function call */
                            (function(row, col, time, i, totalBoxes) {
                                var box = $(box2Darr[row][col]);
                                var w = box.width();
                                var h = box.height();
                                if(currentEffect === 'boxRainGrow' || currentEffect === 'boxRainGrowReverse'){
                                    box.width(0).height(0);
                                }
                                if(i === totalBoxes-1){
                                    setTimeout(function(){
                                        box.animate({ opacity:'1', width:w, height:h }, settings1.animSpeed/1.3, '', function(){ slider1.trigger('nivo:animFinished1'); });
                                    }, (100 + time));
                                } else {
                                    setTimeout(function(){
                                        box.animate({ opacity:'1', width:w, height:h }, settings1.animSpeed/1.3);
                                    }, (100 + time));
                                }
                            })(rows, prevCol, timeBuff, i, totalBoxes);
                            i++;
                        }
                        prevCol--;
                    }
                    timeBuff += 100;
                }
            }           
        };
        
        // Shuffle an array
        var shuffle = function(arr){
            for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i, 10), x = arr[--i], arr[i] = arr[j], arr[j] = x);
            return arr;
        };
        
        // For debugging
        var trace = function(msg){
            if(this.console && typeof console.log !== 'undefined') { console.log(msg); }
        };
        
        // Start / Stop
        this.stop = function(){
            if(!$(element).data('nivo:vars1').stop){
                $(element).data('nivo:vars1').stop = true;
                trace('Stop slider1');
            }
        };
        
        this.start = function(){
            if($(element).data('nivo:vars1').stop){
                $(element).data('nivo:vars1').stop = false;
                trace('Start slider1');
            }
        };
        
        // Trigger the afterLoad callback
        settings1.afterLoad.call(this);
        
        return this;
    };
        
    $.fn.nivoslider1 = function(options) {
        return this.each(function(key, value){
            var element = $(this);
            // Return early if this element already has a plugin instance
            if (element.data('nivoslider1')) { return element.data('nivoslider1'); }
            // Pass options to plugin constructor
            var nivoslider1 = new nivoslider1(this, options);
            // Store plugin object in this element's data
            element.data('nivoslider1', nivoslider1);
        });
    };
    
    //Default settings1
    $.fn.nivoslider1.defaults = {
        effect: 'random',
        slices: 15,
        boxCols: 8,
        boxRows: 4,
        animSpeed: 500,
        pauseTime: 3000,
        startSlide: 0,
        directionNav1: true,
        directionNav1Hide: true,
        controlNav1: true,
        controlNav1Thumbs: false,
        pauseOnHover: true,
        manualAdvance: false,
        prevText: 'Prev',
        nextText: 'Next',
        randomStart: false,
        beforeChange: function(){},
        afterChange: function(){},
        slideshowEnd: function(){},
        lastSlide: function(){},
        afterLoad: function(){}
    };

    $.fn._reverse = [].reverse;
    
})(jQuery);