<?php
include 'config.php';

$sql = file_get_contents('database.sql');

if ($conn->multi_query($sql)) {
    echo 'Tables created successfully';
} else {
    echo 'Error: ' . $conn->error;
}

closeConnection($conn);
?>
