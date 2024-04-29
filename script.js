document.addEventListener('DOMContentLoaded', function() {
    const colorInput = document.getElementById('colorInput');
    const editColorInput = document.getElementById('editColorInput');

    populateColorOptions(colorInput);
    populateColorOptions(editColorInput);
    
    loadTasks();

    document.getElementById('themeToggle').addEventListener('click', function() {
        var elements = document.querySelectorAll('body, .container, h1, input, select, button, .task-item, .edit-btn, .delete-btn, .edit-task-modal');
        elements.forEach(element => element.classList.toggle('dark-theme'));

        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        var elements = document.querySelectorAll('body, .container, h1, input, select, button, .task-item, .edit-btn, .delete-btn, .edit-task-modal');
        elements.forEach(element => element.classList.add('dark-theme'));
    }

    document.getElementById('addTaskBtn').addEventListener('click', function() {
        var task = document.getElementById('taskInput').value;
        var timeEstimate = document.getElementById('timeInput').value;
        var colorTag = document.getElementById('colorInput').value;
        if (task.trim() !== '') {
            addTask(task, timeEstimate, colorTag);
            document.getElementById('taskInput').value = '';
            document.getElementById('timeInput').value = '';
        }
    });

    document.getElementById('taskList').addEventListener('click', function(event) {
        var target = event.target;
        if (target.classList.contains('edit-btn') || target.parentElement.classList.contains('edit-btn')) {
            if (target.hasAttribute('disabled') || target.parentElement.hasAttribute('disabled')) {
                return;
            }            
            var taskId = target.closest('li').dataset.id;
            openEditModal(taskId);
        } else if (target.classList.contains('delete-btn') || target.parentElement.classList.contains('delete-btn')) {
            var confirmDelete = confirm("Are you sure you want to delete this task?");
            if (confirmDelete) {
                event.stopPropagation();
                var taskId = target.closest('li').dataset.id;
                deleteTask(taskId);
            }
        } else if (target.closest('.task-item')) {
            var taskId = target.closest('.task-item').dataset.id;
            updateTaskStatus(taskId);
        }
    });
});

const colorOptions = [
    { value: "#FFFFFF", text: "White",  color: "#000000" },
    { value: "#DB162F", text: "Red",    color: "#DB162F" },
    { value: "#86BBD8", text: "Blue",   color: "#86BBD8" },
    { value: "#008000", text: "Green",  color: "#008000" },
    { value: "#F6AE2D", text: "Yellow", color: "#F6AE2D" },
    { value: "#E086D3", text: "Purple", color: "#E086D3" },
    { value: "#F26419", text: "Orange", color: "#F26419" }
];

function populateColorOptions(selectElement) {
    colorOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.style.color = option.color;
        opt.textContent = option.text;
        selectElement.appendChild(opt);
    });
}

function rgbToHex(color) {
    var rgb = color.match(/\d+/g);
    return '#' + rgb.map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function openEditModal(taskId) {
    var taskItem = document.querySelector(`li[data-id="${taskId}"]`);
    var taskText = taskItem.querySelector('.task-text').textContent;
    
    if (taskItem.querySelector('.time-estimate') !== null) {
        var timeEstimate = taskItem.querySelector('.time-estimate').textContent;
    } else {
        var timeEstimate = '';
    }

    var colorTag = taskItem.style.borderLeftColor;

    document.getElementById('editTaskInput').value = taskText;
    document.getElementById('editTimeInput').value = timeEstimate;
    document.getElementById('editColorInput').value = rgbToHex(colorTag);

    var rect = taskItem.getBoundingClientRect();
    var editModal = document.getElementById('editTaskModal');
    editModal.style.display = 'block';
    editModal.style.top = `${rect.bottom + window.scrollY}px`;
    editModal.style.left = `${rect.left + window.scrollX}px`;

    document.getElementById('saveTaskBtn').onclick = function() {
        saveTaskChanges(taskId);
    };
}

function closeEditModal() {
    var editModal = document.getElementById('editTaskModal');
    editModal.style.display = 'none';
}

function saveTaskChanges(taskId) {
    var updatedTask = document.getElementById('editTaskInput').value;
    var updatedTimeEstimate = document.getElementById('editTimeInput').value;
    var updatedColorTag = document.getElementById('editColorInput').value;

    httpRequest('POST', 'php/update_task.php', {
        id: taskId,
        task: updatedTask,
        time_estimate: updatedTimeEstimate,
        color_tag: updatedColorTag
    }, function() {
        closeEditModal();
        loadTasks();
    });
}

function httpRequest(method, url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(xhr.responseText);
        }
    };
    xhr.send(encodeFormData(data));
}

function encodeFormData(data) {
    if (!data) return null;
    var pairs = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name.replace('%20', '+'));
        value = encodeURIComponent(value.replace('%20', '+'));
        pairs.push(name + "=" + value);
    }
    return pairs.join('&');
}

function loadTasks() {
    httpRequest('GET', 'php/load_tasks.php', null, function(response) {
        document.getElementById('taskList').innerHTML = response;
        applyThemeToDynamicContent();
    });
}

function applyThemeToDynamicContent() {
    if (document.body.classList.contains('dark-theme')) {
        document.querySelectorAll('.task-item, .edit-btn, .delete-btn').forEach(function(item) {
            item.classList.add('dark-theme');
        });
    } else {
        document.querySelectorAll('.task-item, .edit-btn, .delete-btn').forEach(function(item) {
            item.classList.remove('dark-theme');
        });
    }
}

function addTask(task, timeEstimate, colorTag) {
    httpRequest('POST', 'php/add_task.php', {
        task: task,
        time_estimate: timeEstimate,
        color_tag: colorTag
    }, function() {
        loadTasks();
    });
}

function updateTaskStatus(taskId) {
    httpRequest('POST', 'php/update_task_status.php', { id: taskId }, function() {
        loadTasks();
    });
}

function deleteTask(taskId) {
    httpRequest('POST', 'php/delete_task.php', { id: taskId }, function() {
        loadTasks();
    });
}
