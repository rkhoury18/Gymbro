const benchButton = document.getElementById("bench");
const overheadButton = document.getElementById("overhead");
const squatButton = document.getElementById("squat");
const deadliftButton = document.getElementById("deadlift");
const rowButton = document.getElementById("row");
const latButton = document.getElementById("lat");
const popupContainer = document.getElementById("popup-container");
const closePopupButton = document.getElementById("close-popup-button");


window.onload = function() {
    const popupContainer = document.getElementById("popup-container");
    popupContainer.style.display = "none";
};

benchButton.addEventListener("click", function() {
popupContainer.style.display = "flex";
});

closePopupButton.addEventListener("click", function() {
popupContainer.style.display = "none";
});
