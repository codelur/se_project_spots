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

const profileSectionElement = document.querySelector(".profile__column");

const profileNameElement =
  profileSectionElement.querySelector(".profile__name");
const profileJobElement = profileSectionElement.querySelector(
  ".profile__description"
);

const profileFormElement = document.querySelector("#edit-profile-modal");

const nameInput = profileFormElement.querySelector("#name");
const jobInput = profileFormElement.querySelector("#description");

function openEditProfileModal() {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
  editProfileModal.classList.add("modal__opened");
}

function closeEditProfileModal() {
  editProfileModal.classList.remove("modal__opened");
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileJobElement.textContent = jobInput.value;
  closeEditProfileModal();
}

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileButton = document.querySelector(".profile__edit-btn");
const closeEditProfileButton = document.querySelector(".modal__close-btn");
const submitProfileForm = profileFormElement.querySelector(
  "#modal__form-edit-profile"
);

editProfileButton.addEventListener("click", openEditProfileModal);
closeEditProfileButton.addEventListener("click", closeEditProfileModal);
//Add this eventListener to the form instead of the button
submitProfileForm.addEventListener("submit", handleProfileFormSubmit);
