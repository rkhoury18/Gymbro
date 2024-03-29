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
    
    str_arr = str.slice(2).split("")
    prev_underscore = true
    let i = 0;
    while (i < str_arr.length){
        if (str_arr[i] == "_"){
            str_arr[i] = " "
            prev_underscore = true
        }
        else if (prev_underscore){
            prev_underscore = false
            str_arr[i] = str_arr[i].toUpperCase()
        }
        i += 1;
    }
    return str_arr.join("")
};

function createExercise(i, workout) {
    var keys = Object.keys(workout)
    ex_obj = workout[keys[i]]
    name_button = document.createElement("button");
    name_text = document.createTextNode(parse_str(keys[i]))
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
    s.id = "sets" + String(i)
    rst.id = "rest" + String(i)
    w_div.id = "weight_div" + String(i)
    r_div.id = "reps_div" + String(i)
    s_div.id = "sets_div" + String(i)
    rst_div.id = "rest_div" + String(i)
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

async function updatepage(){
    while (sets_completed < cur_s.value){
        set_data = await rcvdatajson("/client/finish_set")
	if (Object.keys(set_data).length == 0) {
            continue
        }
        sets_completed += 1
            if (sets_completed == 1) {
                cur_w = document.getElementById("weight" + String(ex_counter))
                cur_r = document.getElementById("reps" + String(ex_counter))
                cur_s = document.getElementById("sets" + String(ex_counter))
    
                w_div = document.getElementById("weight_div" + String(ex_counter))
                r_div = document.getElementById("reps_div" + String(ex_counter))
                s_div = document.getElementById("sets_div" + String(ex_counter))
                rst_div = document.getElementById("rest_div" + String(ex_counter))

                w_div.style.top = String(5 + 25*ex_counter) + "%"
                r_div.style.top  = String(5 + 25*ex_counter) + "%"
                s_div.style.top  = String(5 + 25*ex_counter) + "%"
                
                cur_w.parentNode.removeChild(cur_w)
                cur_r.parentNode.removeChild(cur_r)
                cur_s.parentNode.removeChild(cur_s)
                rst_div.parentNode.removeChild(rst_div)
            }
        set_w =  document.createElement("div")
        set_r = document.createElement("div")
        set_s = document.createElement("div")
        
        w_label = document.createElement("label")
        r_label = document.createElement("label")
        s_label = document.createElement("label")
        
        w_text = document.createTextNode(set_data.weight)
        r_text = document.createTextNode(set_data.reps)
        s_text = document.createTextNode(String(sets_completed))

        set_w.setAttribute("class", "form__group_a field")
        set_r.setAttribute("class", "form__group_b field")
        set_s.setAttribute("class", "form__group_c field")
        w_label.setAttribute("class","form__label_a")
        r_label.setAttribute("class","form__label_b")
        s_label.setAttribute("class","form__label_c")

        w_label.appendChild(w_text)
        r_label.appendChild(r_text)
        s_label.appendChild(s_text)
        set_w.appendChild(w_label)
        set_r.appendChild(r_label)
        set_s.appendChild(s_label)

        document.body.appendChild(set_w)
        document.body.appendChild(set_r)
        document.body.appendChild(set_s)

        set_w.style.top = String(5*(sets_completed + 1) + 25*ex_counter) + "%"
        set_r.style.top  = String(5*(sets_completed + 1) + 25*ex_counter) + "%"
        set_s.style.top  = String(5*(sets_completed + 1) + 25*ex_counter) + "%"

    }
}

window.onload = function() {
    user_promise = rcvdatajson("/rcv/user");
    user_promise.then(user => {
        console.log(user)
        //user-name should be on top right of page i am noob :(
        document.getElementById("user-name").innerHTML = user.name
    }); 
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


        //Add listeners for play button
        play.addEventListener("click", async function(){
            //Send data to server
            console.log("Ex_counter:", ex_counter)
            cur_w = document.getElementById("weight" + String(ex_counter))
            cur_r = document.getElementById("reps" + String(ex_counter))
            cur_s = document.getElementById("sets" + String(ex_counter))
            cur_rst = document.getElementById("rest" + String(ex_counter))
            cur_name_button = document.getElementById("name" + String(ex_counter))

            ex = Object.keys(workout)[ex_counter].slice(2) //Exercise name
            var ex_obj = {name:ex,weight:cur_w.value,reps:cur_r.value,sets:cur_s.value,rest:cur_rst.value}
            console.log(ex_obj)
            senddatajson(ex_obj, "/client/start_ex") 
            
            //Wait for data
            sets_completed = 0

            await updatepage()
            
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
    finish.addEventListener("click",function(){
        senddatajson({finish:1}, "/client/workout/finish")
    })
}
