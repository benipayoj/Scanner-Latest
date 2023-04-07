<?php
if(isset($_POST['sync_room'])){

	include 'conn.php';
    // $candidate_name = $_POST['candidate_name'];
    
    $result = mysqli_query($conn,"SELECT * FROM room_db");
    $data = array();
    while ($row = mysqli_fetch_object($result)) {
        $data[]= $row;     // print_r($row);
     }
     $encode_data = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
     file_put_contents('rooms.json',$encode_data);
    }
?>