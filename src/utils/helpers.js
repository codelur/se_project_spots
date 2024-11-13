export function setButtonText(
  bttn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) bttn.textContent = loadingText;
  else bttn.textContent = defaultText;
}
