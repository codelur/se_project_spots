const initialCards = [
  {
    name: "Desert Castle",
    link: "https://images.unsplash.com/photo-1725610588150-c4cd8b88affd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Milky Way",
    link: "https://images.unsplash.com/photo-1725615357444-6123528686cf?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "City Lights",
    link: "https://plus.unsplash.com/premium_photo-1724458589661-a2f42eb58aca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Beautiful Cliff",
    link: "https://images.unsplash.com/photo-1535479804851-93f60320e644?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "River Flow",
    link: "https://images.unsplash.com/photo-1543503484-ba590cb1f903?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Old Town Vernazza",
    link: "https://images.unsplash.com/photo-1641646936155-c703e5d84b99?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const cardTemplate = document.querySelector("#card__template").content;
const cardsList = document.querySelector(".cards__list");

for (let card of initialCards) {
  const cardNode = getCardElement(card);
  cardsList.prepend(cardNode);
}

function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImgElement = cardElement.querySelector(".card__image");
  cardImgElement.src = data.link;
  cardImgElement.alt = data.name;

  const cardTitleElement = cardElement.querySelector(
    ".card__content .card__title"
  );
  cardTitleElement.textContent = data.name;

  return cardElement;
}

const profileSectionElement = document.querySelector(".profile__column");

const profileNameElement =
  profileSectionElement.querySelector(".profile__name");
const profileJobElement = profileSectionElement.querySelector(
  ".profile__description"
);

const editProfileModal = document.querySelector("#edit-profile-modal");

const nameInput = editProfileModal.querySelector("#name");
const jobInput = editProfileModal.querySelector("#description");

function openEditProfileModal() {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  editProfileModal.classList.add("modal_opened");
}

function closeEditProfileModal() {
  editProfileModal.classList.remove("modal_opened");
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeEditProfileModal();
}

const editProfileButton = document.querySelector(".profile__edit-btn");
const closeEditProfileButton = document.querySelector(".modal__close-btn");
const submitProfileForm = document.forms["modal__form-edit-profile"];

editProfileButton.addEventListener("click", openEditProfileModal);
closeEditProfileButton.addEventListener("click", closeEditProfileModal);
//Add this eventListener to the form instead of the button
submitProfileForm.addEventListener("submit", handleProfileFormSubmit);
