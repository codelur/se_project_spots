export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) btn.textContent = loadingText;
  else btn.textContent = defaultText;
}
