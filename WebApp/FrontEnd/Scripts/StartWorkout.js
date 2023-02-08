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

function parse_str(str){
    for (let i = 0; i < str.length; i++){
        return
    }
}

function createExercise(i, workout) {
    var keys = Object.keys(workout)
    ex_obj = workout[keys[i]]
    name_button = document.createElement("button");
    name_text = document.createTextNode(keys[i])
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
    
    w.value = ex_obj.weight
    r.value = ex_obj.reps
    s.value = ex_obj.sets
    rst.value = ex_obj.rest

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

    w.id = "weight" + String(i)
    r.id = "reps" + String(i)
    s.id = "set" + String(i)
    rst.id = "rest" + String(i)
    name_button.id = "name" + String(i)

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

    document.body.appendChild(name_button)
    document.body.appendChild(w_div)
    document.body.appendChild(r_div)
    document.body.appendChild(s_div)
    document.body.appendChild(rst_div)
    
}


window.onload = function() {
    workout_promise = rcvdatajson("/rcv/workout")
    workout_promise.then(value => {
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


        //Add listeners for play button
        play.addEventListener("click", function(){
            //Send data to server
            console.log("Ex_counter:", ex_counter)
            cur_w = document.getElementById("weight" + String(ex_counter))
            cur_r = document.getElementById("reps" + String(ex_counter))
            cur_s = document.getElementById("set" + String(ex_counter))
            cur_rst = document.getElementById("rest" + String(ex_counter))
            cur_name_button = document.getElementById("name" + String(ex_counter))

            ex = Object.keys(workout)[ex_counter].slice(2) //Exercise name
            var ex_obj = {name:ex,weight:cur_w.value,reps:cur_r.value,sets:cur_s.value,rest:cur_rst.value}
            console.log(ex_obj)
            senddatajson(ex_obj, "/client/start_ex") 
            
            //Wait for data
            completed_sets = rcvdatajson("/client/finish_set")
            
            //Move play button and change the class of 1 and 2 
            if (ex_counter < num_exercises - 1){
                play.style.top = String(2 + 25*(ex_counter + 1)) + "%"
                next_name_button = document.getElementById("name" + String(ex_counter + 1))
                cur_name_button.setAttribute("class", "exerciseGrey")
                next_name_button.setAttribute("class", "exerciseBlue")
                cur_name_button.style.top = String(5 + 25*(ex_counter)) + "%"
                next_name_button.style.top = String(5 + 25*(ex_counter + 1)) + "%"
            }
            else if (ex_counter == (num_exercises - 1)){
                play.parentNode.removeChild(play);
                cur_name_button.setAttribute("class", "exerciseGrey")
                cur_name_button.style.top = String(5 + 25*(ex_counter)) + "%"
            }
            ex_counter += 1

            
        })


    })
}