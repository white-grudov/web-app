$(document).ready(function() {
    const colorInput = $('#colorInput');
    const editColorInput = $('#editColorInput');

    populateColorOptions(colorInput);
    populateColorOptions(editColorInput);
    
    loadTasks();

    $('#themeToggle').click(function() {
        $('body, .container, h1, input, select, button, .task-item, .edit-btn, .delete-btn, .edit-task-modal').toggleClass('dark-theme');
        localStorage.setItem('theme', $('body').hasClass('dark-theme') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        $('body, .container, h1, input, select, button, .task-item, .edit-btn, .delete-btn, .edit-task-modal').addClass('dark-theme');
    }

    $('#addTaskBtn').click(function() {
        var task = $('#taskInput').val();
        var timeEstimate = $('#timeInput').val();
        var colorTag = $('#colorInput').val();
        if (task.trim() !== '') {
            addTask(task, timeEstimate, colorTag);
            $('#taskInput').val('');
            $('#timeInput').val('');
        }
    });

    $('#taskList').on('click', function(event) {
        var target = $(event.target);
        if (target.hasClass('edit-btn') || target.parent().hasClass('edit-btn')) {
            if (target.prop('disabled') || target.parent().prop('disabled')) {
                return;
            }            
            var taskId = target.closest('li').data('id');
            openEditModal(taskId);
        } else if (target.hasClass('delete-btn') || target.parent().hasClass('delete-btn')) {
            var confirmDelete = confirm("Are you sure you want to delete this task?");
            if (confirmDelete) {
                event.stopPropagation();
                var taskId = target.closest('li').data('id');
                deleteTask(taskId);
            }
        } else if (target.closest('.task-item')) {
            var taskId = target.closest('.task-item').data('id');
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
    $.each(colorOptions, function(_, option) {
        selectElement.append($('<option>', {
            value: option.value,
            text: option.text,
            css: {
                color: option.color
            }
        }));
    });
}

function rgbToHex(color) {
    var rgb = color.match(/\d+/g);
    return '#' + $.map(rgb, function(x) { 
        return parseInt(x).toString(16).padStart(2, '0');
    }).join('').toUpperCase();
}

function openEditModal(taskId) {
    var taskItem = $(`li[data-id="${taskId}"]`);
    var taskText = taskItem.find('.task-text').text();
    var timeEstimate = taskItem.find('.time-estimate').text() || '';
    var colorTag = rgbToHex(taskItem.css('borderLeftColor'));

    $('#editTaskInput').val(taskText);
    $('#editTimeInput').val(timeEstimate);
    $('#editColorInput').val(colorTag);

    var rect = taskItem[0].getBoundingClientRect();
    $('#editTaskModal').css({
        display: 'block',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
    });

    $('#saveTaskBtn').off().click(function() {
        saveTaskChanges(taskId);
    });
}

function closeEditModal() {
    $('#editTaskModal').hide();
}

function saveTaskChanges(taskId) {
    var updatedTask = $('#editTaskInput').val();
    var updatedTimeEstimate = $('#editTimeInput').val();
    var updatedColorTag = $('#editColorInput').val();

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
    $.ajax({
        type: method,
        url: url,
        data: data,
        success: callback,
        error: function() {
            alert('An error occurred.');
        }
    });
}

function loadTasks() {
    httpRequest('GET', 'php/load_tasks.php', null, function(response) {
        $('#taskList').html(response);
        applyThemeToDynamicContent();
    });
}

function applyThemeToDynamicContent() {
    $('.task-item, .edit-btn, .delete-btn').toggleClass('dark-theme', $('body').hasClass('dark-theme'));
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
