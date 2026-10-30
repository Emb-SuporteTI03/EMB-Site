export const disableAupAdownInput = (inputID) => {
  document.getElementById(inputID).addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
    }
  });
}