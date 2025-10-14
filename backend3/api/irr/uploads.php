<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM irr_uploads ORDER BY upload_date DESC";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $file_name = $input['file_name'];
    $file_path = $input['file_path'];
    $uploaded_by = $input['uploaded_by'];
    $sql = "INSERT INTO irr_uploads (file_name, file_path, uploaded_by) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sss', $file_name, $file_path, $uploaded_by);
    if ($stmt->execute()) {
        echo json_encode(['id' => $stmt->insert_id, 'message' => 'Upload recorded']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

closeConnection($conn);
?>
