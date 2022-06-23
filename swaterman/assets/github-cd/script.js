let slide = 0;

function showPrev(){
  if(slide === 0) return;
  showSlide(slide - 1);
}

function showNext(){
  if(slide === 9) return;
  showSlide(slide + 1);
}

function showSlide(number){
  slide = number;
  document.querySelectorAll(".maybe").forEach(element => element.classList.add("hidden"));
  document.querySelectorAll(".show" + number).forEach(element => element.classList.remove("hidden"));

  highlightSlideCode(number);
}

function highlightSlideCode(number){
  document.querySelectorAll(".slideCode").forEach(element => element.classList.remove("codeHighlight"));
  const elements = document.querySelectorAll(".slideCode" + number);
  if(elements.length === 0) return;
  elements.forEach(element => element.classList.add("codeHighlight"));
  elements[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
}

