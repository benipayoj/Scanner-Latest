<?php 
	include 'includes/session.php';

	if(isset($_POST['id'])){
		$id = $_POST['id'];
		$sql = "SELECT *, faculty.id AS empid FROM faculty LEFT JOIN schedules ON schedules.id=faculty.schedule_id WHERE faculty.id = '$id'";
		$query = $conn->query($sql);
		$row = $query->fetch_assoc();

		echo json_encode($row);
	}
?>