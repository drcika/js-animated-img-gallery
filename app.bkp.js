// (function gallery () {
// 	var gallery = document.getElementById('#gallery');										//the main wrapper of the gallery
// 	var overlay = document.getElementById('#overlay');										//the overlay when the large image is displayed
//   var loading = document.getElementById('#loading');										//image loading status
//   var next = document.getElementById('#next');													//next button
//   var prev = document.getElementById('#prev');													//previous button
//   var close = document.getElementById('#close');												//the close button
//   var thumbContainer = document.getElementById('#thumbContainer');			//the main container for the thumbs structure
//   var scrollWrapper = document.getElementById('#scrollWrapper');				//wrapper of jquery ui slider
//   var nmb_images = 0;																										//total number of images
//   var gallery_idx = -1;																									//which gallery is clicked (index)
//   var thumbScroller = document.getElementById('#thumbScroller');				//scroller wrapper
//   var slider = document.getElementById('#slider');											//jquery ui slider
//   var galleries = document.getElementById('#galleryList > li');					//the links of the galleries (the cities)
//   var current = 0;																											//current image being viewed
//   var fullscreen = true;																								//navigate with keyboard and wheel
// 	var photo_nav = true;																									//prevent fast clicks on next and previous
// 	function getFinalValues(image) {
// 		var widthMargin = 0;
// 		var heightMargin = 20;
// 		var window = document.querySelector('window')
// 		var windowH = window.height() - heightMargin;
// 		var windowW = window.width() - widthMargin;
// 		var theImage = new Image();
// 		theImage.src = image.attr("src");
// 		var imgwidth = theImage.width;
// 		var imgheight = theImage.height;
// 		if ((imgwidth > windowW) || (imgheight > windowH)) {
// 			if (imgwidth > imgheight) {
// 				var newwidth = windowW;
// 				var ratio = imgwidth / windowW;
// 				var newheight = imgheight / ratio;
// 				theImage.height = newheight;
// 				theImage.width = newwidth;
// 				if (newheight > windowH) {
// 					var newnewheight = windowH;
// 					var newratio = newheight / windowH;
// 					var newnewwidth = newwidth / newratio;
// 					theImage.width = newnewwidth;
// 					theImage.height = newnewheight;
// 				}
// 			} else {
// 				newheight = windowH;
// 				ratio = imgheight / windowH;
// 				newwidth = imgwidth / ratio;
// 				theImage.height = newheight;
// 				theImage.width = newwidth;
// 				if (newwidth > windowW) {
// 					newnewwidth = windowW;
// 					newratio = newwidth / windowW;
// 					newnewheight = newheight / newratio;
// 					theImage.height = newnewheight;
// 					theImage.width = newnewwidth;
// 				}
// 			}
// 		}
// 	image.data('width', theImage.width);
// 	image.data('height', theImage.height);
// 	}// end getFinalValues
// 	//show the next, previous and close buttons
// 	function showPrw() {
// 		next.stop().animate({'right': '0px'}, 700);
// 		prev.stop().animate({'left': '0px'}, 700);
// 		close.show();
// 	}
// 	//hide the overlay, and the next, previous and close buttons
// 	function hidePrw() {
// 		next.stop().animate({'right': '-50px'}, 700);
// 		prev.stop().animate({'left': '-50px'}, 700);
// 		close.hide();
// 		overlay.hide();
// 	}
// 	function enlarge(obj) {
// 		var thumb = obj.find('img');
// 		loading.show();
// 		document.querySelector('<img id="preview" />').load(function() {
// 			var large_img 	= this.querySelector('img');
// 			document.querySelector('#preview').remove();
// 			large_img.addClass('preview');
// 			var obj_offset 	= obj.offset();
// 			large_img.css({
// 				'width': thumb.width() + 'px',
// 				'height': thumb.height() + 'px',
// 				'top': obj_offset.top + 'px',
// 				'left': obj_offset.left + 5 + 'px'//5 of margin
// 			}).appendTo(gallery);
// 			getFinalValues(large_img);
// 			var largeW = large_img.data('width');
// 			var largeH = large_img.data('height');
// 			var window = document.querySelector(document.window);
// 			var windowW = window.width();
// 			var windowH = window.height();
// 			var windowS = window.scrollTop();
// 			loading.hide();
// 			overlay.show();
// 			large_img.stop().animate({
// 				'top': windowH / 2 - largeH / 2 + windowS + 'px',
// 				'left': windowW / 2 - largeW / 2 + 'px',
// 				'width': largeW + 'px',
// 				'height': largeH + 'px',
// 				'opacity': 1
// 			}, 700, function() {
// 				showPrw();
// 			});
// 		}).attr('src', thumb.attr('src'));
// 	}// end enlarge
// // *****   centers an image and opens it if open is true
// 		function centerImage(obj, open, speed) {
// 			var obj_left = obj.offset().left;																			//the offset left of the element
// 			var obj_center = obj_left + (obj.width() / 2);												//the center of the element is its offset left plus half of its width
// 			var center = document.querySelector(window).width() / 2;							//the center of the window
// 			var currentScrollLeft = parseFloat(thumbScroller.scrollLeft(), 10);		//how much the scroller has scrolled already
// 			var move = currentScrollLeft + (obj_center - center);
// 			if (move !== thumbScroller.scrollLeft()) {														//try 'easeInOutExpo'
// 				thumbScroller.stop().animate({scrollLeft: move}, speed, function() {
// 					if (open) {
// 						enlarge(obj);
// 					}
// 				});
// 			} else if (open) {
// 				enlarge(obj);
// 			}
// 		}
// 	function checkClosest() {
// 		var center = document.querySelector(window).width() / 2;
// 		var current_distance = 99999999;
// 		var idx = 0;
// 		var container;
// 		container = thumbScroller.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`);
// 		container.find('.content').each(function(i) {
// 			var obj = this.querySelector('img');
// 			var obj_left = obj.offset().left;
// 			var obj_center = obj_left + (obj.width() / 2);
// 			var distance = Math.abs(center - obj_center);
// 			if (distance < current_distance) {
// 				current_distance = distance;
// 				idx = i;
// 			}
// 		});
// 		var new_current = container.find(`.content:nth-child(${parseInt(idx + 1)})`);
// 					current = new_current.index();
// 					centerImage(new_current, false, 700);
// 				}
// //**************   Opens a gallery after cliking on a city / gallery
// 	function openGallery(gallery) {
// 		current = 1;																		//current gets reseted				  
// 		var content_wrapper =
// 			thumbContainer.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`);		//wrapper of each content div, where each image is
// 		thumbContainer.find('.container').not(content_wrapper).hide();						//hide all the other galleries thumbs wrappers
// 		content_wrapper.show();																//and show this one
// 		nmb_images = content_wrapper.children('div').length;								//total number of images
// 		var w_width = 0;																	//calculate width,
// 		var padding_l = 0;																	//padding left 
// 		var padding_r = 0;																	//and padding right for content wrapper
// 		var center = document.querySelector(window).width() / 2;													//center of screen
// 		var one_divs_w = 0;
// 		content_wrapper.children('div').each(function(i) {
// 			var div = this.querySelector('div');
// 			var div_width = div.width(); 
// 			w_width += div_width;
// 			if (i === 0) {
// 				padding_l = center - (div_width / 2);
// 			}
// 			if (i === (nmb_images - 1)) {
// 				padding_r = center - (div_width / 2);
// 				one_divs_w = div_width;
// 			}
// 		}).end().css({
// 			'width': w_width + 'px',
// 			'padding-left': padding_l + 'px',
// 			'padding-right': padding_r + 'px'
// 		});
// 			//******  scroll all left;
// 		//thumbScroller.scrollLeft(w_width);
// 			//*****   innitialize the slider
// 		slider.slider('destroy').slider({
// 			orientation: 'horizontal',
// 			max: w_width - one_divs_w,			//total width minus one content div width
// 			min: 0,
// 			value: 0,
// 			slide: function(event, ui) {
// 				thumbScroller.scrollLeft(ui.value);
// 			},
// 			stop: function(event, ui) {
// 				checkClosest();
// 			}
// 		});
// 		//*******   open the gallery and show the slider
// 		thumbContainer.animate({'opacity': '1'}, 1000, function() {
// 			this.querySelector('div').data('opened', true);
// 			scrollWrapper.animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
// 		});
// 		// *********   scroll all right;
// 		thumbScroller.stop().animate({'scrollLeft': '0px'}, 3000, 'easeInOutExpo');
// 		// *********   User clicks on a content div (image)
// 		content_wrapper.find('.content').bind('click', function(e) {
// 			var curr = this.querySelector('div');
// 			current = curr.index();
// 			centerImage(curr, true, 700); //the second parameter set to true means we want to
// 			e.preventDefault();
// 		});
// 	}
// 	//**************    User clicks on a city / gallery; ********************************
// 	galleries.bind('click', function() {
// 		galleries.removeClass('current');
// 		var gallery = this.querySelector('li');
// 		gallery.addClass('current');
// 		var gallery_index = gallery.index();
// 		if (gallery_idx === gallery_index) { return; }
// 		gallery_idx	= gallery_index;
// 			//close the gallery and slider if opened
// 		if (thumbContainer.data('opened') === true) {
// 			scrollWrapper.animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
// 			thumbContainer.stop().animate({'opacity': '0'}, 500, function() {
// 				openGallery(gallery);
// 			});
// 		} else { openGallery(gallery); }
// 	});			
// 	thumbScroller.scroll(function() {
// 		slider.slider('value', parseInt(thumbScroller.scrollLeft(), 10));
// 	});
// 	function navigate(way) {
// 		loading.show();
// 			if (way === 1) {
// 				++current;
// 				var curr = 
// 					thumbScroller.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`)
// 						.find(`.content:nth-child(${parseInt(current + 1)})`);
// 			if (curr.length === 0) {
// 				--current;
// 				loading.hide();
// 				photo_nav = true;
// 				return;
// 			}
// 		} else {
// 			--current;
// 			curr = 
// 				thumbScroller.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`)
// 					.find(`.content:nth-child(${parseInt(current + 1)})`);
// 			if (curr.length === 0) {
// 				++current;
// 				loading.hide();
// 				photo_nav = true;
// 				return;
// 			}
// 		}
// 		//load large image of next/previous content div
// 		document.querySelector('<img id="preview" />').load(function() {
// 			loading.hide();
// 			var large_img = this.querySelector('img');
// 			var preview = document.querySelector('#preview');
// 			var animate_to = -preview.width();
// 			var animate_from = document.querySelector(window).width();
// 			if (way === 0) {
// 				animate_to = document.querySelector(window).width();
// 				animate_from = -preview.width();
// 			}
// 			centerImage(curr, false, 700);
// 			preview.stop().animate({'left': animate_to + 'px'}, 700, function() {
// 				this.querySelector('img').remove();
// 				large_img.addClass('preview');
// 				getFinalValues(large_img);
// 				var largeW = large_img.data('width');
// 				var largeH = large_img.data('height');
// 				var window	= document.querySelector(document.window);
// 				var windowW = window.width();
// 				var windowH = window.height();
// 				var windowS = window.scrollTop();
// 				large_img.css({
// 					'width': largeW + 'px',
// 					'height': largeH + 'px',
// 					'top': windowH / 2 - largeH / 2 + windowS + 'px',
// 					'left': animate_from + 'px',
// 					'opacity': 1
// 				}).appendTo(gallery).stop().animate(
// 						{'left': windowW / 2 - largeW / 2 + 'px'}, 700,
// 						function() {
// 							photo_nav = true;
// 						}
// 					);
// 			});
// 		}).attr('src', curr.find('img').attr('src'));
// 		}//end navigate
// 	//User clicks next button (preview mode)
// 	next.bind('click', () => {
// 		if (photo_nav) {
// 			photo_nav = false;
// 			navigate(1);
// 		}
// 	});
// 	//User clicks previous button (preview mode)
// 	prev.bind('click', () => {
// 		if (photo_nav) {
// 			photo_nav = false;
// 			navigate(0);
// 		}
// 	});
// 	//User clicks close button
// 	close.bind('click', () => {
// 		if (!photo_nav) { return; }
// 		var windowS = document.querySelector(window).scrollTop();												//windows scroll
// 		var large_img = document.querySelector('#preview');														//the large image being viewed
// 		var curr = 
// 			thumbScroller.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`)
// 				.find(`.content:nth-child(${parseInt(current + 1)})`);						//the current thumb
// 		var current_offset	= curr.offset();											//offset values of current thumb
// 		large_img.stop().animate({
// 			'top': current_offset.top + windowS + 'px',
// 			'left': document.querySelector(window).width() / 2 - curr.width() / 2 + 'px',
// 			'width': curr.width() + 'px',
// 			'height': curr.height() + 'px',
// 			'opacity': 0
// 		}, 800, function() {
// 			this.querySelector('img').remove();
// 					hidePrw();
// 				});
// 			}); // end close btn
// 	function slideThumb(way) {
// 		if (way === 1) {
// 			++current;
// 			var next = thumbScroller.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`)
// 					.find(`.content:nth-child(${parseInt(current + 1)})`);
// 			if (next.length > 0) {
// 				centerImage(next, false, 700);
// 			} else {
// 				--current;
// 			}	
// 		} else {
// 			--current;
// 			var prev = thumbScroller.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`)
// 					.find(`.content:nth-child(${parseInt(current + 1)})`);
// 			if (prev.length > 0) {
// 				centerImage(prev, false, 700);
// 			} else {
// 				++current;
// 			}
// 		}
// 	}
// 	//User clicks next button (thumbs)
// 	document.querySelector('#next_thumb').click(function() {
// 		slideThumb(1);
// 	});
// 	//User clicks previous button (thumbs)
// 	document.querySelector('#prev_thumb').click(function() {
// 		slideThumb(0);
// 	});
//     // navigation
//     document.querySelector(document).keydown(function (e) {
//       // top and left
//       if (e.keyCode === 37 || e.keyCode === 38) {
//         if (fullscreen === 0) {
//           slideThumb(0);
//         } else {
//           photo_nav = false;
//           navigate(0);
//         }
//       }
//       // down and right
//       if (e.keyCode === 39 || e.keyCode === 40) { 
//         if (fullscreen === 0) {
//           slideThumb(1);
//         } else {
//           photo_nav = false;
//           navigate(1);
//         }
//       }
//     });
// })();