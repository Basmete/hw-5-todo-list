var appModule = (function() {
  var addButton = document.getElementById("add_button");
  var todoList = document.getElementById("tasklist");
  document.getElementById("deadlineArea").value = "";


  // Saving due to localStorage
  function startApp() {
    todoList.innerHTML = window.localStorage.getItem("tasklist");
  }

  function updateLocalStorage() {
    window.localStorage.setItem("tasklist", todoList.innerHTML);
  }
  // creating new task
  function newTask() {
    var inputValue = document.getElementById("new_task").value;
    var inputDeadline = document.getElementById("deadlineArea").value;
    if (inputValue === "") {
      throw new Error("Input field is empty. Please, enter your task");
    } else {
      var li = document.createElement("li");
      var t = document.createTextNode(inputValue);
      li.appendChild(t);
      li.classList.add("todo");
      document.getElementById("tasklist").appendChild(li);

      // creating close icon
      var closeIcon = document.createElement("SPAN");
      var txt = document.createTextNode("X");
      closeIcon.className = "close";
      closeIcon.appendChild(txt);
      li.appendChild(closeIcon);

      // add deadline area
      if (inputDeadline != 0) {
        var time_span = document.createElement("SPAN");
        var time = document.createTextNode(inputDeadline);
        time_span.className = "time";
        time_span.appendChild(time);
        li.appendChild(time_span);
        li.classList.toggle("isDeadline");
      } else {
        li.classList.toggle("notDeadline");
      }
      updateLocalStorage();

      // clear fields for new task
      document.getElementById("deadlineArea").value = "";
      document.getElementById("new_task").value = "";
    }
  }

  
  addButton.addEventListener("click", newTask);
  document.getElementById("filter-selector").addEventListener("change", filterFunc);
  document.getElementById("date_filter").addEventListener("change", deadlineFilter);
  document.querySelector("ul").addEventListener("click", taskHandler);
  

  function filterFunc() {
    var filter = document.getElementById("filter-selector");

    if (filter.value === "Undone") {
      hide("completed", "todo");
    } else if (filter.value === "Done") {
      hide("todo", "completed");
    } else {
      hide(1, "completed", "todo");
    }
  }



  //filter tasks by deadline: tomorrow/next week
  function deadlineFilter() {
    var filter = document.getElementById("date_filter");
    var deadlineList = document.getElementsByClassName("isDeadline");
    hide("notDeadline");

    var today = new Date();
    var tomorrow = new Date();
    var nextWeekMonday = new Date();
    var nextWeekSunday = new Date();

    tomorrow.setDate(today.getDate() + 1);
    nextWeekMonday.setDate(
      today.getDate() +
        ((8 - today.getDay()) % 7) +
        (today.getDay() === 1 ? 7 : 0)
    );
    nextWeekSunday.setDate(today.getDate() + ((14 - today.getDay()) % 7) + 8);

    tomorrow.setHours(0, 0, 0, 0);
    nextWeekMonday.setHours(0, 0, 0, 0);
    nextWeekSunday.setHours(0, 0, 0, 0);

    for (var deadlineListItem of deadlineList) {
      var deadline = new Date(deadlineListItem.lastChild.innerText);
      deadline.setHours(0, 0, 0, 0);
      var opt = filter.value;
      switch (opt) {
        case "Tomorrow": 
        deadline.getTime() == tomorrow.getTime() ? deadlineListItem.classList.remove("hidden") : deadlineListItem.classList.add("hidden");
          break;
        case "Next week": 
        deadline.getTime() >= nextWeekMonday.getTime() && deadline.getTime() <= nextWeekSunday.getTime() ? deadlineListItem.classList.remove("hidden") : deadlineListItem.classList.add("hidden");
          break;
        case "Any deadline": 
          deadlineListItem.classList.remove("hidden");
          hide(1, "notDeadline");
          break;
      }
    }
  }



  //delete or check the selected task
  function taskHandler(task) {
    if (task.target.tagName === "LI") {
      task.target.classList.toggle("todo");
      task.target.classList.toggle("completed");
    } else if (task.target.classList.contains("close")) {
      var div = task.target.parentNode;
      div.remove();
    }
    updateLocalStorage();
  }



  // hiding unfiltered tasks
  function hide(hidClass, unhidClass, unhidClass2) {
    var hiddenArray = document.getElementsByClassName(hidClass);
    var unhiddenArray = document.getElementsByClassName(unhidClass);
    var _unhiddenArray = document.getElementsByClassName(unhidClass2);

    for (var item of hiddenArray) {
      item.classList.add('hidden');
    }
    for (var item of unhiddenArray) {
      item.classList.remove('hidden');
    }
    for (var item of _unhiddenArray) {
      item.classList.remove('hidden');
    }
  }

  return {
    start: function() {
      startApp();
    }
  };
})();

appModule.start();
