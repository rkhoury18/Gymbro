let button = document.querySelector(".login-button");
let item = document.querySelector(".login-button .round");

button.addEventListener("mouseenter", function(event) {
  this.classList += " animate";

  let buttonX = event.offsetX;
  let buttonY = event.offsetY;

  if (buttonY < 24) {
    item.style.top = 0 + "px";
  } else if (buttonY > 30) {
    item.style.top = 48 + "px";
  }

  item.style.left = buttonX + "px";
  item.style.width = "1px";
  item.style.height = "1px";
});

button.addEventListener("mouseleave", function() {
  this.classList.remove("animate");

  let buttonX = event.offsetX;
  let buttonY = event.offsetY;

  if (buttonY < 24) {
    item.style.top = 0 + "px";
  } else if (buttonY > 30) {
    item.style.top = 48 + "px";
  }
  item.style.left = buttonX + "px";
});




