$(document).ready(function() {
    // Load tasks from the server on page load
    loadTasks();

    // Add task
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

    // Mark task as completed
    $('#taskList').on('click', '.task-item', function() {
        var taskId = $(this).data('id');
        if (!$(event.target).hasClass('delete-btn')) { // Prevent triggering when clicking the delete button
            updateTaskStatus(taskId);
        }
    });

    // Delete task
    $('#taskList').on('click', '.delete-btn', function(event) {
        event.stopPropagation();  // Prevents the task item click event from firing
        var taskId = $(this).closest('li').data('id');
        deleteTask(taskId);
    });
});

// Function to load tasks
function loadTasks() {
    $.ajax({
        url: 'php/load_tasks.php',
        method: 'GET',
        success: function(response) {
            $('#taskList').html(response);
        }
    });
}

// Function to add a task
function addTask(task, timeEstimate, colorTag) {
    $.ajax({
        url: 'php/add_task.php',
        method: 'POST',
        data: {
            task: task,
            time_estimate: timeEstimate,
            color_tag: colorTag
        },
        success: function() {
            loadTasks();
        }
    });
}

// Function to mark task as completed
function updateTaskStatus(taskId) {
    $.ajax({
        url: 'php/update_task_status.php',
        method: 'POST',
        data: { id: taskId },
        success: function() {
            loadTasks();
        }
    });
}

// Function to delete a task
function deleteTask(taskId) {
    $.ajax({
        url: 'php/delete_task.php',
        method: 'POST',
        data: { id: taskId },
        success: function() {
            loadTasks();
        }
    });
}
