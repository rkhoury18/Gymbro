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

function parseDate(datestr){
    date_arr = datestr.split("")
    decimal_reached = false
    for (let i = 0; i < date_arr.length; i++){
        if (date_arr[i] == "."){
            decimal_reached = true
        }
        if (decimal_reached){
            date_arr.splice(i)
        date_arr.push("Z")
    return date_arr.join("")
}
    }
    
}

function popupFunctionality(element, ex_name){
    const PopUp = document.getElementById(ex_name + "_popup_container");
    const ClosePopup = document.getElementById(ex_name + "_close_popup");
    PopUp.style.display = "none";

    element.addEventListener("click", function() {
        console.log(ex_name)
        senddatajson({name:ex_name},"/history/ex")

        data_promise = rcvdatajson("/history/rcv/ex")

        data_promise.then(value => {
            var history = value

            var json_arr = history["ex_history"]
            
            var weights = []
            var volumes = []
            var reps = []
            var dates = []
            for (let i = 0; i < json_arr.length; i++){
                weights.push(parseInt(json_arr[i].weight))
                volumes.push(parseInt(json_arr[i].volume))
                reps.push(parseInt(json_arr[i].reps))
                dates.push(parseDate(json_arr[i].completed))
            }
            console.log(weights)
            console.log(dates)

            var xValues = ["2021-01-01T00:00:00Z", "2021-01-15T00:00:00Z", "2021-02-01T00:00:00Z", "2021-02-15T00:00:00Z","2021-03-01T00:00:00Z", "2021-03-15T00:00:00Z","2021-04-01T00:00:00Z", "2021-04-15T00:00:00Z","2021-05-01T00:00:00Z", "2021-05-15T00:00:00Z","2021-06-01T00:00:00Z", "2021-06-15T00:00:00Z"];
            var yValues = [60, 60, 65, 65, 70, 70, 72.5, 72.5, 75, 75, 75, 77.5];
            
            //WeightChart
            new Chart(ex_name + "ChartW", {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                    label: "Weight over time",
                    backgroundColor: "rgba(14, 161, 240, 0.75)",
                    borderColor: "rgba(0,0,0,0)",
                    data: weights
                    }]
                },
                options: {
                    scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Time',
                        },
                        type: 'time',
                        time: {
                            unit: 'minute',
                        }
                    }],
                    yAxes : [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Weight (kg)'
                        },
                        text: 'Weight (kg)'
                    }]
                    }
                }
            })

            //VolumeChart
            new Chart(ex_name + "ChartV", {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                    label: "Volume over time",
                    backgroundColor: "rgba(240, 161, 14, 0.75)",
                    borderColor: "rgba(0,0,0,0)",
                    data: volumes
                    }]
                },
                options: {
                    scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Time'
                        },
                        type: 'time',
                        time: {
                            unit: 'minute',
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,  
                            labelString: 'Volume (kg)'
                        },
                    }]
                    }
                }
            });
        })

        PopUp.style.display = "flex";
    });
        
    ClosePopup.addEventListener("click", function() {
        PopUp.style.display = "none";
    });
}


function toggleFunctionality(ex_name) {
    var weight_button = document.getElementById(String(ex_name) + "_Weight")
    var volume_button = document.getElementById(String(ex_name) + "_Volume")
    var weight_chart = document.getElementById(String(ex_name) + "ChartW")
    var volume_chart = document.getElementById(String(ex_name) + "ChartV")

    weight_button.addEventListener("click", function(){
        weight_chart.style.display = "block";
        volume_chart.style.display = "none";
    });

    volume_button.addEventListener("click", function(){
        volume_chart.style.display = "block";
        weight_chart.style.display = "none";
    });
}


function createHistoryElement(ex_name, count, max_count){
    var two = document.getElementById("two");
    var container = document.createElement("div");
    var box = document.createElement("div");
    var title = document.createElement("span");
    var title_text = document.createTextNode(ex_name)
    var bar = document.createElement("div")
    var per = document.createElement("span");
    var tooltip = document.createElement("span")  
    var percent_text = document.createTextNode(String(count))

    container.setAttribute("class", "container")
    box.setAttribute("class", "skill-box")
    title.setAttribute("class", "title")
    bar.setAttribute("class", "skill-bar")
    per.setAttribute("class", "skill-per css")
    tooltip.setAttribute("class", "tooltip")

    per.style.width = String(100*count/max_count) + "%"
    bar.style.width = "90%"
    // per.style.opacity = 1;
    // container.style.top = String(10*(i + 1))
    

    tooltip.appendChild(percent_text)
    per.appendChild(tooltip)
    bar.appendChild(per)
    title.appendChild(title_text)
    box.appendChild(bar)
    box.appendChild(title)
    container.appendChild(box)
    two.appendChild(container)

}


window.onload = function() {
    user_promise = rcvdatajson("/rcv/user");
    user_promise.then(user => {
        console.log(user)
        //user-name should be on top right of page i am noob :(
        document.getElementById("user-name").innerHTML = user.name
    }); 
    
    const benchButton = document.getElementById("bench");
    const overheadButton = document.getElementById("overhead");
    const squatButton = document.getElementById("squat");
    const deadliftButton = document.getElementById("deadlift");
    const rowButton = document.getElementById("row");
    const latButton = document.getElementById("lat");
    
    popupFunctionality(benchButton, "bench_press")
    popupFunctionality(overheadButton, "overhead_press")
    popupFunctionality(squatButton, "squat")
    popupFunctionality(deadliftButton, "deadlift")
    popupFunctionality(rowButton, "barbell_row")
    popupFunctionality(latButton, "hip_thrust")

    toggleFunctionality("bench_press")
    toggleFunctionality("overhead_press")
    toggleFunctionality("squat")
    toggleFunctionality("deadlift")
    toggleFunctionality("barbell_row")
    toggleFunctionality("hip_thrust")
    
    whistory_promise = rcvdatajson("/history/rcv/workout")

    whistory_promise.then(value => {
        workout_history = value;
        console.log("Workout History: " + workout_history) 
        max_count = 0;
        keys = Object.keys(workout_history)
        for (var key of keys){
            if (parseInt(workout_history[key]) > max_count){
                max_count = parseInt(workout_history[key]);
            }
        }
        for (var key of keys){
            console.log("Key: " + key) 
            console.log("Count: " + workout_history[key]) 
            console.log("Max Count: " + max_count) 
            createHistoryElement(key, parseInt(workout_history[key]), max_count)
        }
    })
    // createHistoryElement("Push", 30, 35)
    // createHistoryElement("Pull", 35, 35)
    // createHistoryElement("Legs", 25, 35)
};


