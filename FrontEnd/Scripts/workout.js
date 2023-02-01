window.onload = function() {
  const popupContainer = document.getElementById("popup-container");
  popupContainer.style.display = "none";
  document.getElementById("delete1").addEventListener("click", function() {
  var elementToDelete = document.getElementById("push");
  elementToDelete.parentNode.removeChild(elementToDelete);

});}
