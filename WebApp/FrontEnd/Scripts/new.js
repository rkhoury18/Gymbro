const url_save = "/history/save"

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

      newWeight.id = "weights_c" + String(num_exercises);
      newReps.id = "reps_c" + String(num_exercises);
      newSets.id = "sets_c" + String(num_exercises);
      newRest.id = "rest_c" + String(num_exercises);

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

        weight_c = document.getElementById("weights_c" + String(row_num))
        reps_c = document.getElementById("reps_c" + String(row_num))
        sets_c = document.getElementById("sets_c" + String(row_num))
        rest_c = document.getElementById("rest_c" + String(row_num))
        
        removal(weights);
        removal(reps);
        removal(sets);
        removal(rest);
        removal(deletes);
        removal(weight_c);
        removal(reps_c);
        removal(sets_c);
        removal(rest_c);
    
        for (let i = row_num + 1; i <= num_exercises; i+=1){
            weights = document.getElementById("weights" + String(i))
            reps = document.getElementById("reps" + String(i))
            sets = document.getElementById("sets" + String(i))
            rest = document.getElementById("rest" + String(i))
            deletes = document.getElementById("delete" + String(i))
            weight_c = document.getElementById("weights_c" + String(i))
            reps_c = document.getElementById("reps_c" + String(i))
            sets_c = document.getElementById("sets_c" + String(i))
            rest_c = document.getElementById("rest_c" + String(i))
    
            weights.id = "weights" + String(i - 1)
            reps.id = "reps" + String(i - 1)
            sets.id = "sets" + String(i - 1)
            rest.id = "rest" + String(i - 1)
            deletes.id = "delete" + String(i - 1)
            weight_c.id = "weights_c" + String(i - 1)
            reps_c.id = "reps_c" + String(i - 1)
            sets_c.id = "sets_c" + String(i - 1)
            rest_c.id = "rest_c" + String(i - 1)

            weight_c.style.top = String(15 + 10*(i - 2)) + "%"; //TODO: Make this not hardcoded
            reps_c.style.top = String(15 + 10*(i - 2)) + "%"; //TODO: Make this not hardcoded
            sets_c.style.top = String(15 + 10*(i - 2)) + "%"; //TODO: Make this not hardcoded
            rest_c.style.top = String(15 + 10*(i - 2)) + "%"; //TODO: Make this not hardcoded
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
  var wrkt_name = "Push"
  let wrkt = {[wrkt_name]:[]}
  save.addEventListener("click", function() {
    var exercises = ["p_bench_press", "p_overhead_press", "p_squat", "p_deadlift", "p_hip_thrust", "p_barbell_row"]
    for (let i = 1; i <= num_exercises ; i+=1){
      console.log("Exercise " + String(i))
      //send data to server (exercise, weight, reps, sets, rest)
      weight_element = document.getElementById("weights" + String(i));
      reps_element = document.getElementById("reps" + String(i));
      sets_element= document.getElementById("sets" + String(i));
      rest_element = document.getElementById("rest" + String(i));
      // consol
      //we need a workout name
      //get values for each of
      let ex = exercises[i-1]
      let w = weight_element.value
      let r = reps_element.value
      let s = sets_element.value
      let rst = rest_element.value
      var ex_obj = {weight:w,reps:r,sets:s,rest:rst}
      console.log(ex_obj)
      var final = {[ex]:ex_obj}
      wrkt[wrkt_name].push(final)
    }
    senddatajson(wrkt,url_save)
  })

  
};