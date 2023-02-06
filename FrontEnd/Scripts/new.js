function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
}




var num_exercises = 1
window.onload = function() {
  
  deleteIn.addEventListener("click", function() {
    row_num = deleteIn.id.slice(-1); 
    for (let i = row_num; i < num_exercises ; i+=1){
        weights = document.getElementById("weights" + String(i))
        reps = document.getElementById("reps" + String(i))
        sets = document.getElementById("sets" + String(i))
        rest = document.getElementById("rest" + String(i))
        deletes = document.getElementById("deletes" + String(i))

        weights_next =  

      }
  })

  var add = document.getElementById("Add");
  add.addEventListener("click", function() {
      num_exercises += 1;
      var newWeight = document.createElement("div");      
      var newReps = document.createElement("div");      
      var newSets = document.createElement("div");
      var newRest = document.createElement("div");
      var weightsIn = document.createElement("input");
      var repsIn = document.createElement("input");
      var setsIn = document.createElement("input");
      var restIn = document.createElement("input");

      newWeight.setAttribute("class", "input_container1");
      weightsIn.setAttribute("type", "text");
      newReps.setAttribute("class", "input_container2");
      repsIn.setAttribute("type", "text");
      newSets.setAttribute("class", "input_container3");
      setsIn.setAttribute("type", "text");
      newRest.setAttribute("class", "input_container4");
      restIn.setAttribute("type", "text");

      weightsIn.id = "weights" + String(num_exercises );
      repsIn.id = "reps" + String(num_exercises );
      setsIn.id = "sets" + String(num_exercises );
      restIn.id = "rest" + String(num_exercises );

      newWeight.style.top = String(15 + 10*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      newReps.style.top = String(15 + 10*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      newSets.style.top = String(15 + 10*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      newRest.style.top = String(15 + 10*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      
      newWeight.appendChild(weightsIn);
      document.body.appendChild(newWeight);
      newReps.appendChild(repsIn);
      document.body.appendChild(newReps);
      newSets.appendChild(setsIn);
      document.body.appendChild(newSets);
      newRest.appendChild(restIn);
      document.body.appendChild(newRest);

      add.style.top = String(25 + 10*num_exercises - 1) + "%";
      save.style.top = String(35 + 10*num_exercises - 1) + "%";
  })
  
  save = document.getElementById("Save")
  save.addEventListener("click", function() {
    for (let i = 1; i < num_exercises ; i+=1){
      //send data to server (name of workout, exercise, weight, reps, sets, rest)
      weights = document.getElementById("weights" + String(i));
      reps = document.getElementById("reps" + String(i));
      sets = document.getElementById("sets" + String(i));
      rest = document.getElementById("rest" + String(i));


    }


  })

  
};