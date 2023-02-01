window.onload = function() {document.getElementById("delete1").addEventListener("click", function() {
  var elementToDelete = document.getElementById("push");
  elementToDelete.parentNode.removeChild(elementToDelete);
});}