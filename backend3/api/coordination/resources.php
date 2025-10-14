<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM resources ORDER BY id ASC";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'];
    $type = $input['type'];
    $category = $input['category'];
    $status = $input['status'];
    $location = $input['location'];
    $condition = $input['condition'];
    $assignedTo = $input['assignedTo'];
    $lastMaintenance = $input['lastMaintenance'];
    $nextMaintenance = $input['nextMaintenance'];
    $description = $input['description'];
    $sql = "INSERT INTO resources (name, type, category, status, location, `condition`, assignedTo, lastMaintenance, nextMaintenance, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssssss', $name, $type, $category, $status, $location, $condition, $assignedTo, $lastMaintenance, $nextMaintenance, $description);
    if ($stmt->execute()) {
        echo json_encode(['id' => $stmt->insert_id, 'message' => 'Resource added']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'];
    $name = $input['name'];
    $type = $input['type'];
    $category = $input['category'];
    $status = $input['status'];
    $location = $input['location'];
    $condition = $input['condition'];
    $assignedTo = $input['assignedTo'];
    $lastMaintenance = $input['lastMaintenance'];
    $nextMaintenance = $input['nextMaintenance'];
    $description = $input['description'];
    $sql = "UPDATE resources SET name = ?, type = ?, category = ?, status = ?, location = ?, `condition` = ?, assignedTo = ?, lastMaintenance = ?, nextMaintenance = ?, description = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssssssi', $name, $type, $category, $status, $location, $condition, $assignedTo, $lastMaintenance, $nextMaintenance, $description, $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Resource updated']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $sql = "DELETE FROM resources WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Resource deleted']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

closeConnection($conn);
?>
