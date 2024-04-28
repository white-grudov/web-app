<?php
require_once('db_connection.php');

if (isset($_POST['task'], $_POST['time_estimate'], $_POST['color_tag'])) {
    $task = mysqli_real_escape_string($conn, $_POST['task']);
    $time_estimate = mysqli_real_escape_string($conn, $_POST['time_estimate']);
    $color_tag = mysqli_real_escape_string($conn, $_POST['color_tag']);

    $query = "INSERT INTO todos (task, time_estimate, color_tag) VALUES ('$task', '$time_estimate', '$color_tag')";
    if (mysqli_query($conn, $query)) {
        echo "Task added successfully.";
    } else {
        echo "ERROR: Could not able to execute $query. " . mysqli_error($conn);
    }
}
?>
