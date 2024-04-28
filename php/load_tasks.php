<?php
require_once('db_connection.php');

$query = "SELECT * FROM todos ORDER BY id DESC";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $taskClass = ($row['status'] == 1) ? 'completed' : '';
        $colorStyle = 'border-left: 10px solid ' . $row['color_tag'] . ';';

        // Check if the time estimate is not empty
        $timeEstimate = !empty($row['time_estimate']) ? "<span style='color: gray;'> {$row['time_estimate']}</span>" : "";

        echo "<li class='task-item $taskClass' data-id='{$row['id']}' style='$colorStyle'>{$row['task']}$timeEstimate <span class='delete-btn'><i class='fas fa-trash'></i></span></li>";
    }
} else {
    echo "<li>No tasks found</li>";
}
?>
