'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content ');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function (e) {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////// (200) Implementing Smooth Scrolling
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); // DOMRect {x: 0, y: 755, width: 196, height: 3161.6953125, top: 755, …}

  // e.target is the button or link  that we click.
  console.log(e.target.getBoundingClientRect()); // DOMRect {x: 30, y: 304.71875, width: 113.78125, height: 28.5, top: 304.71875, …} x = left, y = right

  // current scrolling
  // 'pagexOffset' and 'pageyOffset' are now deprecated / removed .Instead use 'ScrollX' and 'ScrollY'.
  console.log('current scroll (x/y)', window.scrollX, window.scrollY); // current scroll (x/y) 0 179.5

  // We can also read the height and width of the viewport
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // height/width viewport 832 985

  // Just Scrolling
  //window.scrollTo(
  //s1coords.left + window.scrollX,
  //s1coords.top + window.scrollY
  //);

  // Scrolling with animation
  //window.scrollTo({
  //left: s1coords.left + window.scrollX,
  //top: s1coords.top + window.scrollY,
  //behavior: 'smooth',
  //});

  // More modern scrolling with animation only with modern browsers

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////// (204) Event Delegation: Implementing page navigation
// THis is what event delegation is

//document.querySelectorAll('.nav__link').forEach(function (el) {
//el.addEventListener('click', function (e) {
// stopp scrolling page
//e.preventDefault();

//const id = this.getAttribute('href');
//console.log(id); // #section--1 #section--2 #section--3

//document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//});
//});

// Event Delegation we basically need two steps and it's  very  important to keep in mind.
// 1. Add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // 2. Determine what element originated the event
  // where click happens
  //console.log(e.target); // you will see on the console where you clicked .

  // Marching strategy very important and actually hard
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id); // #section--1 #section--2 #section--3

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
/////////////////////////(206) Building tabbed component

// Tabbed component. I put it up
//const tabs = document.querySelectorAll('.operations__tab');
//const tabsContainer = document.querySelector('.operations__tab-container');
//const tabsContent = document.querySelectorAll('.operations__content ');

// Tabs__Container are the parent of the button and we will attach with even hadler function as an event delegation

