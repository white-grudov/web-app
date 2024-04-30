<?php
require_once('db_connection.php');
header('Content-Type: text/xml');

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<response>';

if (isset($_POST['id'])) {
    $taskId = intval($_POST['id']);
    $query = "UPDATE todos SET status = NOT status WHERE id = $taskId";

    if (mysqli_query($conn, $query)) {
        echo "<success>Task status updated successfully.</success>";
        echo "<id>$taskId</id>";
    } else {
        echo "<error>ERROR: Could not able to execute $query. " . mysqli_error($conn) . "</error>";
    }
}

echo '</response>';
?>
