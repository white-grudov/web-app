<?php
require_once('db_connection.php');
header('Content-Type: text/xml');

echo '<?xml version="1.0" encoding="UTF-8"?>';
$response = '<response>';

if (isset($_POST['task'], $_POST['time_estimate'], $_POST['color_tag'])) {
    $task = mysqli_real_escape_string($conn, $_POST['task']);
    $time_estimate = mysqli_real_escape_string($conn, $_POST['time_estimate']);
    $color_tag = mysqli_real_escape_string($conn, $_POST['color_tag']);

    $query = "INSERT INTO todos (task, time_estimate, color_tag) VALUES ('$task', '$time_estimate', '$color_tag')";
    if ($result = mysqli_query($conn, $query)) {
        $id = mysqli_insert_id($conn);
        $response .= "<task>";
        $response .= "<id>$id</id>";
        $response .= "<text>$task</text>";
        $response .= "<timeEstimate>$time_estimate</timeEstimate>";
        $response .= "<colorTag>$color_tag</colorTag>";
        $response .= "<status>0</status>";
        $response .= "</task>";
    } else {
        $response .= "<error>ERROR: Could not able to execute $query. " . mysqli_error($conn) . "</error>";
    }
}

$response .= '</response>';
echo $response;
?>
