/*global XMLHttpRequest*/
var xhr = new XMLHttpRequest();
xhr.open('GET', 'gallery.json', true);
xhr.onload = function() {
  var gallerys = JSON.parse(xhr.responseText);
  //display gallerys
  var displayGallery = '<ul class="row">';
  for (let i = 0; i < gallerys.gall.length; i++) {
    displayGallery += `<li class="text-center"><span>${gallerys.gall[i].galName}</span></li>`;
  }
  displayGallery += `</ul>`;
  document.getElementById("nav").innerHTML = displayGallery;
  // onGal click display imgkontener
  var links = document.querySelectorAll('li > span');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(e) {
      proba(i);

    })
  }

  function proba(i) {
    var img = gallerys.gall[i];
    var displayGall = `<div>`
    for (let j = 0; j < img.galImg.length; j++) {
      displayGall += `<img src="${img.galImg[j]}">`;
    }
    displayGall += `</div>`
    document.getElementById("thumbContainer").innerHTML = displayGall;
  }
}
xhr.send();