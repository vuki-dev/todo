var uID = 0;
uID = parseInt(localStorage.getItem("uID"))
if(isNaN(uID)){
    uID = 0;
}
localStorage.setItem("uID",uID);

console.log(uID)

var doneTasks = [];
var pendingTasks = [];

var doneList = document.getElementById("done");
var pendingList = document.getElementById("pending");

var newTaskBtn = document.getElementById("new-task")
var newTaskForm = document.getElementById("newTaskForm");

var doneCards = document.getElementById("doneCards");
var pendingCards = document.getElementById("pendingCards");

var closeBtn = document.getElementById("closeBtn");
var addBtn = document.getElementById("addBtn");



function Task(naziv){
    this.naziv = naziv;
    this.stanje = null;
    this.id = uID++;
    localStorage.setItem("uID",uID)
    

    this.napraviSe = function(){
        
       // console.log(this.id)
        var taskDiv = document.createElement("div");
        taskDiv.classList.add("task-div");

        var taskNaziv = document.createElement("p");
        taskNaziv.innerHTML = this.naziv;


        var checkbox = document.createElement("input");
        checkbox.type = "checkbox"
        checkbox.style.cursor = "pointer";
        if(this.stanje === true){
            checkbox.checked = true;
        }
        if(this.stanje === false){
            checkbox.checked = false;
        }


        var delItem = document.createElement("i");
        delItem.classList.add("fa-trash-can")
        delItem.classList.add("fa-solid")
        delItem.classList.add("del-icon")

        delItem.addEventListener("click",() => {
            for(var i=0; i<localStorage.length; i++){
                var tempObj = JSON.parse(localStorage.getItem(localStorage.key(i)));

                console.log(tempObj)
                console.log(this.id)
                
                if(this.id === tempObj.id){
                    
                    localStorage.removeItem(localStorage.key(i))
                    break;
                }
            }
            
            if(this.stanje === null | this.stanje === false){
                for(var i=0; i<pendingTasks.length; i++){
                    if(this.id === pendingTasks[i].id){
                        pendingTasks.splice(i,1);
                        prikaziDoneTaskove();
                        prikaziPendingTaskove();

                        //scaleChart();

                        return;
                    }
                }
            }
            if(this.stanje === true){
                for(var i=0; i<doneTasks.length; i++){
                    if(this.id === doneTasks[i].id){
                        doneTasks.splice(i,1);
                        
                        prikaziDoneTaskove();
                        prikaziPendingTaskove();

                        //scaleChart();
                        
                        return;
                    }
                }
            }
            
        })
        

        rightDiv = document.createElement("div");
        rightDiv.classList.add("taskRightDiv")

        rightDiv.appendChild(checkbox)
        rightDiv.appendChild(delItem)

        taskDiv.appendChild(taskNaziv)
        taskDiv.appendChild(rightDiv)                
        
        checkbox.addEventListener("change", ()=>{
            this.stanje = checkbox.checked;
            if(this.stanje === true){
                for(var i = 0; i<pendingTasks.length; i++){
                    if(this.id === pendingTasks[i].id){
                        
                        console.log(localStorage.setItem("task"+this.id,JSON.stringify(pendingTasks[i])))


                        doneTasks.unshift(pendingTasks[i]);
                        pendingTasks.splice(i,1);
                        
                        
                        doneList.innerHTML = "";
                        pendingList.innerHTML = "";

                        prikaziDoneTaskove();
                        prikaziPendingTaskove()
                        //scaleChart()
                        return;
                    }
                }
            }
            if(this.stanje === false){
                for(var i = 0; i<doneTasks.length; i++){
                    if(this.id === doneTasks[i].id){

                        localStorage.setItem("task"+this.id, JSON.stringify(doneTasks[i]))

                        pendingTasks.unshift(doneTasks[i]);
                        doneTasks.splice(i,1);

                        doneList.innerHTML = "";
                        pendingList.innerHTML = "";

                        //scaleChart()

                        prikaziDoneTaskove();
                        prikaziPendingTaskove();                                
                        return;
                    }
                }
            }
            
        })
        //  console.log(pendingTasks)
        // console.log(doneTasks)
       calculateTotalTasks()
        return taskDiv;

    }
}

let prototypeObj = new Task()
//console.log(prototypeObj)



function prikaziPendingTaskove(task){
    pendingList.innerHTML = "";
    for(var i = 0; i<pendingTasks.length; i++){
        var element = pendingTasks[i].napraviSe();
        pendingList.appendChild(element);
    }
    
}

