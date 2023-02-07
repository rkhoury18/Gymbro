function rcvdatajson(url) {
    let response = fetch(url);
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

window.onload = function() {

    workout = rcvdatajson("/rcv/workout")
    num_exercises = Object.size(workout)


    for (let i = 0; i < num_exercises; i++){
        ex_obj = workout["exec" + String(i + 1)]

        name = document.createElement("button");
        name_text = document.createTextNode(ex_obj.name)
        w_div =  document.createElement("div")
        r_div = document.createElement("div")
        s_div = document.createElement("div")
        rst_div = document.createElement("div")
        w = document.createElement("input")
        r = document.createElement("input")
        s  = document.createElement("input")
        rst = document.createElement("input")
        w_text = document.createTextNode("Weights")
        r_text = document.createTextNode("Reps")
        s_text = document.createTextNode("Sets")
        rst_text = document.createTextNode("Rest")
        
        w.value = ex_obj.weight
        r.value = ex_obj.reps
        s.value = ex_obj.sets
        rst.value = ex_obj.rest
        
        if (i == 0){
            name.setAttribute("class", "exerciseBlue")
        }
        else{
            name.setAttribute("class", "exerciseGrey")
        }


    }
}