tabsContainer.addEventListener('click', function (e) {
  // Marching strategy very important and actually hard
  // e.target shows where we click. Closest or parent element is operations__tab

  const clicked = e.target.closest('.operations__tab');
  //console.log(clicked);

  // This is called Guard clause and it's more modern. means when there is no clicked here then we want to return ->  clicked.classList.add('operations__content--active');

  if (!clicked) return;

  // Remove tabs and tabContent in active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // This is more traditionally and it's what we do everyday.
  //if (clicked) {
  // clicked.classList.add('operations__content--active');

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  //console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////// (207)
// Menu fade animation. we will use  here mouseover.mouseenter and mouseover are actaully similar with the difference is that mousenter doesn't bubble.Here we need event to bubble so it can even reach the navigation element.

//const nav = document.querySelector('.nav');
// Refactoring code
const handleHover = function (e) {
  //console.log(this, e.currentTarget); // This keyword is exactly same e.currentTarget
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const Siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    Siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
// Bind() function returns new funtion
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////(208) Implementing a sticky navigation: The Scroll event. I wrote  in the project

// sticky navigation
// This event will be fired off each time that we scroll on our page

// Calculating the initial coordinates and section1 is features

const initialCoords = section1.getBoundingClientRect();
//console.log(initialCoords);

window.addEventListener('scroll', function () {
  // console.log(window.scrollY);

  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});

///////////////////////////////////////////(209) A better way: The Intersection Observer API

// Explanation

//const obsCallback = function (entries, observer) {
// When ever our target the first section1 is intersecting the viewport at 10% because that's the root and 10% is the threshold when that intersection happens , Then this call back function (obsCallback)  will be called and that no matter if we are scrolling up or down.

//entries.forEach(entries => {
// console.log(entries);
// });
//};
//const obsOptions = {
// this root is the element that the target is intersecting  and section1 is the target
//root: null,
// threshold is the percentage of intersection the observer callback will be called.  let's set it 0.1 -> 10%
//threshold: [0, 0.2],
//};
//const Observer = new IntersectionObserver(obsCallback, obsOptions);
//Observer.observe(section1);

// Making navigation  sticky

// When do we want our navigation to become sticky?
// We want that to happen when the header moves completely out of view that's when we want to display the navigation

const header = document.querySelector('.header');

// Calculating the nav height
const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight); // 90

const stickyNav = function (entries) {
  // now we don't need observer here
  // There is one   threshold: 0, here so I don't need to to loop over all the entries we only need the first one so we use here destructuring to get the first element  entry
  const [entry] = entries; // exactly  same entries[0]

  //console.log(entry);

  // If the target is not intersecting the root  then add make nav sticky otherwise remove sticky
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // 90 is the height of the navigation
});

headerObserver.observe(header);

///////////////////////////////////////////(210) Revealing Elements on scroll

// Reveal selections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  //console.log(entries); // (4) [ 0: IntersectionObserverEntry,  1: IntersectionObserverEntry,   2:IntersectionObserverEntry,  3:IntersectionObserverEntry

  entries.forEach(entry => {
    //IF it's not intersecting then return right now but if it is intersecting, then the function will not return and rest of the code is gonna be executed.

    if (!entry.isIntersecting) return;
    // To know which section intersects the viewport. You can use the entry.target.classList.remove('section--hidden');
    entry.target.classList.remove('section--hidden');
    // To make the (entry.target) unobserved
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // Hide sections
  //section.classList.add('section--hidden');
});
///////////////////////////////////////////(212) Lazy Loading Images.

// This Lazy Loading Images are  really impact how your site works and especially for your users who might have a slow internet connection or a low data plan or a slow cell phone and we always have to think these users as well , because everyone has not a super high level computer or the latest mobile phone.

// We don't want to select all images but we select the only images in the data-source attribute
const imgTargets = document.querySelectorAll('img[data-src]');
//console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry); // Entry are intersections

  // If they are not intersecting
  if (!entry.isIntersecting) return;
  // but otherwise replace src with data-src attribute
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////(213) Building  a slider component: Part1, Part2
// Slider
const sliders = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;

  // Stop slides
  const maxSlide = slides.length;

  //const slider = document.querySelector('.slider');
  //slider.style.transform = 'scale(0.4) translateX(-800PX)';
  //slider.style.overflow = 'visible';

  //insertAdjacentHTML() creating HTML document
  // This is called the convention of the throw away variable  _, i indexes for numbers 0, 1, 2, 3

  // All functions
  const creatDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Activating the dots
  const ActivateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // s -> for  slides  i -> for indexes
  //Function  Refactoring
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)

      // how it calculated i = 0 , 0 * (- 1)  curSlide = -1, (-1 *  100 )translateX(${100 = -100%,
    );
  };

  //  Move to next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++; // increase forewards
    }
    // Calling the factored function
    goToSlide(curSlide);
    ActivateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--; // Decrease backwards
    }

    goToSlide(curSlide);
    ActivateDot(curSlide);
  };

  // Factored functions
  const init = function () {
    goToSlide(0);
    creatDots();
    ActivateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  // prevSlide -> previouSlide

  // We start by attaching an event handler to a keyboard event so  we can also slide through the slider using the left and right arrow on keyboards.

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // We use here an event delegation because dotContainer is the parent element and we attach to an addEventhandler
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log('DOT');
      // we make a destructure here :const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};
sliders();
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

//////////////////////////// (198) Selecting,  Creating and Deleting  Elements

// The GOAL of this lecture is more to be like a quick reference for you in the future because these methods that I'm gonna show you here are  actually more difficult to find and to understand from the MDN DOCUMENTATION and so when you need some of these methods in the future then you can rewatch this lecture again.

/*
// Selecting Elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections); // NodeList(4)[section#section--1.section, section#section--2.section, section#section--3.section, section.section.section--sign-up]

document.getElementById('section--1');
// All buttons in our page
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); // HTMLCollection(9) [button.btn--text.btn--scroll-to, button.btn.operations__tab.operations__tab--1.operations__tab--active, button.btn.operations__tab.operations__tab--2, button.btn.operations__tab.operations__tab--3, button.slider__btn.slider__btn--left, button.slider__btn.slider__btn--right, button.btn.btn--show-modal, button.btn--close-modal, button.btn]0: button.btn--text.btn--scroll-to1: button.btn.operations__tab.operations__tab--1.operations__tab--active2: button.btn.operations__tab.operations__tab--23: button.btn.operations__tab.operations__tab--34: button.slider__btn.slider__btn--left5: button.slider__btn.slider__btn--right6: button.btn.btn--show-modal7: button.btn--close-modal8: button.btnlength: 9[[Prototype]]: HTMLCollection

// You  don't need to write . dot class
console.log(document.getElementsByClassName('btn'));

//Creating and Inserting Elements

// We can create HTML elements using the Insert Adjacent HTML function insertAdjacent()

const message = document.createElement('div');
message.classList.add('cookie-message');
// Adds webpage
//message.textContent =
//' we use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for functionality and analytics. <button class= "btn btn--close-cookie">Got it! </button>';
// prepend adds the first child of the element header.
//header.prepend(message);
// append  adds the last child of the element header.
header.append(message);

// we can add our text multiple places at once by using CloneNode() method.
//header.append(message.cloneNode(true));// This true means that all child elements will also be copied.

// before the header as a sibling 
//header.before(message);
// after the header also as a sibling 
//header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    //message.remove(); ES6
    // Old way  school and this DOM traversing
    message.parentElement.removeChild(message);
  });

/////////////////////// (199) Styles, Attributes, and Classes

// Style: These styles are called inline styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color); // this will disappear on console
console.log(message.style.backgroundColor); // rgb(55, 56, 61)

// If you want to know the height, widhth, fonts or color and etc. You can use getComputedSytle(message).color);
console.log(getComputedStyle(message).fontFamily); // Poppins, sans-serif

console.log(getComputedStyle(message).height); // 142.5px this px is string we will change it into  number by using parsefloat()

// We increase the height px
message.style.height =
  Number.parseFloat(
    // This 10 in parseFloat() is actually not needed and doesn't have any affect. You can leave it.
    getComputedStyle(message).height,
    10
  ) +
  40 +
  'px';

//  --color-primary: #5ec576; They are called custom properties , and they are more like variables. :Root is like Document

document.documentElement.style.setProperty(
  // write it , if you copy  and past will not work properly.
  '--color-primary',
  'orangered'
);

// Attribures

// Attributes are  like src, alt, class, Id in HTML and in javaScript we can access and change these different attributes.

const logo = document.querySelector('.nav__logo');
console.log(logo.alt); // Bankist logo
console.log(logo.className); // nav__logo
// we can also write in it
logo.alt = 'Beatiful minimalist logo';
logo.setAttribute('company', 'Bankist'); //  company', 'Bankist' in HTML

// Keep in mind
console.log(logo.src); // http://127.0.0.1:5500/starter/img/logo.png This is an absolute version
console.log(logo.getAttribute('src')); // img/logo.png This is a relative version

// These links are exactly same because  they rae both absolute version
const link = document.querySelector('.twitter-link');
console.log(link.href); // https://twitter.com/jonasschmedtman

console.log(link.getAttribute('href')); // https://twitter.com/jonasschmedtman

console.log(logo.designer); // undefined because  this is not a standard property that's expected to be on images.
// But another way to read a Non-standard
console.log(logo.getAttribute('designer')); // Muse

// Data attributes : Are special kind of attributes that start with the words data
console.log(logo.dataset.versionNumber); // versionNumber write it with  CamelCase 3.0

// Classes
// you can pass multiple names
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // Not includes as an arrays.

// Don't use  it because this will override all the existing classes while four methods here make it really nice to work with the classes.
logo.className = 'Jonas';

////////////////////////////// (200) Implementing Smooth Scrolling

const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); // DOMRect {x: 0, y: 755, width: 196, height: 3161.6953125, top: 755, …}

  // e.target is the button or link  that we click.
  console.log(e.target.getBoundingClientRect()); // DOMRect {x: 30, y: 304.71875, width: 113.78125, height: 28.5, top: 304.71875, …} x = left, y = right

  // current scrolling
  // 'pagexOffset' and 'pageyOffset' are now deprecated / removed .Instead use 'ScrollX' and 'ScrollY'.
  console.log('current scroll (x/y)', window.scrollX, window.scrollY); // current scroll (x/y) 0 179.5

  // We can also read the height and width of the viewport
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  ); // height/width viewport 832 985

  // Just Scrolling method 1
  //window.scrollTo(
  //s1coords.left + window.scrollX,
  //s1coords.top + window.scrollY
  //);

  // Scrolling method 2
  //window.scrollTo({
  //left: s1coords.left + window.scrollX,
  //top: s1coords.top + window.scrollY,
  //behavior: 'smooth',
  //});

  method 3
  // More modern scrolling with animation only with modern browsers

  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////// (201) Types of events and event handlers

// An event is  basically a signal that's generated by a certain dumb node and a signal means something that has happened. For example , a click somewhere or the mouse moving or the user triggering the full screen mode and really anything of importance.

//const h1 = document.querySelector('h1');

// Mouseenter event here is a little bit like the hover event in CSS so it fires when ever the mouse enters a certain element.
//h1.addEventListener('mouseenter', function (e) {
//alert('addEventListener: Great! You are reading the heading :D');
//});

// Onmouseenter event

//h1.onmouseenter = function (e) {
//alert('AddEventListener: Great! Muse You are reading the heading  :D');
//};

// Removing the mouseenter

//const h1 = document.querySelector('h1');

//const alertH1 = function (e) {
//alert('addEventListener: Great! You are reading the heading : D');

// h1.removeEventListener('mouseenter', alertH1);
//};

//h1.addEventListener('mouseenter', alertH1);

//setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//This an an old schoool html event on click nobody uses it recently
// <h1 onclick="alert('HTML alert')">

//////////////////////////// (202) Event Propagation : Bubbling and Capturing
// This lecture was just an explanation of Event Propagation .

//////////////////////////// (203) Event Propagation in Practice.

// Random randomInt
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// RandomColor rgb(255,255,255)
const RandomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)} )`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  // This keyword points always to the element on which that event handler is attached.
  this.style.backgroundColor = RandomColor();
  // Target is where the event origanated also is where the click happens
  // e.currentTarget is indeed the on which the event handler is attached.
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this); // true
  // Stop event Propagation: Now in practice is just to learn ok but usually not a good idea to stop propagation
  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // This keyword points always to the element on which that event handler is attached.
  this.style.backgroundColor = RandomColor();

  // Target is where the event origanated also is where the click happens
  // e.currentTarget is indeed the element on which the event handler is attached.
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  // This keyword points always to the element on which that event handler is attached.
  this.style.backgroundColor = RandomColor();

  // Target is where the event origanated also is where the click happens
  // e.currentTarget is indeed the element on which the event handler is attached.
  console.log('NAV', e.target, e.currentTarget);
});

/////////////////////////////// (204) Event Delegation: Implementing page navigation
// I  have written it  in the code  project above

///////////////////////////////// (205) DOM Traversing

// DOM traversing is basically walking through the DOM. Which means that we can select an element based on another element.

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight')); // NodeList(2) [span.highlight, span.highlight]

// These are the children of  h1
console.log(h1.childNodes); // NodeList(9) [text, comment, text, span.highlight, text, br, text, span.highlight, text]

console.log(h1.children); // HTMLCollection [span.highlight, br, span.highlight] is a live collection, so it's updated. This works only for direct children. Keep that in mind

// First and last child element
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// going upwards: parents
console.log(h1.parentNode); // parentNode and ParentElement are exactly same
console.log(h1.parentElement); // parentNode and ParentElement are exactly same

h1.closest('.header').style.background = 'var( --gradient-secondary)'; // closest element very important
//--gradient-secondary

h1.closest('h1').style.background = 'var( --gradient-primary)'; // closest element of the header is h1. QuerySelector finds children while the closest method finds parents.

// Going sideways: Siblings
console.log(h1.previousElementSibling); // null
console.log(h1.nextElementSibling); // h4

console.log(h1.previousSibling); // #text
console.log(h1.nextSibling); // #text

console.log(h1.parentElement.children); // HTMLCollection(4) [h1, h4, button.btn--text.btn--scroll-to, img.header__img]

// This is an HTML collection not an  array , but it's still an iterable that we can spread into an array. spread operator [...]
[...h1.parentElement.children].forEach(function (el) {
  // different or equal ->  !==
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/
/////////////////////////////////////////// (206) building a tabbed component : written in the project

/////////////////////////////////////////// (207) Passing arguments to event handlers. written in  the project

///////////////////////////////////////////(208) Implementing a sticky navigation: The Scroll event.written in project

///////////////////////////////////////////(209) A better way: The Intersection Observer API. written in project

///////////////////////////////////////////(210) Revealing Elements on scroll. written in project

// We're gonna reveal elements as we scroll close to them and this effect can give your pages a very nice touch and we can easily implement it without external library.written in project

///////////////////////////////////////////(211) Fixing a small scrolling bug. written in project

///////////////////////////////////////////(212) Lazy Loading Images. written in project

///////////////////////////////////////////(213) Building  a slider component: Part 1. written in project

///////////////////////////////////////////(214) Building  a slider component: Part 2. written in project

///////////////////////////////////////////(215) Lifecycle DOM Events

// Life cycle we mean right from the moment that the page is first accessed, until the user leaves it.

// DOM content loaded means when this event is fired by the document as soon as the HTML is completely parsed, which means that the  HTML has been downloaded and been converted to DOM tree.

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// The load event is fired by the window. As soon as not only the HTML is parsed but also all the images and external resources like css files are also loaded.

//Load event
window.addEventListener('load', function (e) {
  console.log('page fully loaded', e);
});

// This event is created immediately before a user leaves the page. For example, after clicking the close button in the browser tab.

// Beforeunload
//window.addEventListener('beforeunload', function (e) {
//e.preventDefault();
//console.log(e);
//e.returnValue = '';
//});

///////////////////////////////////////////// (216) Efficient script loading: Defer and Async

// The different ways of loading javaScript in HTML and there are three ways OF SCRIPTS LOADING that we can load javaScript in HTML  and they are: Regular, Async, and Defer

//Regular: <script src="script.js">. Write this REGULAR  at the body end  after  the HTML was  parsed and we will always use the regular way.

//Async: <script async src="script.js"> Write this async in HEAD. The reason is that we don't use async and defer , they don't have a practical effector. Make no sense

//Defer: <script  defer src="script.js"> Write this DEFER in HEAD .The reason is that we don't use async and defer  , they don't have a practical effector. Make no sense
