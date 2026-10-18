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

// Let each project card expand in place and announce whether its details are open.
projectCards.forEach((card) => {
  card.addEventListener("toggle", () => {
    const label = card.querySelector(".project-open-label");
    const icon = card.querySelector(".project-open span[aria-hidden]");
    label.textContent = card.open ? "Close project details" : "Open project details";
    icon.textContent = card.open ? "−" : "＋";
  });
});

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
  { src: "images/photo4.jpg", alt: "Three karate practitioners posing together outdoors at night", caption: "A night of focus, discipline, and good company." },
  { src: "images/photo5.jpg", alt: "Three karate practitioners standing together after training", caption: "Different belts, one dojo, one shared commitment." },
  { src: "images/photo6.jpg", alt: "Two martial artists facing each other on a training court", caption: "Face to face, focused, and ready to learn." },
  { src: "images/photo7.jpg", alt: "A karate practitioner practising a high kick with a partner", caption: "Timing, balance, and control in motion." },
  { src: "images/photo8.jpg", alt: "A smiling karate practitioner celebrating with a seated teammate", caption: "A little celebration after putting in the work." },
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
const emailDraftLink = document.querySelector("#email-draft-link");
const contactEmail = "liljuiceee734@gmail.com";
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
  const topic = document.querySelector("#topic").value;
  const subject = `Website contact: ${topic}`;
  const body = `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`;
  emailDraftLink.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formFeedback.textContent = "Your details were validated. Review the preview, then open the email draft below.";
  messagePreview.hidden = false;
});
