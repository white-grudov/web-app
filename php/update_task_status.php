<?php
require_once('db_connection.php');

if (isset($_POST['id'])) {
    $taskId = intval($_POST['id']);
    $query = "UPDATE todos SET status = NOT status WHERE id = $taskId";

    if (mysqli_query($conn, $query)) {
        echo "Task status updated successfully.";
    } else {
        echo "ERROR: Could not able to execute $query. " . mysqli_error($conn);
    }
}
?>
