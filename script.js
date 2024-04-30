$(document).ready(() => {
    populateColorOptions('#colorInput, #editColorInput');
    loadTasks();

    $('#addTaskBtn').click(addNewTask);
    $('#taskList').on('click', handleTaskListClick);
    $('#saveTaskBtn').click(saveTaskChanges);
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

const rgbToHex = (color) => '#' + $.map(color.match(/\d+/g), (x) => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
const closeEditModal = () => $('#editTaskModal').hide();

const openEditModal = (taskId) => {
    var taskItem = $(`li[data-id="${taskId}"]`);
    var modal = $('#editTaskModal').css({
        display: 'block',
        top: taskItem.offset().top + taskItem.outerHeight(),
        left: taskItem.offset().left,
        width: taskItem.width()
    });

    $('#editTaskInput').val(taskItem.find('.task-text').text());
    $('#editTimeInput').val(taskItem.find('.time-estimate').text());
    $('#editColorInput').val(rgbToHex(taskItem.css('borderLeftColor')));

    modal.data('taskId', taskId);
}

const populateColorOptions = (selector) => {
    $(selector).each(() => {
        var selectElement = $(this);
        $.each(colorOptions, (_, option) => {
            selectElement.append($('<option>', {
                value: option.value,
                text: option.text
            }).css('color', option.color));
        });
    });
}

const addNewTask = () => {
    var task = $('#taskInput').val().trim();
    var timeEstimate = $('#timeInput').val();
    var colorTag = $('#colorInput').val();

    if (task) {
        addTask(task, timeEstimate, colorTag);
        $('#taskInput, #timeInput').val('');
    }
}

const handleTaskListClick = (event) => {
    var target = $(event.target);
    var taskItem = target.closest('.task-item');
    var taskId = taskItem.data('id');

    if (target.closest('.edit-btn').length && !taskItem.hasClass('completed')) {
        openEditModal(taskId);
    } else if (target.closest('.delete-btn').length) {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(taskId);
        }
    } else if (taskItem.length) {
        updateTaskStatus(taskId);
    }
}

const saveTaskChanges = () => {
    var taskId = $('#editTaskModal').data('taskId');
    var updatedTask = $('#editTaskInput').val();
    var updatedTimeEstimate = $('#editTimeInput').val();
    var updatedColorTag = $('#editColorInput').val();

    if (!updatedTask) return alert('Task cannot be empty.');

    ajaxCall('POST', 'php/update_task.php', {
        id: taskId,
        task: updatedTask,
        time_estimate: updatedTimeEstimate,
        color_tag: updatedColorTag
    }, (response) => {
        if ($(response).find('success').length) {
            var taskItem = $('li[data-id="' + taskId + '"]');
            taskItem.find('.task-text').text(updatedTask);
            taskItem.find('.time-estimate').text(updatedTimeEstimate).css('color', 'gray');
            taskItem.css('border-left', '10px solid ' + updatedColorTag);
            closeEditModal();
        } else {
            alert('Failed to update task: ' + $(response).find('error').text());
        }
    }, 'Error updating task.'
    );
}

const loadTasks = () => {
    ajaxCall('GET', 'php/load_tasks.php', null, (response) => {
        var content = '';
        $(response).find('task').each(function() {
            var id = $(this).find('id').text();
            var text = $(this).find('text').text();
            var timeEstimate = $(this).find('timeEstimate').text();
            var colorTag = $(this).find('colorTag').text();
            var status = $(this).find('status').text();

            var taskClass = (status === '1') ? 'completed' : '';
            var colorStyle = 'border-left: 10px solid ' + colorTag + ';';

            content += "<li class='task-item " + taskClass + "' data-id='" + id + "' style='" + colorStyle + "'>";
            content += "<div class='task-details'>";
            content += "<span class='task-text'>" + text + "</span>";
            content += "<span class='time-estimate' style='color: gray;'>" + timeEstimate + "</span>";
            content += "</div>";
            content += "<span class='edit-btn'><i class='fas fa-edit'></i></span>";
            content += "<span class='delete-btn'><i class='fas fa-trash'></i></span>";
            content += "</li>";
        });
        $('#taskList').html(content);
    }, 'Error loading tasks.'
    );
}

const addTask = (task, timeEstimate, colorTag) => {
    ajaxCall('POST', 'php/add_task.php', {
        task: task,
        time_estimate: timeEstimate,
        color_tag: colorTag
    }, (response) => {
        if ($(response).find('task').length) {
            var id = $(response).find('id').text();
            var status = $(response).find('status').text();
            var colorStyle = 'border-left: 10px solid ' + colorTag + ';';
            var taskClass = (status === '1') ? 'completed' : '';

            var content = "<li class='task-item " + taskClass + "' data-id='" + id + "' style='" + colorStyle + "'>";
            content += "<div class='task-details'>";
            content += "<span class='task-text'>" + task + "</span>";
            if (timeEstimate) {
                content += "<span class='time-estimate' style='color: gray;'>" + timeEstimate + "</span>";
            }
            content += "</div>";
            content += "<span class='edit-btn'><i class='fas fa-edit'></i></span>";
            content += "<span class='delete-btn'><i class='fas fa-trash'></i></span>";
            content += "</li>";

            $('#taskList').prepend(content);
        } else {
            alert('Failed to add task: ' + $(response).find('error').text());
        }
    }, 'Error adding task.'
    );
}

const updateTaskStatus = (taskId) => {    
    ajaxCall('POST', 'php/update_task_status.php', { id: taskId }, (response) => {
        if ($(response).find('success').length) {
            var taskItem = $('li[data-id="' + taskId + '"]');
            taskItem.toggleClass('completed');
        } else {
            alert('Failed to update task status: ' + $(response).find('error').text());
        }
    }, 'Error updating task status.'
    );
}

const deleteTask = (taskId) => {
    ajaxCall('POST', 'php/delete_task.php', { id: taskId }, (response) => {
        if ($(response).find('success').length) {
            $('li[data-id="' + taskId + '"]').remove();
        } else {
            alert('Failed to delete task: ' + $(response).find('error').text());
        }
    }, 'Error deleting task.'
    );
}

const ajaxCall = (type, url, data, successCallback, error) => {
    $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: 'xml',
        success: successCallback,
        error: () => alert(error)
    });
}
