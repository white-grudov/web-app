document.addEventListener('DOMContentLoaded', function() {
    loadTasks();

    document.getElementById('themeToggle').addEventListener('click', function() {
        var elements = document.querySelectorAll('body, .container, h1, input, select, button, .task-item');
        elements.forEach(element => element.classList.toggle('dark-theme'));

        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        var elements = document.querySelectorAll('body, .container, h1, input, select, button, .task-item');
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
        if (target.classList.contains('delete-btn') || target.parentElement.classList.contains('delete-btn')) {
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
        document.querySelectorAll('.task-item').forEach(function(item) {
            item.classList.add('dark-theme');
        });
    } else {
        document.querySelectorAll('.task-item').forEach(function(item) {
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
