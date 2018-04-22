/*global XMLHttpRequest $ Image */
var xhr = new XMLHttpRequest();
xhr.open('GET', 'gallery.json', true);
xhr.onload = function() {
  var gallerys = JSON.parse(xhr.responseText);

  //display gallerys nav and Images

  var displayGallery = '';
  var imgContainer = '';

  for (let i = 0; i < gallerys.gall.length; i++) {
    displayGallery += `<li><a href="#"><span>${gallerys.gall[i].galName}</span></a></li>`;
    imgContainer += `<div class="container ${gallerys.gall[i].galName}">`
    for (let j = 0; j < gallerys.gall[i].galImg.length; j++) {
      imgContainer += `<div class="content"><div>
                        <a href="#"><img src="${gallerys.gall[i].galImg[j]}" class="thumb" />
                        </a></div></div>`
    }
    imgContainer += `</div>`
 }

  document.getElementById("galleryList").innerHTML = displayGallery;
  document.getElementById("thumbScroller").innerHTML = imgContainer;


(function gallery() {
  var gallery = $('#gallery');                 //the main wrapper of the gallery
  var overlay = $('#overlay');                 //the overlay when the large image is displayed
  var loading = $('#loading');                 //image loading status
  var next = $('#next');                       //the next buttons
  var prev = $('#prev');                       //previous buttons
  var close = $('#close');                     //the close button
  var thumbContainer = $('#thumbContainer');   //the main container for the thumbs structure
  var scrollWrapper = $('#scrollWrapper');     //wrapper of ui slider
  var nmb_images = 0;                                               //total number of images
  var gallery_idx = -1;                                             //which gallery is clicked (index)
  var thumbScroller = $('#thumbScroller');     //scroller wrapper
  var slider = $('#slider');                   //ui slider
  var galleries = $('#galleryList > li');      //the links of the galleries
  var current = 0;                                                  //current image being viewed
  var fullscreen = true;                                            // navigate with keyboard and wheel
  var photo_nav = true;                                             //prevent fast clicks on next and previous
  //document.querySelector(window)
  
  function getFinalValues(image) {
    var widthMargin = 0
    var heightMargin = 20;
    var $window = $(window);
    var windowH = $window.height() - heightMargin;
    var windowW = $window.width() - widthMargin;
    var theImage = new Image();
    var imgwidth = theImage.width;
    var imgheight = theImage.height;

    theImage.src = image.attr("src");

    if ((imgwidth > windowW) || (imgheight > windowH)) {
      if (imgwidth > imgheight) {

        var newwidth = windowW;
        var ratio = imgwidth / windowW;
        var newheight = imgheight / ratio;

        theImage.height = newheight;
        theImage.width = newwidth;

        if (newheight > windowH) {

          var newnewheight = windowH;
          var newratio = newheight / windowH;
          var newnewwidth = newwidth / newratio;

          theImage.width = newnewwidth;
          theImage.height = newnewheight;
        }
      } else {

        let newheight = windowH;
        let ratio = imgheight / windowH;
        let newwidth = imgwidth / ratio;

        theImage.height = newheight;
        theImage.width = newwidth;

        if (newwidth > windowW) {

          let newnewwidth = windowW;
          let newratio = newwidth / windowW;
          let newnewheight = newheight / newratio;

          theImage.height = newnewheight;
          theImage.width = newnewwidth;
        }
      }
    }
    image.data('width', theImage.width);
    image.data('height', theImage.height);
  }

  //User clicks on a city / gallery;

  galleries.bind('click', function() {

    var gallery = $(this); //this.querySelector('li');
    var gallery_index = gallery.index();

    galleries.removeClass('current');
    gallery.addClass('current');

    if (gallery_idx === gallery_index) {
      return;
    }
    gallery_idx = gallery_index;
    
    //close the gallery and slider if opened

    if (thumbContainer.data('opened') === true) {
      scrollWrapper.fadeOut();
      thumbContainer.stop().animate({ 'height': '0px' }, 500, function() {
        openGallery(gallery);
      });
    } else {
      openGallery(gallery);
    }
  });

  //opens a gallery after cliking on a city / gallery

  function openGallery(gallery) {

    current = 0;                                                        //current gets reseted
    
    var content_wrapper = thumbContainer
      .find(`.container:nth-child(${parseInt(gallery_idx + 1)})`);      //wrapper of each content div, where each image is
    thumbContainer.find('.container').not(content_wrapper).hide();      //hide all the other galleries thumbs wrappers
    content_wrapper.show();//and show this one
    nmb_images = content_wrapper.children('div').length;                //total number of images
    
    var w_width = 0;                                                    //calculate width,
    var padding_l = 0;                                                  //padding left 
    var padding_r = 0;                                                  //and padding right for content wrapper
    var center = $(window).width() / 2;                                 //center of screen
    var one_divs_w = 0;

    content_wrapper.children('div').each(function(i) {
      var div = $(this); //this.querySelector('li');
      var div_width = div.width();
      w_width += div_width;
      
      if (i === 0) {
        padding_l = center - (div_width / 2);                           //if first one, lets calculate the padding left
      }
      if (i === (nmb_images - 1)) {
        padding_r = center - (div_width / 2);                           //if last one, lets calculate the padding right
        one_divs_w = div_width;
      }
    }).end().css({
      'width': w_width + 'px',
      'padding-left': padding_l + 'px',
      'padding-right': padding_r + 'px'
    });

    thumbScroller.scrollLeft(w_width / 2);                                   //scroll all left;
    
    slider.slider('destroy').slider({                                    //innitialize the slider
      orientation: 'horizontal',
      max: w_width - one_divs_w,                                         //total width minus one content div width
      min: 0,
      value: 0,
      slide: function(event, ui) {
        thumbScroller.scrollLeft(ui.value);
      },
      stop: function(event, ui) {
        checkClosest();
      }
    });

    //open the gallery and show the slider
    
    thumbContainer.animate({ 'height': '405px' }, 1000, function() {
      $(this).data('opened', true);//this.querySelector('div').data
      scrollWrapper.fadeIn();
    });
    
    thumbScroller.stop().animate({ 'scrollLeft': '0px' }, 2000, 'easeInOutExpo'); //scroll all right;
    
    //User clicks on a content div (image)
    
    content_wrapper.find('.content').bind('click', function(e) {

      var $current = $(this);//this.querySelector('div'); //curr
      
      current = $current.index();                                                     //track the current one
      centerImage($current, true, 700);
      e.preventDefault();
    });
  }

  //while the gallery scrolls we want that the slider scrolls as well

  thumbScroller.scroll(function() {
    slider.slider('value', parseInt(thumbScroller.scrollLeft(), 10));
  });

  //User clicks next button (preview mode)

  next.bind('click', function() {
    if (photo_nav) {
      photo_nav = false;
      navigate(1);
    }
  });

  //User clicks previous button (preview mode)

  prev.bind('click', function() {
    if (photo_nav) {
      photo_nav = false;
      navigate(0);
    }
  });

  //User clicks next button (thumbs)

  $('#next_thumb').click(function() {
    slideThumb(1);
  });

  //User clicks previous button (thumbs)

  $('#prev_thumb').click(function() {
    slideThumb(0);
  });
  
  //User clicks close button

  close.bind('click', function() {
    if (!photo_nav) {
      return;
    }
    var windowS = $(window).scrollTop();                    //windows scroll if any
    var large_img = $('#preview');     //the large image being viewed

    //the current thumb 
    var $current = thumbScroller
      .find(`.container:nth-child(${parseInt(gallery_idx + 1)})`)
        .find(`.content:nth-child(${parseInt(current + 1)})`);
    var current_offset = $current.offset();                      //offset values of current thumb

    large_img.stop().animate({
      'top': current_offset.top + windowS + 'px',
      'left': $(window).width() / 2 - $current.width() / 2 + 'px',
      'width': $current.width() + 'px',
      'height': $current.height() + 'px',
      'opacity': 0
    }, 800, function() {
      $(this).remove(); //this.querySelector('img')
      hidePreviewFunctions();                                 //hide the overlay, and the next, previous and close buttons
    });
  });

  //centers an image and opens it if open is true

  function centerImage(obj, open, speed) {
    
    var obj_left = obj.offset().left;                                   //the offset left of the element
    var obj_center = obj_left + (obj.width() / 2);
    var center = $(window).width() / 2;                                 //the center of the window
    var currentScrollLeft = parseFloat(thumbScroller.scrollLeft(), 10); //how much the scroller has scrolled already
    var move = currentScrollLeft + (obj_center - center);

    if (move !== thumbScroller.scrollLeft()) {                            //try 'easeInOutExpo'
      thumbScroller.stop().animate({ scrollLeft: move }, speed, function() {
        if (open) {
          enlarge(obj);
        }
      });
    } else if (open) {
      enlarge(obj);
    }
  }

  function enlarge(obj) {
    
    var thumb = obj.find('img');                                        //the image element
    
    loading.show();//show loading image

    //preload large image

    $('<img id="preview" />').load(function() {
      
      var large_img = $(this); //this.querySelector
      
      $('#preview').remove();                      //confirm there's no other large one
      large_img.addClass('preview');

      var obj_offset = obj.offset();
      large_img.css({
        'width': thumb.width() + 'px',
        'height': thumb.height() + 'px',
        'top': obj_offset.top + 'px',
        'left': obj_offset.left + 5 + 'px'                                //5 of margin
      }).appendTo(gallery);

      getFinalValues(large_img);
      var largeW = large_img.data('width');
      var largeH = large_img.data('height');
      var $window = $(window); //document.querySelector(document.window);
      var windowW = $window.width();
      var windowH = $window.height();
      var windowS = $window.scrollTop();
      
      loading.hide();                                                   //hide the image loading
      overlay.show();                                                   //show the overlay
      
      large_img.stop().animate({                                       //now animate the large image
        'top': windowH / 2 - largeH / 2 + windowS + 'px',
        'left': windowW / 2 - largeW / 2 + 'px',
        'width': largeW + 'px',
        'height': largeH + 'px',
        'opacity': 1
      }, 800, function() {
        showPreviewFunctions();
      });
    }).attr('src', thumb.attr('src'));
  }
  //shows next or previous image 1 is right;0 is left

  function navigate(way) {
    loading.show();
    if (way === 1) {
      ++current;
      var $current = thumbScroller.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`).find(`.content:nth-child(${parseInt(current + 1)})`);
      if ($current.length === 0) {
        --current;
        loading.hide();
        photo_nav = true;
        return;
      }
    } else {
      --current;
      $current = thumbScroller.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`).find(`.content:nth-child(${parseInt(current + 1)})`);
      if ($current.length === 0) {
        ++current;
        loading.hide();
        photo_nav = true;
        return;
      }
    }

    //load large image of next/previous content div

    $('<img id="preview" />').load(function() {
      loading.hide();

      var large_img = $(this); //this.querySelector('img');
      var preview = $('#preview');
      var animate_to = -preview.width();
      var animate_from = $(window).width();

      if (way === 0) {
        animate_to = $(window).width();
        animate_from = -preview.width();
      }

      centerImage($current, false, 700);
      preview.stop().animate({ 'left': animate_to + 'px' }, 700, function() {
        $(this).remove(); //this.querySelector('img')
        large_img.addClass('preview');
        getFinalValues(large_img);

        var largeW = large_img.data('width');
        var largeH = large_img.data('height');
        var $window = $(window);
        var windowW = $window.width();
        var windowH = $window.height();
        var windowS = $window.scrollTop();

        large_img.css({
          'width': largeW + 'px',
          'height': largeH + 'px',
          'top': windowH / 2 - largeH / 2 + windowS + 'px',
          'left': animate_from + 'px',
          'opacity': 1
        }).appendTo(gallery).stop().animate({ 'left': windowW / 2 - largeW / 2 + 'px' }, 700, function() {
          photo_nav = true;
        });
      });
    }).attr('src', $current.find('img').attr('src'));
  }

  //show the next, previous and close buttons

  function showPreviewFunctions() {
    next.stop().animate({ 'right': '0px' }, 700);
    prev.stop().animate({ 'left': '0px' }, 700);
    close.show();
  }

  //hide the overlay, and the next, previous and close buttons

  function hidePreviewFunctions() {
    next.stop().animate({ 'right': '-50px' }, 700);
    prev.stop().animate({ 'left': '-50px' }, 700);
    close.hide();
    overlay.hide();
  }

  function slideThumb(way) {
    if (way === 1) {
      ++current;
      var next = thumbScroller
        .find(`.container:nth-child(${parseInt(gallery_idx + 1)})`)
          .find(`.content:nth-child(${parseInt(current + 1)})`);
      
      if (next.length > 0) {
        centerImage(next, false, 600);
      } else {
        --current;
      }
    } else {
      --current;
      var prev = thumbScroller
        .find(`.container:nth-child(${parseInt(gallery_idx + 1)})`)
          .find(`.content:nth-child(${parseInt(current + 1)})`);
      if (prev.length > 0) {
        centerImage(prev, false, 600);
      } else {
        ++current;
      }
    }
  }

  function checkClosest() {
    var center = $(window).width() / 2; //document.querySelector(window)
    var current_distance = 99999999;
    var idx = 0;
    var container;

    container = thumbScroller.find(`.container:nth-child(${parseInt(gallery_idx + 1)})`);
    container.find('.content').each(function(i) {
      
      var obj = $(this); //this.querySelector('img');
      var obj_left = obj.offset().left;//the offset left of the element
      var obj_center = obj_left + (obj.width() / 2);
      var distance = Math.abs(center - obj_center);

      if (distance < current_distance) {
        current_distance = distance;
        idx = i;
      }
    });

    var new_current = container.find(`.content:nth-child(${parseInt(idx + 1)})`);
    current = new_current.index();
    centerImage(new_current, false, 700);
  }

  // navigation

  $(document).keydown(function(e) { // document.querySelector(document)
    // top and left
    if (e.keyCode === 37 || e.keyCode === 38) {
      if (fullscreen === 0) {
        slideThumb(0);
      } else {
        photo_nav = false;
        navigate(0);
      }
    }
    // down and right
    if (e.keyCode === 39 || e.keyCode === 40) {
      if (fullscreen === 0) {
        slideThumb(1);
      } else {
        photo_nav = false;
        navigate(1);
      }
    }
  });
})();
}
xhr.send();