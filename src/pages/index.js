import "./index.css";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
  enableButton,
} from "../scripts/validation.js";

let selectedCard;
let selectedCardId;

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
      const cardNode = createCardElement(card);
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

//Modals

//Edit Profile Elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const submitProfileForm = document.forms["modal__form-edit-profile"];
const nameInput = editProfileModal.querySelector("#name");
const jobInput = editProfileModal.querySelector("#description");
const editProfileButton = document.querySelector("#profile__edit-btn");
const profileSubmitBtn = editProfileModal.querySelector(".modal__button");

//Add Card elements
const addCardModal = document.querySelector("#add-card-modal");
const submitAddCardForm = document.forms["modal__form-add-card"];
const submitEditAvatarForm = document.forms["edit-avatar-form"];

const addCardButton = document.querySelector("#profile__add-card-btn");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#edit-avatar-modal");

const newCardmageLinkInput = addCardModal.querySelector("#image-link-input");
const newCardCaptionInput = addCardModal.querySelector("#caption-input");
const cardSubmitBtn = addCardModal.querySelector(".modal__button");
const profileAvatarInput = submitEditAvatarForm.querySelector(
  "#profile-avatar-input"
);

//Delete card Elements
const deleteCardForm = document.forms["delete-form"];
const cancelDeleteBtn = deleteCardForm.querySelector(".modal__button-cancel");
const deleteModal = document.querySelector("#delete-modal");

//Preview Image elements
const previewImageModal = document.querySelector("#modal-preview-image");
const previewImage = previewImageModal.querySelector(".modal__preview-image");
const previewImageTitle = previewImageModal.querySelector(
  ".modal__preview-image-title"
);

function renderCard(cardNode, method = "prepend") {
  cardsList[method](cardNode);
}

function handleDeleteCard(cardElement, id) {
  selectedCard = cardElement;
  selectedCardId = id;
}

function createCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImgElement = cardElement.querySelector(".card__image");
  cardImgElement.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;

    previewImageTitle.textContent = data.name;
    openModal(previewImageModal);
  });

  cardImgElement.src = data.link;
  cardImgElement.alt = data.name;
  cardImgElement.id = data._id;

  const cardTitleElement = cardElement.querySelector(
    ".card__content .card__title"
  );

  const cardLikeButton = cardElement.querySelector(".card__like-button");
  if (data.isLiked) cardLikeButton.classList.add("card__like-button-liked");
  cardLikeButton.addEventListener("click", () => {
    const isCardLiked = cardLikeButton.classList.contains(
      "card__like-button-liked"
    );
    api
      .toggleLikeCard(data._id, isCardLiked)
      .then(() => {
        cardLikeButton.classList.toggle("card__like-button-liked");
      })
      .catch(console.error);
  });
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
    openModal(deleteModal);
  });
  cardTitleElement.textContent = data.name;

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

function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  setButtonText(submitButton, true, initialText, loadingText);
  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, initialText);
    });
}

function handleProfileFormSubmit(evt) {
  async function makeRequest() {
    const data = await api.editUserInfo({
      name: nameInput.value,
      about: jobInput.value,
    });
    profileNameElement.textContent = data.name;
    profileJobElement.textContent = data.about;
    closeModal(editProfileModal);
  }
  handleSubmit(makeRequest, evt);
}

function handleAddCardFormSubmit(evt) {
  async function makeRequest() {
    const data = await api.addCard({
      name: newCardCaptionInput.value,
      link: newCardmageLinkInput.value,
    });
    const cardNode = createCardElement(data);
    renderCard(cardNode);
    evt.target.reset();
    disableButton(cardSubmitBtn, settings);
    closeModal(addCardModal);
  }
  handleSubmit(makeRequest, evt);
}

function handleEditAvatarFormSubmit(evt) {
  async function makeRequest() {
    const data = await api.editAvatarInfo(profileAvatarInput.value);
    profileAvatar.src = data.avatar;
    closeModal(avatarModal);
  }
  handleSubmit(makeRequest, evt);
}

function handleDeleteSubmit(evt) {
  async function makeRequest() {
    await api.removeCard(selectedCardId); // pass the ID the the api function
    selectedCard.remove();
    closeModal(deleteModal);
  }
  handleSubmit(makeRequest, evt, "Deleting...");
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

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

const closeButtons = document.querySelectorAll(".modal__close-btn");
closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

//Add this eventListener to the form instead of the button
submitProfileForm.addEventListener("submit", handleProfileFormSubmit);
submitAddCardForm.addEventListener("submit", handleAddCardFormSubmit);
submitEditAvatarForm.addEventListener("submit", handleEditAvatarFormSubmit);
deleteCardForm.addEventListener("submit", handleDeleteSubmit);

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("modal_opened")) closeModal(evt.target);
  });
});

enableValidation(settings);
