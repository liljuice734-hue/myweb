"use strict";

// Switch the page theme and keep the button label in sync with the current state.
const themeButton = document.querySelector("#theme-toggle");
themeButton.addEventListener("click", () => {
  const isLight = document.documentElement.dataset.theme !== "light";
  document.documentElement.dataset.theme = isLight ? "light" : "dark";
  themeButton.textContent = isLight ? "Use dark theme" : "Use light theme";
  themeButton.setAttribute("aria-pressed", String(isLight));
});

// Filter the example cards by words in their skill tags or visible text.
const projectSearch = document.querySelector("#project-filter");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const filterStatus = document.querySelector("#filter-status");
const filterEmpty = document.querySelector("#filter-empty");

function filterProjects() {
  const query = projectSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const searchableText = `${card.dataset.skills} ${card.textContent}`.toLowerCase();
    const matches = searchableText.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  filterStatus.textContent = query
    ? `Showing ${visibleCount} of ${projectCards.length} examples for “${projectSearch.value.trim()}”.`
    : `Showing all ${projectCards.length} examples.`;
  filterEmpty.hidden = visibleCount !== 0;
}

projectSearch.addEventListener("input", filterProjects);
document.querySelector("#reset-filter").addEventListener("click", () => {
  projectSearch.value = "";
  filterProjects();
  projectSearch.focus();
});

// Move through the photo array and wrap cleanly at either end.
const photos = [
  { src: "images/photo1.jpg", alt: "William outdoors in a shaded setting", caption: "A quiet moment outdoors." },
  { src: "images/photo2.jpg", alt: "William in natural light", caption: "Hope, faith, and new beginnings." },
  { src: "images/photo3.jpg", alt: "William wearing a leather jacket over a red jersey", caption: "Personal style, same focus." },
];
let currentPhoto = 0;
const galleryImage = document.querySelector("#gallery-image");
const galleryCaption = document.querySelector("#gallery-caption");
const galleryStatus = document.querySelector("#gallery-status");

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const photo = photos[currentPhoto];
  galleryImage.src = photo.src;
  galleryImage.alt = photo.alt;
  galleryCaption.textContent = `${String(currentPhoto + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}  ${photo.caption}`;
  galleryStatus.textContent = `Photo ${currentPhoto + 1} of ${photos.length}`;
}

document.querySelector("#gallery-previous").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.querySelector("#gallery-next").addEventListener("click", () => showPhoto(currentPhoto + 1));

// Validate the required fields and show a safe, local preview without reloading.
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");
const messagePreview = document.querySelector("#message-preview");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(field, errorElement, message) {
  errorElement.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameField = document.querySelector("#name");
  const emailField = document.querySelector("#email");
  const messageField = document.querySelector("#message");
  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const message = messageField.value.trim();
  const errors = [
    name ? "" : "Enter your name; spaces alone are not enough.",
    emailPattern.test(email) ? "" : "Enter a valid email address, such as name@example.com.",
    message ? "" : "Enter a message; spaces alone are not enough.",
  ];

  setFieldError(nameField, document.querySelector("#name-error"), errors[0]);
  setFieldError(emailField, document.querySelector("#email-error"), errors[1]);
  setFieldError(messageField, document.querySelector("#message-error"), errors[2]);
  messagePreview.hidden = true;

  if (errors.some(Boolean)) {
    formFeedback.textContent = "Please correct the highlighted fields.";
    const firstInvalid = [nameField, emailField, messageField].find((field) => field.getAttribute("aria-invalid") === "true");
    firstInvalid.focus();
    return;
  }

  document.querySelector("#preview-name").textContent = name;
  document.querySelector("#preview-email").textContent = email;
  document.querySelector("#preview-topic").textContent = document.querySelector("#topic").value;
  document.querySelector("#preview-message").textContent = message;
  formFeedback.textContent = "Your details were validated in this browser. No message was sent.";
  messagePreview.hidden = false;
});
