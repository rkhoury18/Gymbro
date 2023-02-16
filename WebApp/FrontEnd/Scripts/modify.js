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

function createDropdown(num_exercises, value) {
  var newDiv = document.createElement("div")
  var newDrop = document.createElement("select")
  newDrop.setAttribute("class", "dropdown")

  var bench = document.createElement("option")
  var overhead = document.createElement("option")
  var squat = document.createElement("option")
  var deadlift = document.createElement("option")
  var row = document.createElement("option")
  var hip = document.createElement("option")

  document.createtextn
  var bench_text = document.createTextNode("Bench Press")
  var overhead_text = document.createTextNode("Overhead Press")
  var squat_text = document.createTextNode("Squat")
  var deadlift_text = document.createTextNode("Deadlift")
  var row_text = document.createTextNode("Barbell Row")
  var hip_text = document.createTextNode("Hip Thrust")

  bench.value = "p_bench_press"
  overhead.value = "p_overhead_press"
  squat.value = "p_squat"
  deadlift.value = "p_dealift"
  row.value = "p_barbell_row"
  hip.value = "p_hip_thrust"

  bench.appendChild(bench_text)
  overhead.appendChild(overhead_text)
  squat.appendChild(squat_text)
  deadlift.appendChild(deadlift_text)
  row.appendChild(row_text)
  hip.appendChild(hip_text)

  
  newDrop.appendChild(bench)
  newDrop.appendChild(overhead)
  newDrop.appendChild(squat)
  newDrop.appendChild(deadlift)
  newDrop.appendChild(row)
  newDrop.appendChild(hip)
  newDrop.value = value
  newDrop.style.top = String(25 + 12*(num_exercises - 1)) + "%"; 
  newDrop.id = "dropdown" + String(num_exercises);
  // newDiv.appendChild(newDrop)
  document.body.appendChild(newDrop)


  newDrop.addEventListener("change", function() {
    const selectedOption = dropdown.value;
  });
}

//Rhea trying

function createExercise(i, workout) {
  var keys = Object.keys(workout)
  ex_obj = workout[keys[i]]
  name_text = document.createTextNode(parse_str(keys[i]))
  w_div =  document.createElement("div")
  r_div = document.createElement("div")
  s_div = document.createElement("div")
  rst_div = document.createElement("div")
  w = document.createElement("input")
  r = document.createElement("input")
  s = document.createElement("input")
  rst = document.createElement("input")
  createDropdown(i, keys[i])
  
  w.value = ex_obj.weight
  r.value = ex_obj.reps
  s.value = ex_obj.sets
  rst.value = ex_obj.rest

   
  name_button.setAttribute("class", "New_exercise")
  
  w_div.setAttribute("class", "input_container1")
  r_div.setAttribute("class", "input_container2")
  s_div.setAttribute("class", "input_container3")
  rst_div.setAttribute("class", "input_container4")
  
  name_button.style.top = String(5 + 25*i) + "%"
  w_div.style.top = String(13 + 25*i) + "%"
  r_div.style.top  = String(13 + 25*i) + "%"
  s_div.style.top  = String(13 + 25*i) + "%"
  rst_div.style.top  = String(13 + 25*i) + "%"
  drop.style.top = String(25 + 12*(i - 2)) + "%";

  w.id = "weight" + String(i)
  r.id = "reps" + String(i)
  s.id = "sets" + String(i)
  rst.id = "rest" + String(i)
  w_div.id = "weight_div" + String(i)
  r_div.id = "reps_div" + String(i)
  s_div.id = "sets_div" + String(i)
  rst_div.id = "rest_div" + String(i)
  drop.id = "dropdown" + String(i)



  w_div.appendChild(w)
  r_div.appendChild(r)
  s_div.appendChild(s)
  rst_div.appendChild(rst)

  document.body.appendChild(w_div)
  document.body.appendChild(r_div)
  document.body.appendChild(s_div)
  document.body.appendChild(rst_div)
  
}

//End of Rhea trying


