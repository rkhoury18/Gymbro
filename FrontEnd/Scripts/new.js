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

var add_count = 0;
window.onload = function() {
    var add = document.getElementById("Add");
    add.addEventListener("click", function() {
        add_count += 1;
        var newWeight = document.createElement("div");
        var weightIn = document.createElement("input");
        var newReps = document.createElement("div");
        var repsIn = document.createElement("input");
        var newSets = document.createElement("div");
        var setsIn = document.createElement("input");
        var newRest = document.createElement("div");
        var restIn = document.createElement("input");

        newWeight.setAttribute("class", "input-container1");
        weightIn.setAttribute("type", "text");
        newReps.setAttribute("class", "input-container2");
        repsIn.setAttribute("type", "text");
        newSets.setAttribute("class", "input-container3");
        setsIn.setAttribute("type", "text");
        newRest.setAttribute("class", "input-container4");
        restIn.setAttribute("type", "text");

        newWeight.style.top = String(15 + 10*add_count) + "%"; //TODO: Make this not hardcoded
        newReps.style.top = String(15 + 10*add_count) + "%"; //TODO: Make this not hardcoded
        newSets.style.top = String(15 + 10*add_count) + "%"; //TODO: Make this not hardcoded
        newRest.style.top = String(15 + 10*add_count) + "%"; //TODO: Make this not hardcoded
        
        newWeight.appendChild(weightIn);
        document.body.appendChild(newWeight);
        newReps.appendChild(repsIn);
        document.body.appendChild(newReps);
        newSets.appendChild(setsIn);
        document.body.appendChild(newSets);
        newRest.appendChild(restIn);
        document.body.appendChild(newRest);

        add.style.top = String(25 + 10*add_count) + "%";
    });
};