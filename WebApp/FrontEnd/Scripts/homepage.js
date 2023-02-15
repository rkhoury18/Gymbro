async function rcvdatajson(url) {
  let response = await fetch(url);
  let data = response.json();
  return data;
}

window.onload = function() {
  user_promise = rcvdatajson("/rcv/user");
  user_promise.then(user => {
    console.log(user)
    //user-name should be on top right of page i am noob :(
    document.getElementById("user-name").innerHTML = user.name.givenName + " " + user.name.familyName;
  }); 
}


let button = document.querySelector(".workout-button");
let item = document.querySelector(".workout-button .round");

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


let button_b = document.querySelector(".history-button");
let item_b = document.querySelector(".history-button .round");

button_b.addEventListener("mouseenter", function(event) {
  this.classList += " animate";

  let buttonX = event.offsetX;
  let buttonY = event.offsetY;

  if (buttonY < 24) {
    item_b.style.top = 0 + "px";
  } else if (buttonY > 30) {
    item_b.style.top = 48 + "px";
  }

  item_b.style.left = buttonX + "px";
  item_b.style.width = "1px";
  item_b.style.height = "1px";
});



button_b.addEventListener("mouseleave", function() {
  this.classList.remove("animate");

  let buttonX = event.offsetX;
  let buttonY = event.offsetY;

  if (buttonY < 24) {
    item_b.style.top = 0 + "px";
  } else if (buttonY > 30) {
    item_b.style.top = 48 + "px";
  }
  item_b.style.left = buttonX + "px";
});
