<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM residents";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'] ?? '';
    $age = (int)($input['age'] ?? 0);
    $family_size = (int)($input['family_size'] ?? 0);
    $address = $input['address'] ?? '';
    $contact_number = $input['contact_number'] ?? '';
    $last_distribution = $input['last_distribution'] ?? '';
    $notes = $input['notes'] ?? '';
    $zone = $input['zone'] ?? '';
    $center = $input['center'] ?? '';
    $barangay = $input['barangay'] ?? '';
    $sql = "INSERT INTO residents (name, age, family_size, address, contact_number, last_distribution, notes, zone, center, barangay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('siisssssss', $name, $age, $family_size, $address, $contact_number, $last_distribution, $notes, $zone, $center, $barangay);
    if ($stmt->execute()) {
        echo json_encode(['id' => $stmt->insert_id, 'message' => 'Resident added']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($_GET['id'])) {
        echo json_encode(['error' => 'ID parameter is required']);
        exit();
    }
    
    $id = $_GET['id'];
    $status = $input['status'] ?? '';
    
    if (empty($status)) {
        echo json_encode(['error' => 'Status is required']);
        exit();
    }
    
    $sql = "UPDATE residents SET status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit();
    }
    
    $stmt->bind_param('si', $status, $id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['message' => 'Resident updated', 'status' => $status]);
        } else {
            echo json_encode(['error' => 'No resident found with that ID or status unchanged']);
        }
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
    $stmt->close();
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $sql = "DELETE FROM residents WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Resident deleted']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

closeConnection($conn);
?>
