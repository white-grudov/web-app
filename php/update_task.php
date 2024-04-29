<?php
require_once('db_connection.php');

if (isset($_POST['id'], $_POST['task'], $_POST['time_estimate'], $_POST['color_tag'])) {
    $taskId = intval($_POST['id']);
    $task = mysqli_real_escape_string($conn, $_POST['task']);
    $time_estimate = mysqli_real_escape_string($conn, $_POST['time_estimate']);
    $color_tag = mysqli_real_escape_string($conn, $_POST['color_tag']);

    $query = "UPDATE todos SET task = '$task', time_estimate = '$time_estimate', color_tag = '$color_tag' WHERE id = $taskId";

    if (mysqli_query($conn, $query)) {
        echo "Task updated successfully.";
    } else {
        echo "ERROR: Could not execute $query. " . mysqli_error($conn);
    }
}
?>