<?php
header('Content-Type: application/json');
include 'db.php';

$sql = "UPDATE visit_counter SET count = count + 1 WHERE id = 1";
$conn->query($sql);

$result = $conn->query("SELECT count FROM visit_counter WHERE id = 1");
$row = $result->fetch_assoc();

echo json_encode(["visits" => $row["count"]]);
?>
