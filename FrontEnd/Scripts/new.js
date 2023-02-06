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

function removal(element){
  element.parentNode.removeChild(element);
}

function senddatajson(json,url){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  //data = {"record":"hello"}
  xhr.send((JSON.stringify(json)));
}

function senddatastr(str,url){
let xhr = new XMLHttpRequest();
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//data = JSON.stringify({"record":content})
xhr.send(str);
}



var num_exercises = 1
window.onload = function() {

  var add = document.getElementById("Add");
  add.addEventListener("click", function() {
      num_exercises += 1;
      var newWeight = document.createElement("div");      
      var newReps = document.createElement("div");      
      var newSets = document.createElement("div");
      var newRest = document.createElement("div");
      var newDelete = document.createElement("div");
      
      var weightsIn = document.createElement("input");
      var repsIn = document.createElement("input");
      var setsIn = document.createElement("input");
      var restIn = document.createElement("input");
      var deleteIn = document.createElement("button");
      const delete_text = document.createTextNode("-");

      newWeight.setAttribute("class", "input_container1");
      weightsIn.setAttribute("type", "text");
      newReps.setAttribute("class", "input_container2");
      repsIn.setAttribute("type", "text");
      newSets.setAttribute("class", "input_container3");
      setsIn.setAttribute("type", "text");
      newRest.setAttribute("class", "input_container4");
      restIn.setAttribute("type", "text");
      newDelete.setAttribute("class", "parent");
      deleteIn.setAttribute("class", "delete1");

      weightsIn.id = "weights" + String(num_exercises);
      repsIn.id = "reps" + String(num_exercises);
      setsIn.id = "sets" + String(num_exercises);
      restIn.id = "rest" + String(num_exercises);
      deleteIn.id = "delete" + String(num_exercises)

      newWeight.style.top = String(15 + 10*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      newReps.style.top = String(15 + 10*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      newSets.style.top = String(15 + 10*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      newRest.style.top = String(15 + 10*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      deleteIn.style.top = String(15 + 10*(num_exercises - 1)) + "%";
      
      newWeight.appendChild(weightsIn);
      document.body.appendChild(newWeight);
      newReps.appendChild(repsIn);
      document.body.appendChild(newReps);
      newSets.appendChild(setsIn);
      document.body.appendChild(newSets);
      newRest.appendChild(restIn);
      document.body.appendChild(newRest);
      deleteIn.appendChild(delete_text);
      newDelete.appendChild(deleteIn);
      document.body.appendChild(newDelete);

      //Listen to delete and delete accordingly
      deleteIn.addEventListener("click", function() {
        row_num = parseInt(deleteIn.id.slice(-1));
        weights = document.getElementById("weights" + String(row_num))
        reps = document.getElementById("reps" + String(row_num))
        sets = document.getElementById("sets" + String(row_num))
        rest = document.getElementById("rest" + String(row_num))
        deletes = document.getElementById("delete" + String(row_num))
        
        removal(weights);
        removal(reps);
        removal(sets);
        removal(rest);
        removal(deletes);
    
        for (let i = row_num + 1; i <= num_exercises; i+=1){
            weights = document.getElementById("weights" + String(i))
            reps = document.getElementById("reps" + String(i))
            sets = document.getElementById("sets" + String(i))
            rest = document.getElementById("rest" + String(i))
            deletes = document.getElementById("delete" + String(i))
    
            weights.id = "weights" + String(i - 1)
            reps.id = "reps" + String(i - 1)
            sets.id = "sets" + String(i - 1)
            rest.id = "rest" + String(i - 1)
            deletes.id = "delete" + String(i - 1)

            weights.style.top = String(15 + 10*(i - 2)) + "%"; //TODO: Make this not hardcoded
            reps.style.top = String(15 + 10*(i - 2)) + "%"; //TODO: Make this not hardcoded
            sets.style.top = String(15 + 10*(i - 2)) + "%"; //TODO: Make this not hardcoded
            rest.style.top = String(15 + 10*(i - 2)) + "%"; //TODO: Make this not hardcoded
            deletes.style.top = String(15 + 10*(i - 2)) + "%";
        }
        num_exercises -= 1;
        add.style.top = String(25 + 10*num_exercises - 1) + "%";
        save.style.top = String(35 + 10*num_exercises - 1) + "%";
      })

      add.style.top = String(25 + 10*num_exercises - 1) + "%";
      save.style.top = String(35 + 10*num_exercises - 1) + "%";
  })
  
  save = document.getElementById("Save")
  save.addEventListener("click", function() {
    for (let i = 1; i <= num_exercises ; i+=1){
      //send data to server (exercise, weight, reps, sets, rest)
      weights = document.getElementById("weights" + String(i));
      reps = document.getElementById("reps" + String(i));
      sets = document.getElementById("sets" + String(i));
      rest = document.getElementById("rest" + String(i));

    }


  })

  
};