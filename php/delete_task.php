<?php
require_once('db_connection.php');

if (isset($_POST['id'])) {
    $taskId = intval($_POST['id']);
    $query = "DELETE FROM todos WHERE id = $taskId";

    if (mysqli_query($conn, $query)) {
        echo "Task deleted successfully.";
    } else {
        echo "ERROR: Could not able to execute $query. " . mysqli_error($conn);
    }
}
?>
