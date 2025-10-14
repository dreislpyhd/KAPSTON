<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM evacuation_centers";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'];
    $location = $input['location'];
    $capacity = $input['capacity'];
    $current_occupancy = $input['current_occupancy'];
    $status = $input['status'];
    $sql = "INSERT INTO evacuation_centers (name, location, capacity, current_occupancy, status) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssiss', $name, $location, $capacity, $current_occupancy, $status);
    if ($stmt->execute()) {
        echo json_encode(['id' => $stmt->insert_id, 'message' => 'Evacuation center added']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'];
    $name = $input['name'];
    $location = $input['location'];
    $capacity = $input['capacity'];
    $current_occupancy = $input['current_occupancy'];
    $status = $input['status'];
    $sql = "UPDATE evacuation_centers SET name = ?, location = ?, capacity = ?, current_occupancy = ?, status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssissi', $name, $location, $capacity, $current_occupancy, $status, $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Evacuation center updated']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $sql = "DELETE FROM evacuation_centers WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Evacuation center deleted']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

closeConnection($conn);
?>
