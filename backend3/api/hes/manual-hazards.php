<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM manual_hazards";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $lat = $input['lat'];
    $lng = $input['lng'];
    $category = $input['category'];
    $severity = $input['severity'];
    $notes = $input['notes'];
    $sql = "INSERT INTO manual_hazards (lat, lng, category, severity, notes) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ddsss', $lat, $lng, $category, $severity, $notes);
    if ($stmt->execute()) {
        echo json_encode(['id' => $stmt->insert_id, 'message' => 'Manual hazard added']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'];
    $category = $input['category'];
    $severity = $input['severity'];
    $sql = "UPDATE manual_hazards SET category = ?, severity = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssi', $category, $severity, $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Manual hazard updated']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $sql = "DELETE FROM manual_hazards WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Manual hazard deleted']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

closeConnection($conn);
?>
