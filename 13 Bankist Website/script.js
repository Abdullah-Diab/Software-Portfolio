"use strict";

// Bankist App
// --------------------------------

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTO = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const navLink = document.querySelectorAll(".nav__link");
const navLinks = document.querySelector(".nav__links");

// -- Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// -- Button scrolling
btnScrollTO.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
});

// -- Page Navigation
// - This is not a clean solution; that impacts the performance.
// navLink.forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// - Event Delegation is the best solution.
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// -- Tabbed component
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Active Tab
  clicked.classList.add("operations__tab--active");
  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// -- Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.6));
nav.addEventListener("mouseout", handleHover.bind(1));

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// Sticky navigation: The Intersection Observer API
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal Section
const allSection = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy Loading Images
const imgTargets = document.querySelectorAll("img[data-src]");
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});
imgTargets.forEach((img) => imgObserver.observe(img));

// Slider
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

let curSlide = 0;
const maxSlide = slides.length;

const creatDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  });
};

const activateDote = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDote(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activateDote(curSlide);
};

const init = function () {
  goToSlide(0);
  creatDots();
  activateDote(0);
};
init();

// Event handlers
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  e.key === "ArrowRight" && nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDote(slide);
  }
});

// Lectures
// --------------------------------

// -- What is the DOM?
// - Allows us to make JS interact with the browser.
// - We can write JS to creat, modify and delete HTML elements. And we can set styles, classes and attributes. And listen and respond to events.
// - DOM tree is generated from an HTML document, which we can then interact with.
// - Dom is a very complex API that contains lots of methods and properties to interacte with the DOM tree.
// - In the DOM there are different types of nodes, for example som nodes are HTML elements but others are just text.

// -- Selecting Elements...
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

console.log(document.querySelector(".header"));
console.log(document.querySelectorAll(".section"));

console.log(document.getElementById("section--1"));
console.log(document.getElementsByTagName("button"));
console.log(document.getElementsByClassName("btn"));

// Creating and Inserting elements... (STEPS: Create Element, Add Class, Add Content or Add Content with Element, Inserting it)
// .insertAdjacentHTML()
const message = document.createElement("div");
message.classList.add("cookie-message");
// message.textContent = `We use cookied for improved functionality and analytics.`;
message.innerHTML = `We use cookied for improved functionality and analytics. <button class="btn btn-close-cookie">Got it!</button>`;
// const header = document.querySelector(".header");
// header.prepend(message);
// header.append(message);
// header.before(message);
// header.after(message);

// -- Deleting Elements...
// document
//   .querySelector(".btn-close-cookie")
//   .addEventListener("click", () => message.remove());

// -- Styles...
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 20 + "px";

// document.documentElement.style.setProperty("--color-primary", "orangered");

// -- Attributes...
const logo = document.querySelector(".nav__logo");
console.log(logo.alt);
console.log(logo.className);

logo.alt = "Beautiful minimalist logo";
logo.setAttribute("designer", "Jouns");
console.log(logo.alt);

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute("designer"));

console.log(logo.src);
console.log(logo.getAttribute("src"));

// -- Classes
logo.classList.add("c", "j");
logo.classList.toggle("c");
logo.classList.remove("c");
console.log(logo.classList.contains("c"));

// Don't use: Because this will overeide all the existing classes
// logo.className = "Diab";

// -- Types of events and events handlers
// const h1 = document.querySelector("h1");
// h1.addEventListener("mouseenter", function () {});
// h1.removeEventListener("mouseenter", function () {});
// h1.onmouseenter = function () {};

// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

console.log("Random Color:", randomColor());

// -- DOM Traversing
// - Going downwards: Child
const h1 = document.querySelector("h1");
console.log(h1.querySelectorAll(".highlight"));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "black";
// - Going upwards: Parents
console.log(h1.parentNode);
console.log(h1.parentElement);
// h1.closest(".header").style.background = "var(--gradient-secondary)";
// - Going sideways: Siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// FOR FUN :)
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  // if (el !== h1) el.style.textTransform = "capitalize";
});

//  The Intersection Observer API
const obsCallback = function (entries, observer) {
  entries.forEach((entry) => {
    // console.log(entry);
  });
};

const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
