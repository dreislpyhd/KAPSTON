<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM training_events ORDER BY date ASC";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $title = $input['title'];
    $date = $input['date'];
    $time = $input['time'];
    $duration = $input['duration'];
    $location = $input['location'];
    $type = $input['type'];
    $participants = $input['participants'];
    $description = $input['description'];
    $status = $input['status'];
    $sql = "INSERT INTO training_events (title, date, time, duration, location, type, participants, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssss', $title, $date, $time, $duration, $location, $type, $participants, $description, $status);
    if ($stmt->execute()) {
        echo json_encode(['id' => $stmt->insert_id, 'message' => 'Training event added']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'];
    $title = $input['title'];
    $date = $input['date'];
    $time = $input['time'];
    $duration = $input['duration'];
    $location = $input['location'];
    $type = $input['type'];
    $participants = $input['participants'];
    $description = $input['description'];
    $status = $input['status'];
    $sql = "UPDATE training_events SET title = ?, date = ?, time = ?, duration = ?, location = ?, type = ?, participants = ?, description = ?, status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssssi', $title, $date, $time, $duration, $location, $type, $participants, $description, $status, $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Training event updated']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $sql = "DELETE FROM training_events WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Training event deleted']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

closeConnection($conn);
?>
