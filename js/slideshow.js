export function setupSlideshow() {
  let slideIndex = 1;
  let slideTimer;

  function showSlides(n) {
    const slides = document.querySelectorAll(".slides");
    const dots = document.querySelectorAll(".dot");

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove("active-dot"));

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("active-dot");
  }

  function nextSlide() {
    slideIndex++;
    showSlides(slideIndex);
  }

  function currentSlide(n) {
    clearTimeout(slideTimer);
    slideIndex = n;
    showSlides(slideIndex);
    autoSlides();
  }

  function autoSlides() {
    slideTimer = setTimeout(() => {
      nextSlide();
      autoSlides();
    }, 5000);
  }

  document.addEventListener("DOMContentLoaded", () => {
    showSlides(slideIndex);
    autoSlides();

    const dots = document.querySelectorAll(".dot");
    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const index = parseInt(dot.getAttribute("data-index"));
        currentSlide(index);
      });
    });
  });
}