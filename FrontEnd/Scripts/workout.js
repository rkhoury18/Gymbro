window.onload = function() {
  var push = document.getElementById("push");
  var pull = document.getElementById("pull");
  var legs = document.getElementById("legs");
  var start1 = document.getElementById("start1");
  var start2 = document.getElementById("start2");
  var start3 = document.getElementById("start3");
  var modify1 = document.getElementById("modify1");
  var modify2 = document.getElementById("modify2");
  var modify3 = document.getElementById("modify3");
  var delete1 = document.getElementById("delete1");
  var delete2 = document.getElementById("delete2");
  var delete3 = document.getElementById("delete3");
  

  let workouts = [push, pull, legs];
  let starts = [start1, start2, start3];
  let modify = [modify1, modify2, modify3];
  let deletes = [delete1, delete2, delete3];

  
  for (let i = 0; i < workouts.length; i++){
    deletes[i].addEventListener("click", function() {
      workouts[i].parentNode.removeChild(workouts[i]);
      starts[i].parentNode.removeChild(starts[i]);
      modify[i].parentNode.removeChild(modify[i]);
      deletes[i].parentNode.removeChild(deletes[i]);
    });
    
  }


};
  
