<?php
require_once('db_connection.php');

$query = "SELECT * FROM todos ORDER BY id DESC";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $taskClass = ($row['status'] == 1) ? 'completed' : '';
        $colorStyle = 'border-left: 10px solid ' . $row['color_tag'] . ';';

        $timeEstimate = !empty($row['time_estimate']) ? "<span class='time-estimate' style='color: gray;'>{$row['time_estimate']}</span>" : "";

        $disabledEdit = ($row['status'] == 1) ? 'disabled' : '';

        echo "<li class='task-item $taskClass' data-id='{$row['id']}' style='$colorStyle'>
            <div class='task-details'>
                <span class='task-text'>{$row['task']}</span>
                $timeEstimate
            </div>
            <span class='edit-btn' {$disabledEdit}><i class='fas fa-edit'></i></span>
            <span class='delete-btn'><i class='fas fa-trash'></i></span>
        </li>";
    }
} else {
    echo "<li>No tasks found</li>";
}
?>
