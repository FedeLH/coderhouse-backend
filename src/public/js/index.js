var burger = document.querySelector(".navbar-toggle");
var menu = document.querySelector(".navbar-menu");

burger.addEventListener("click", function () {
  burger.classList.toggle("active");
  menu.classList.toggle("open");
});