function prikaziDoneTaskove(){
    doneList.innerHTML = "";
    for(var i = 0; i<doneTasks.length; i++){
        var element = doneTasks[i].napraviSe();
     //   doneTasks[i].checkbox.checked = true;
        element.childNodes[0].style.textDecoration = "line-through"
        doneList.appendChild(element)
    }
    
}


newTaskBtn.addEventListener("click",() => {
    console.log("klik??")
    doneCards.style.transform = "translateY(150%)"
    pendingCards.style.transform = "translateY(150%)"

    newTaskForm.style.transform = "translateX(-50%) translateY(300px)"

    


})

closeBtn.addEventListener("click",()=>{
    newTaskForm.childNodes[5].value = "";

    doneCards.style.transform = "translateY(0)"
    pendingCards.style.transform = "translateY(0)"

    newTaskForm.style.transform = "translateX(-50%) translateY(-400px)"

})

addBtn.addEventListener("click",() => {
    var task = new Task(newTaskForm.childNodes[5].value)
    pendingTasks.unshift(task)
    console.log(task)
    localStorage.setItem("task"+task.id,JSON.stringify(task))
    // scaleChart()
    doneList.innerHTML = "";
    pendingList.innerHTML = "";
    prikaziPendingTaskove()
    prikaziDoneTaskove()

    doneCards.style.transform = "translateY(0)"
    pendingCards.style.transform = "translateY(0)"

    newTaskForm.style.transform = "translateX(-50%) translateY(-400px)"

    newTaskForm.childNodes[5].value = "";
    

})


// prikaziPendingTaskove()
// prikaziDoneTaskove()

function calculateTotalTasks(){
    var totalTasks = pendingTasks.length + doneTasks.length;
    
    return totalTasks;
}

function completionPercentage(){
    var totalTasks = calculateTotalTasks();
    var percentage = (doneTasks.length/totalTasks)*100
    if(doneTasks.length === 0){
        percentage = 0;
    }
    
    return percentage;
}

window.addEventListener("scroll",() => {
    //console.log(window.scrollY)
    if(window.scrollY > 300 && window.scrollY < 600){
        scaleChart()
        console.log("??")
        percentChart.style.transition = "all .8s ease"
        percentChart.style.opacity = "100%"
        percentChart.style.transform = "translateY(0)"
    }
    if(window.scrollY < 250){
        percentChart.style.transition = "all .5s ease"
        percentChart.style.opacity = "0"
        percentChart.style.transform = "translateY(40px)"
    }

})

var chart = document.getElementById("chart");
var chartParent = document.getElementById("percentChart")
var percentChart = document.getElementById("percentchart")

percentChart.style.opacity = "0"
percentChart.style.transform = "translateY(40px)"


function scaleChart(){
    if(doneTasks.length === 0){
        chart.style.height = 0;
    }
    chart.style.transition = "height .5s ease"
    chart.style.height =  completionPercentage()+"%"
    console.log(completionPercentage())

    var chartText = document.getElementById("chart-text");
    chartText.childNodes[1].innerHTML = "Your task completion<br> is: " + parseInt(completionPercentage()) + "%.";
    
    var gratsText = null;

    if(parseInt(completionPercentage())>50){
        gratsText = "Awesome!"
    }
    if(parseInt(completionPercentage())<=50){
        gratsText = "Not bad!"
    }
    if(parseInt(completionPercentage())===0){
        gratsText = "You've done nothing <br> today!"
    }
    if(parseInt(completionPercentage())===100){
        gratsText = "Congratulations! <br> You've finished all <br> your tasks!"
    }

    chartText.childNodes[4].innerHTML = gratsText;

}

// LOCAL STORAGE =========



function retStorage(){
    if(localStorage.length === 0){
        return;
    }
    for(var i=0; i<localStorage.length; i++){
        //console.log(localStorage.key(i))
        if(localStorage.key(i) === "uID"){
            continue;
        }
        
        var storageObj = JSON.parse(localStorage.getItem(localStorage.key(i)))
        
        

        var inherObj = Object.create(prototypeObj)
        
        inherObj.id = storageObj.id;
        inherObj.naziv = storageObj.naziv;
        inherObj.stanje = storageObj.stanje;

        console.log(inherObj)
        console.log("inherObj instanceof Task",inherObj instanceof Task)
        
        
        if(storageObj.stanje){
            doneTasks.unshift(inherObj);
        }
        else{
            pendingTasks.unshift(inherObj);
        }
    }
    
    console.log(doneTasks)
    console.log(pendingTasks)
}

retStorage()

prikaziDoneTaskove();
prikaziPendingTaskove();
