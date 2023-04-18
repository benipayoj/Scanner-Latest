<?php
session_start();
include 'conn.php';
//     $qr;
if ($_SERVER['REQUEST_METHOD'] == 'POST'){

    $faculty = $_POST['faculty'];
    $sql_1 = "SELECT * FROM faculty WHERE faculty_qr = '$faculty'";
    $query = $conn->query($sql_1);

    if($query->num_rows > 0){
        $srow = $query->fetch_assoc();
        // echo 'Time in: '.$srow['facultyID'].'';
        $facultyID = $srow['facultyID'];

    // $sql = "SELECT *, attendance.id AS uid FROM attendance LEFT JOIN faculty ON faculty.facultyID = attendance.facultyID WHERE attendance.facultyID = '$facultyID' AND date = '$date_now'";
	$sql_2 = "SELECT * FROM attendance WHERE facultyID = '$facultyID'";
	$query = $conn->query($sql_2);

    $row = $query->fetch_assoc();

        $id = $row['id'];
        $faculty_id = $row['facultyID'];

        $tmpName = $_FILES ["webcam"]["tmp_name"];
        $imageName = date ("Y.m.d") . " - " . date("h.i.sa") . ' .jpeg';
        move_uploaded_file ($tmpName, './img/' . $imageName);

        $query = "INSERT INTO  attendance_attachments(attendanceID,facultyID,attachment) VALUES ('$id','$faculty_id','$imageName')";
        // VALUES ('$date', '$imageName')
        $query = $conn->query($query);
        header("Location: index1.php");
    // }

    }
  }
  if(isset($_FILES ["webcam"]["tmp_name"])){

    $tmpName = $_FILES ["webcam"]["tmp_name"];
    $imageName = date ("Y.m.d") . " - " . date("h.i.sa") . ' .jpeg';
    move_uploaded_file ($tmpName, './img/' . $imageName);

  }






?>
