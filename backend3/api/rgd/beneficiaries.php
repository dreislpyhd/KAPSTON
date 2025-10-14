<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM relief_beneficiaries";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $name = $input['name'];
    $age = $input['age'];
    $gender = $input['gender'];
    $address = $input['address'];
    $needs = $input['needs'];
    $status = $input['status'];
    $sql = "INSERT INTO relief_beneficiaries (name, age, gender, address, needs, status) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sissss', $name, $age, $gender, $address, $needs, $status);
    if ($stmt->execute()) {
        echo json_encode(['id' => $stmt->insert_id, 'message' => 'Beneficiary added']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'];
    $name = $input['name'];
    $age = $input['age'];
    $gender = $input['gender'];
    $address = $input['address'];
    $needs = $input['needs'];
    $status = $input['status'];
    $sql = "UPDATE relief_beneficiaries SET name = ?, age = ?, gender = ?, address = ?, needs = ?, status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sissssi', $name, $age, $gender, $address, $needs, $status, $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Beneficiary updated']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $sql = "DELETE FROM relief_beneficiaries WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Beneficiary deleted']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

closeConnection($conn);
?>
