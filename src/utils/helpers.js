export function setButtonText(
  bttn,
  isLoading,
  initialText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) bttn.textContent = loadingText;
  else bttn.textContent = initialText;
}
