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

function popupFunctionality(element, ex_name){
    const PopUp = document.getElementById(ex_name + "_popup_container");
    const ClosePopup = document.getElementById(ex_name + "_close_popup");
    PopUp.style.display = "none";

    element.addEventListener("click", function() {
        senddatajson({name:ex_name},"/history/rcv/ex")

        data_promise = rcvdatajson("/history/rcv/ex")
        var xValues = ["2021-01-01T00:00:00Z", "2021-01-15T00:00:00Z", "2021-02-01T00:00:00Z", "2021-02-15T00:00:00Z","2021-03-01T00:00:00Z", "2021-03-15T00:00:00Z","2021-04-01T00:00:00Z", "2021-04-15T00:00:00Z","2021-05-01T00:00:00Z", "2021-05-15T00:00:00Z","2021-06-01T00:00:00Z", "2021-06-15T00:00:00Z"];
        var yValues = [60, 60, 65, 65, 70, 70, 72.5, 72.5, 75, 75, 75, 77.5];
        
        //WeightChart
        new Chart(ex_name + "ChartW", {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                backgroundColor: "rgba(14, 161, 240, 0.75)",
                borderColor: "rgba(0,0,0,0)",
                data: yValues
                }]
            },
            options: {
                scales: {
                  xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month',
                    }
                  }]
                }
              }
        });

        //VolumeChart
        new Chart(ex_name + "ChartV", {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                backgroundColor: "rgba(240, 161, 14, 0.75)",
                borderColor: "rgba(0,0,0,0)",
                data: yValues
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }
                }
            }
        });


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


function createHistoryElement(ex_name, count):
    two = document.getElementById("two")


window.onload = function() {
    
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
    })

};


