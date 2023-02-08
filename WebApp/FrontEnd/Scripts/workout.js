async function rcvdatajson(url) {
  let response = await fetch(url);
  let data = response.json();
  return data;
}

function senddatajson(json,url){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  //data = {"record":"hello"}
  xhr.send((JSON.stringify(json)));
}

// function senddatastr(str,url){
//   let xhr = new XMLHttpRequest();
//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//   //data = JSON.stringify({"record":content})
//   xhr.send(str);
//   }  

function createWorkoutElement(i, workout_names){
    var delete_div = document.createElement("div");
    var newWorkout = document.createElement("button");
    var newStart = document.createElement("button");
    var newModify = document.createElement("button");
    var newDelete = document.createElement("button");
    var workout_text = document.createTextNode(workout_names[i].name);
    const start_text = document.createTextNode("Start");
    const modify_text = document.createTextNode("Modify");
    const delete_text = document.createTextNode("X")

    newWorkout.setAttribute("class", "push")
    newStart.setAttribute("class", "start1")
    newStart.setAttribute("onclick", "window.location.href='/start_workout'")
    newModify.setAttribute("class", "modify1")
    newDelete.setAttribute("class", "delete1")
    delete_div.setAttribute("class", "parent")

    newWorkout.id = "workout" + String(i + 1)
    newStart.id = "start" + String(i + 1)
    newModify.id = "modify" + String(i + 1)
    newDelete.id = "delete" + String(i + 1)
    delete_div.id =  "delete_d" + String(i + 1)

    newWorkout.style.top = String(40 + i*20) + "%";
    newStart.style.top = String(42.5 + i*20) + "%";
    newModify.style.top = String(42.5 + i*20) + "%";
    newDelete.style.top = String(42.5 + i*20) + "%";

    newWorkout.appendChild(workout_text);
    newStart.appendChild(start_text);
    newModify.appendChild(modify_text);
    newDelete.appendChild(delete_text);
    delete_div.appendChild(newDelete);
    document.body.appendChild(newWorkout);
    document.body.appendChild(newStart);
    document.body.appendChild(newModify);
    document.body.appendChild(delete_div);

    //Add listener for start button
    newStart.addEventListener("click", function() {
      console.log("start id:", newStart.id)
      workout_num = parseInt(newStart.id.slice(-1)) - 1;
      console.log(workout_num)
      var wrkt_name = workout_names[workout_num]
      console.log(wrkt_name)
      console.log("Start clicked")
      senddatajson(wrkt_name, "/client/workout/start")
    })
    //Add listeners for delete button
    newDelete.addEventListener("click", function() {
      workout_num = parseInt(newDelete.id.slice(-1)) - 1;
      workout = document.getElementById("workout" + String(workout_num))
      start = document.getElementById("start" + String(workout_num))
      modify = document.getElementById("modify" + String(workout_num))
      delete_b = document.getElementById("delete" + String(workout_num))
      delete_div = document.getElementById("delete_div" + String(workout_num))

      removal(workout);
      removal(start);
      removal(sets);
      removal(modify);
      removal(delete_b);
      removal(delete_div);
  
      for (let j = workout_num + 1; j <= workout_names.length; j+=1){
          workout = document.getElementById("workout" + String(j))
          start = document.getElementById("start" + String(j))
          modify = document.getElementById("modify" + String(j))
          delete_b = document.getElementById("delete" + String(j))
          delete_div = document.getElementById("delete_div" + String(j))
  
          workout.id = "workout" + String(j - 1)
          start.id = "start" + String(j - 1)
          modify.id = "modify" + String(j - 1)
          delete_b.id = "delete" + String(j - 1)
          delete_div.id = "delete_div" + String(j - 1)

          workout.style.top = String(40 + 20*(j - 2)) + "%"; //TODO: Make this not hardcoded
          start.style.top = String(42.5 + 20*(j - 2)) + "%"; //TODO: Make this not hardcoded
          modify.style.top = String(42.5 + 20*(j - 2)) + "%"; //TODO: Make this not hardcoded
          delete_b.style.top = String(42.5 + 20*(j - 2)) + "%"; //TODO: Make this not hardcoded
      }
      senddatajson(workout_names[workout_num], "/client/workout/delete")
      workout_names.splice(workout_num);

    }) //Closing delete listener
}



window.onload = function() {

  //Create objects for each workout
  workout_promise = rcvdatajson("/rcv/workout_names")
  // var workout_names = []
  workout_promise.then(value => {
    workout_names = value;
    // workout_names = await workout_promise
    // console.log(workout_names)
    // console.log(workout_names.length)
    for (let i = 0; i < workout_names.length; i++){
      //TODO: Change to functions
      createWorkoutElement(i, workout_names)
      
  } //Closing for loop
  }); //Closing of then

};
  
