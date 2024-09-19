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
const profileSectionElement = document.querySelector(".profile__column");
const profileNameElement =
  profileSectionElement.querySelector("#profile__name");
const profileJobElement = profileSectionElement.querySelector(
  "#profile__description"
);

//Edit Profile Elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const submitProfileForm = document.forms["modal__form-edit-profile"];
const nameInput = editProfileModal.querySelector("#name");
const jobInput = editProfileModal.querySelector("#description");
const editProfileButton = document.querySelector("#profile__edit-btn");
const closeEditProfileButton = document.querySelector(
  "#modal__edit-profile-close-btn"
);

//Add Card elements
const addCardModal = document.querySelector("#add-card-modal");
const closeAddCardButton = document.querySelector("#modal__add-card-close-btn");
const submitAddCardForm = document.forms["modal__form-add-card"];
const addCardButton = document.querySelector("#profile__add-card-btn");
const newCardmageLinkInput = addCardModal.querySelector("#image-link-input");
const newCardCaptionInput = addCardModal.querySelector("#caption-input");

const previewImageModal = document.querySelector("#modal-preview-image");
const closepreviewImageButton = document.querySelector(
  "#modal__preview-image-close-btn"
);

initialCards.forEach(function (card) {
  const cardNode = createCardElement(card.link, card.name);
  cardsList.prepend(cardNode);
});

function createCardElement(link, name) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  const cardImgElement = cardElement.querySelector(".card__image");
  cardImgElement.addEventListener("click", () => {
    const previewImage = previewImageModal.querySelector(
      ".modal__preview-image"
    );
    previewImage.src = link;
    previewImage.alt = name;

    const previewImageTitle = previewImageModal.querySelector(
      ".modal__preview-image-title"
    );
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
    cardLikeButton.classList.add("card__like-button-liked");
  });
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", () => {
    cardDeleteButton.closest(".card").remove();
  });
  cardTitleElement.textContent = name;

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
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
  cardsList.prepend(cardNode);
  newCardmageLinkInput.value = "";
  newCardCaptionInput.value = "";
  closeModal(addCardModal);
}

editProfileButton.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent.trim();
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
