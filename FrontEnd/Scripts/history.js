const openPopupButton = document.getElementById("open-popup-button");
const popupContainer = document.getElementById("popup-container");
const closePopupButton = document.getElementById("close-popup-button");


window.onload = function() {
    const popupContainer = document.getElementById("popup-container");
    popupContainer.style.display = "none";
};

openPopupButton.addEventListener("click", function() {
popupContainer.style.display = "flex";
});

closePopupButton.addEventListener("click", function() {
popupContainer.style.display = "none";
});
