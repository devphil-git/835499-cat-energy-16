var navMain = document.querySelector(".header__menu");
var navToggle = document.querySelector(".header__buttons");
var buttonMenu = document.querySelector(".button--menu");
var buttonClose = document.querySelector(".button--close");

navMain.classList.remove('header__menu--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('header__menu--closed')) {
    navMain.classList.remove('header__menu--closed');
    navMain.classList.add('header__menu--opened');
    buttonMenu.classList.add('visually-hidden');
    buttonClose.classList.remove('visually-hidden');
  }
  else {
    navMain.classList.add('header__menu--closed');
    navMain.classList.remove('header__menu--opened');
    buttonMenu.classList.remove('visually-hidden');
    buttonClose.classList.add('visually-hidden');
  }
});
