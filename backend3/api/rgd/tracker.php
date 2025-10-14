<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM rgd_tracker";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $region = $input['region'];
    $beneficiaries = $input['beneficiaries'];
    $distributed_packages = $input['distributed_packages'];
    $last_distribution = $input['last_distribution'];
    $status = $input['status'];
    $coordinator = $input['coordinator'];
    $notes = $input['notes'];
    $sql = "INSERT INTO rgd_tracker (region, beneficiaries, distributed_packages, last_distribution, status, coordinator, notes) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('siissss', $region, $beneficiaries, $distributed_packages, $last_distribution, $status, $coordinator, $notes);
    if ($stmt->execute()) {
        echo json_encode(['id' => $stmt->insert_id, 'message' => 'Tracker entry added']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'];
    $region = $input['region'];
    $beneficiaries = $input['beneficiaries'];
    $distributed_packages = $input['distributed_packages'];
    $last_distribution = $input['last_distribution'];
    $status = $input['status'];
    $coordinator = $input['coordinator'];
    $notes = $input['notes'];
    $sql = "UPDATE rgd_tracker SET region = ?, beneficiaries = ?, distributed_packages = ?, last_distribution = ?, status = ?, coordinator = ?, notes = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('siissssi', $region, $beneficiaries, $distributed_packages, $last_distribution, $status, $coordinator, $notes, $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Tracker entry updated']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'];
    $sql = "DELETE FROM rgd_tracker WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Tracker entry deleted']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

closeConnection($conn);
?>
