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
const closeEditProfileButton = document.querySelector(
  "#modal__edit-profile-close-btn"
);
const profileSubmitBtn = editProfileModal.querySelector(".modal__button");

//Add Card elements
const addCardModal = document.querySelector("#add-card-modal");
const closeAddCardButton = document.querySelector("#modal__add-card-close-btn");
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
const modalCancelDeleteBtn = document.querySelector(".modal__delete-close-btn");
const deleteModal = document.querySelector("#delete-modal");

//Preview Image elements
const previewImageModal = document.querySelector("#modal-preview-image");
const previewImage = previewImageModal.querySelector(".modal__preview-image");
const previewImageTitle = previewImageModal.querySelector(
  ".modal__preview-image-title"
);
const closepreviewImageButton = document.querySelector(
  "#modal__preview-image-close-btn"
);
const closeEditAvatarButton = document.querySelector(
  "#modal__edit-avatar-close-btn"
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

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(evt.submitter, true);
  api
    .editUserInfo({ name: nameInput.value, about: jobInput.value })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileJobElement.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(evt.submitter, false));
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(evt.submitter, true);
  api
    .addCard({
      name: newCardCaptionInput.value,
      link: newCardmageLinkInput.value,
    })
    .then((data) => {
      const cardNode = createCardElement(data);
      renderCard(cardNode);
      evt.target.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(addCardModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(evt.submitter, false));
}

function handleEditAvatarFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(evt.submitter, true);
  api
    .editAvatarInfo(profileAvatarInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(evt.submitter, false));
}

function handleDeleteSubmit(evt) {
  setButtonText(evt.submitter, true, "Delete", "Deleting...");
  api
    .removeCard(selectedCardId) // pass the ID the the api function
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => setButtonText(evt.submitter, true, "Delete", "Deleting..."));
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

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

closepreviewImageButton.addEventListener("click", () => {
  closeModal(previewImageModal);
});

closeEditAvatarButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

cancelDeleteBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});
modalCancelDeleteBtn.addEventListener("click", () => {
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
