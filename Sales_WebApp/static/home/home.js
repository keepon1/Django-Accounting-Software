// Display and close menus

function display(){
    document.getElementById("menu").style.display = 'block';
    document.getElementById("bar").style.display = 'none';
}

function display_non(){
    document.getElementById("menu").style.display = 'none';
    document.getElementById("bar").style.display = 'block';
}

// slide show
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}


function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("body1");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }

  slides[slideIndex-1].style.display = "block";  
}