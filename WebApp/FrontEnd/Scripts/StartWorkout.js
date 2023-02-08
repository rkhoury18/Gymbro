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

Object.size = function(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

function createExercise(i, workout) {
    ex_obj = workout["exec" + String(i + 1)]
            
    name_button = document.createElement("button");
    name_text = document.createTextNode(ex_obj.name)
    w_div =  document.createElement("div")
    r_div = document.createElement("div")
    s_div = document.createElement("div")
    rst_div = document.createElement("div")
    w = document.createElement("input")
    r = document.createElement("input")
    s = document.createElement("input")
    rst = document.createElement("input")
    w_label = document.createElement("label")
    r_label = document.createElement("label")
    s_label = document.createElement("label")
    rst_label = document.createElement("label")
    w_text = document.createTextNode("Weights")
    r_text = document.createTextNode("Reps")
    s_text = document.createTextNode("Sets")
    rst_text = document.createTextNode("Rest")
    
    w.value = workout.weight
    r.value = workout.reps
    s.value = workout.sets
    rst.value = workout.rest

    if (i == 0){ 
        name_button.setAttribute("class", "exerciseBlue")
    }
    else{
        name_button.setAttribute("class", "exerciseGrey")
    }
    w_div.setAttribute("class", "form__group_a field")
    r_div.setAttribute("class", "form__group_b field")
    s_div.setAttribute("class", "form__group_c field")
    rst_div.setAttribute("class", "form__group_d field")
    w.setAttribute("class", "form__field_a")
    r.setAttribute("class", "form__field_b")
    s.setAttribute("class", "form__field_c")
    rst.setAttribute("class", "form__field_d")
    w_label.setAttribute("class", "form__label_a")
    r_label.setAttribute("class", "form__label_b")
    s_label.setAttribute("class", "form__label_c")
    rst_label.setAttribute("class", "form__label_d")
    w_text = document.createTextNode("Weights")
    r_text = document.createTextNode("Reps")
    s_text = document.createTextNode("Sets")
    rst_text = document.createTextNode("Rest")
    
    name_button.style.top = String(5 + 25*i) + "%"
    w_div.style.top = String(13 + 25*i) + "%"
    r_div.style.top  = String(13 + 25*i) + "%"
    s_div.style.top  = String(13 + 25*i) + "%"
    rst_div.style.top  = String(13 + 25*i) + "%"

    name_button.appendChild(name_text)
    w_label.appendChild(w_text)
    r_label.appendChild(r_text)
    s_label.appendChild(s_text)
    rst_label.appendChild(rst_text)

    w_div.appendChild(w_label)
    w_div.appendChild(w)
    r_div.appendChild(r_label)
    r_div.appendChild(r)
    s_div.appendChild(s_label)
    s_div.appendChild(s)
    rst_div.appendChild(rst_label)
    rst_div.appendChild(rst)

    document.appendChild(w_div)
    document.appendChild(r_div)
    document.appendChild(s_div)
    document.appendChild(rst_div)
}


window.onload = function() {

    workout_promise = rcvdatajson("/rcv/workout")
    workout_promise.then(value => {
        workout = value
        num_exercises = Object.size(workout)
        play = document.getElementById("play")


        for (let i = 0; i < num_exercises; i++){
            createExercise(i, workout)
        }
    })
}