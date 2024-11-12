import "./index.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
  enableButton,
} from "../scripts/validation.js";

const profileAvatar = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1f3d47ec-48a6-48e0-95f2-0844dd9a33b4",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach(function (card) {
      const cardNode = createCardElement(card.link, card.name);
      renderCard(cardNode);
    });
    profileAvatar.src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch(console.error);

const cardTemplate = document.querySelector("#card__template").content;
const cardsList = document.querySelector(".cards__list");
const profileSectionElement = document.querySelector(".profile__column");
const profileNameElement =
  profileSectionElement.querySelector("#profile__name");
const profileJobElement = profileSectionElement.querySelector(
  "#profile__description"
);
const modals = Array.from(document.querySelectorAll(".modal"));

//Edit Profile Elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const submitProfileForm = document.forms["modal__form-edit-profile"];
const nameInput = editProfileModal.querySelector("#name");
const jobInput = editProfileModal.querySelector("#description");
const editProfileButton = document.querySelector("#profile__edit-btn");
const closeEditProfileButton = document.querySelector(
  "#modal__edit-profile-close-btn"
);
const profileSubmitBtn = editProfileModal.querySelector(".modal__button");

//Add Card elements
const addCardModal = document.querySelector("#add-card-modal");
const closeAddCardButton = document.querySelector("#modal__add-card-close-btn");
const submitAddCardForm = document.forms["modal__form-add-card"];
const addCardButton = document.querySelector("#profile__add-card-btn");
const newCardmageLinkInput = addCardModal.querySelector("#image-link-input");
const newCardCaptionInput = addCardModal.querySelector("#caption-input");
const cardSubmitBtn = addCardModal.querySelector(".modal__button");

const previewImageModal = document.querySelector("#modal-preview-image");
const previewImage = previewImageModal.querySelector(".modal__preview-image");
const previewImageTitle = previewImageModal.querySelector(
  ".modal__preview-image-title"
);
const closepreviewImageButton = document.querySelector(
  "#modal__preview-image-close-btn"
);

function renderCard(cardNode, method = "prepend") {
  cardsList[method](cardNode);
}

function createCardElement(link, name) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImgElement = cardElement.querySelector(".card__image");
  cardImgElement.addEventListener("click", () => {
    previewImage.src = link;
    previewImage.alt = name;

    previewImageTitle.textContent = name;
    openModal(previewImageModal);
  });

  cardImgElement.src = link;
  cardImgElement.alt = name;

  const cardTitleElement = cardElement.querySelector(
    ".card__content .card__title"
  );

  const cardLikeButton = cardElement.querySelector(".card__like-button");
  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button-liked");
  });
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });
  cardTitleElement.textContent = name;

  return cardElement;
}

const escapeModal = (evt) => {
  if (evt.key === "Escape") {
    modals.forEach((modal) => {
      if (modal.classList.contains("modal_opened")) closeModal(modal);
    });
  }
};

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", escapeModal);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", escapeModal);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeModal(editProfileModal);
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  const cardNode = createCardElement(
    newCardmageLinkInput.value,
    newCardCaptionInput.value
  );

  renderCard(cardNode);
  evt.target.reset();
  disableButton(cardSubmitBtn, settings);
  closeModal(addCardModal);
}

editProfileButton.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent.trim();
  resetValidation(submitProfileForm, [nameInput, jobInput]);
  enableButton(profileSubmitBtn, settings);
  openModal(editProfileModal);
});

addCardButton.addEventListener("click", () => {
  openModal(addCardModal);
});

closeEditProfileButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});
closeAddCardButton.addEventListener("click", () => {
  closeModal(addCardModal);
});

closepreviewImageButton.addEventListener("click", () => {
  closeModal(previewImageModal);
});
//Add this eventListener to the form instead of the button
submitProfileForm.addEventListener("submit", handleProfileFormSubmit);
submitAddCardForm.addEventListener("submit", handleAddCardFormSubmit);

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) closeModal(evt.target);
  });
});

enableValidation(settings);
