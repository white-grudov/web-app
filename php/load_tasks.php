<?php
require_once('db_connection.php');
header('Content-Type: text/xml');

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<tasks>';

$query = "SELECT * FROM todos ORDER BY id DESC";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<task>";
        echo "<id>{$row['id']}</id>";
        echo "<text>{$row['task']}</text>";
        echo "<timeEstimate>{$row['time_estimate']}</timeEstimate>";
        echo "<colorTag>{$row['color_tag']}</colorTag>";
        echo "<status>{$row['status']}</status>";
        echo "</task>";
    }
} else {
    echo "<task><message>No tasks found</message></task>";
}
echo '</tasks>';
?>