var num_exercises = 1
window.onload = function() {
  //Create the exercises and fill values
  var finish = document.getElementById("finish")
  workout_promise = rcvdatajson("/rcv/workout")
  workout_promise.then(async value => {
      workout = value
      console.log(workout)
      num_exercises = Object.size(workout)
      play = document.getElementById("play")
      finish = document.getElementById("finish")
      finish.style.top = String(25*num_exercises) + "%"
      ex_counter = 0
      
      for (let i = 0; i < num_exercises; i++){
          createExercise(i, workout)
      }
    })

  var add = document.getElementById("Add");
  var save = document.getElementById("Save")
  var name = document.getElementById("name");

  add.addEventListener("click", function() {
      num_exercises += 1;
      var newWeight = document.createElement("div");      
      var newReps = document.createElement("div");      
      var newSets = document.createElement("div");
      var newRest = document.createElement("div");
      var newDelete = document.createElement("div");
      createDropdown(num_exercises, "p_bench_press");

      var weightsIn = document.createElement("input");
      var repsIn = document.createElement("input");
      var setsIn = document.createElement("input");
      var restIn = document.createElement("input");
      var deleteIn = document.createElement("button");
      var newExercise = document.createElement("button")
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
      newExercise.setAttribute("class", "New_exercise")


      newWeight.id = "weights_c" + String(num_exercises);
      newReps.id = "reps_c" + String(num_exercises);
      newSets.id = "sets_c" + String(num_exercises);
      newRest.id = "rest_c" + String(num_exercises);
      newExercise.id = "new_exercise" + String(num_exercises)

      weightsIn.id = "weights" + String(num_exercises);
      repsIn.id = "reps" + String(num_exercises);
      setsIn.id = "sets" + String(num_exercises);
      restIn.id = "rest" + String(num_exercises);
      deleteIn.id = "delete" + String(num_exercises)

      newWeight.style.top = String(25 + 12*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      newReps.style.top = String(25 + 12*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      newSets.style.top = String(25 + 12*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      newRest.style.top = String(25 + 12*(num_exercises - 1)) + "%"; //TODO: Make this not hardcoded
      deleteIn.style.top = String(23 + 12*(num_exercises - 1)) + "%";
      newExercise.style.top = String(23 + 12*(num_exercises - 1)) + "%";
      
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
      document.body.appendChild(newExercise);

      //Listen to delete and delete accordingly
      deleteIn.addEventListener("click", function() {
        row_num = parseInt(deleteIn.id.slice(-1));
        console.log(row_num)
        weights = document.getElementById("weights" + String(row_num))
        reps = document.getElementById("reps" + String(row_num))
        sets = document.getElementById("sets" + String(row_num))
        rest = document.getElementById("rest" + String(row_num))
        new_ex = document.getElementById("new_exercise" + String(row_num))
        deletes = document.getElementById("delete" + String(row_num))
        drop = document.getElementById("dropdown" + String(row_num))


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
        removal(drop);
        removal(new_ex)
    
        for (let i = row_num + 1; i <= num_exercises; i+=1){
            weights = document.getElementById("weights" + String(i))
            reps = document.getElementById("reps" + String(i))
            sets = document.getElementById("sets" + String(i))
            rest = document.getElementById("rest" + String(i))
            deletes = document.getElementById("delete" + String(i))
            drop = document.getElementById("dropdown" + String(i))
            weight_c = document.getElementById("weights_c" + String(i))
            reps_c = document.getElementById("reps_c" + String(i))
            sets_c = document.getElementById("sets_c" + String(i))
            rest_c = document.getElementById("rest_c" + String(i))
            new_ex = document.getElementById("new_exercise" + String(i))
    
            weights.id = "weights" + String(i - 1)
            reps.id = "reps" + String(i - 1)
            sets.id = "sets" + String(i - 1)
            rest.id = "rest" + String(i - 1)
            deletes.id = "delete" + String(i - 1)
            weight_c.id = "weights_c" + String(i - 1)
            reps_c.id = "reps_c" + String(i - 1)
            sets_c.id = "sets_c" + String(i - 1)
            rest_c.id = "rest_c" + String(i - 1)
            drop.id = "dropdown" + String(i - 1)
            new_ex.id = "new_exercise" + + String(i - 1)

            weight_c.style.top = String(25 + 12*(i - 2)) + "%"; //TODO: Make this not hardcoded
            reps_c.style.top = String(25 + 12*(i - 2)) + "%"; //TODO: Make this not hardcoded
            sets_c.style.top = String(25 + 12*(i - 2)) + "%"; //TODO: Make this not hardcoded
            rest_c.style.top = String(25 + 12*(i - 2)) + "%"; //TODO: Make this not hardcoded
            deletes.style.top = String(23 + 12*(i - 2)) + "%";
            drop.style.top = String(25 + 12*(i - 2)) + "%";
            new_ex.style.top = String(23 + 12*(i - 2)) + "%";

        }
        num_exercises -= 1;
        add.style.top = String(34 + 12*(num_exercises - 1)) + "%";
        save.style.top = String(35 + 12*(num_exercises - 1)) + "%";
      })

      add.style.top = String(34 + 12*(num_exercises - 1)) + "%";
      save.style.top = String(35 + 12*(num_exercises - 1)) + "%";
      
  })
  
  
  save.addEventListener("click", function() {
    let wrkt = {}
    var exercises = ["p_bench_press", "p_overhead_press", "p_squat", "p_deadlift", "p_hip_thrust", "p_barbell_row"] //TODO: Add exercises selection
    var wrkt_name = name.value
    wrkt = {name:wrkt_name}
    for (let i = 1; i <= num_exercises ; i+=1){
      console.log("Exercise " + String(i))
      //send data to server (exercise, weight, reps, sets, rest)
      weight_element = document.getElementById("weights" + String(i));
      reps_element = document.getElementById("reps" + String(i));
      sets_element= document.getElementById("sets" + String(i));
      rest_element = document.getElementById("rest" + String(i));
      drop_element = document.getElementById("dropdown" + String(i));
      // consol
      //we need a workout name
      //get values for each of
      let ex = drop_element.value
      let w = weight_element.value
      let r = reps_element.value
      let s = sets_element.value
      let rst = rest_element.value
      var ex_obj = {name:ex,weight:w,reps:r,sets:s,rest:rst}
      wrkt["exec"+String(i)] = ex_obj
    }
    senddatajson(wrkt,url_save)
  })

  
};