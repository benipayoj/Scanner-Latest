<?php session_start(); ?>



<style>
  @media screen and (max-width:600px) {
    .row{
      display:none;
    }
  }
   video{
    position:relative;
    width:480px;
    height:360px;
    margin: 1rem; */
    /* transform: translateX(-80%);
    z-index:-1; */
  } 
  .camera_container{
    position: relative;
  }
  .camera_container:before{
    content:attr(data-attach);
    position:absolute;
    top:0;
    left:0;
    padding:10px;
    font-size: 2.5rem;
    background-color:10px;
    text-transform:capitalize;
    font-weight:bold;
    color: white;
    z-index:999;
    background: rgba(0,0,0,0.5)
  }
  #webcam,.img_result,#scanner_webcam{
    visibility: hidden; 
    position: absolute;
    pointer-events:none;

  }

</style>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<head>
    <!-- <link rel="stylesheet" type="text/css" href="./indexstyle.css"> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js" integrity="sha384-mQ93GR66B00ZXjt0YO5KlohRA5SY2XofN4zfuZxLkoj1gXtW8ANNCe9d5Y3eG5eD" crossorigin="anonymous"></script>

    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
    <script src="https://rawgit.com/schmich/instascan-builds/master/instascan.min.js" rel="nofollow"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">
    <!-- jQuery 3 -->
    <!-- <script src="./bower_components/jquery/dist/jquery.min.js"></script> -->
    <!-- Bootstrap 3.3.7 -->
    <!-- <script src="./bower_components/bootstrap/dist/js/bootstrap.min.js"></script> -->
    <!-- Moment JS -->


    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.26/webcam.min.js"></script>
    
    <!-- <script type="module" src="captureImage_v2.js" defer></script> -->

    <script module src="./javascript/index.js" defer></script>
    <!-- <script module src="./javascript/generate_camera.js" defer></script> -->
</head>
<body class=" bg-body-secondary">
 
<script type="text/javascript">

   
    // }, 1000);

</script>
  <div class="container-fluid row">
    <div class="col-md-4 d-flex align-items-center justify-content-center position-relative p-4" style="background:#065280;min-height:100vh">
      <div class=" text-center fs-3 text-light p-4 position-fixed top-0 left-0" >
        <h3 class="fw-bold p-2">COMPUTER BASED FACULTY MONITORING SYSTEM FOR QUEZON CITY UNIVERSITY</h3>
        <div class="container">
          <img src="../public/qcu-logo-2019-1@2x.png" class="m-4" width="200" height="200" class="logo" alt="">
          <hr class="px-4 border-4 rounded-2">
        </div>
        <h3>Good Life Starts Here!</h3>
      </div>
    </div>
    
    <div class="col-md-8 p-4 position-ralative">
      <div class="d-flex justify-content-end align-items-center fs-5 py-3 px-2">
        <span id="date" class="fw-bold "></span><span class="fw-bold" id="time"></span>
        <a href="#=?refresh" class="nav-link" id="sync" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Refresh"><i class="fa-solid fa-rotate fs-5 mx-3" data-bs-toggle="modal" data-bs-target="#refresh"></i></a>
        <a href="#" class="nav-link" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Setting"><i class="fa-solid fa-gear fs-5" data-bs-toggle="modal" data-bs-target="#setting" ></i></a>
      </div> 
      
      <div class="camera-container d-grid justify-content-center position-relative">
        <video id="scanner_camera" class="mx-2" autoplay></video>
        
          <div id="scanner_result_container" class="img_result position-absolute" ></div>
          <div class="p-3 bg-light">
            <div class="form-group">
              <form id="attendance">
                <select class="form-control mb-3" name="status" id="status">
                  <option value="in">Time In</option>
                  <option value="out">Time Out</option>
                </select>
                <div class="form-group mb-3">
                  <input type="password" class="form-control input-lg" id="faculty" name="faculty" required>
                  <input type="hidden" id="deviceId">
                </div>
                <button type="submit" id="subbtn" class="btn fw-bold text-light" style="background: #DCCD60;"  name="signin"><i class="fa fa-sign-in"></i> Submit</button>
                </form>
            </div>
          </div>

          <div class="alert alert-light alert-dismissible justify-content-center text-center  px-3 position-absolute start-50 translate-middle"  id="room_selection" style="display:none;top:60%;min-width:25rem">
              <div class="d-flex justify-content-center align-item-center flex-wrap gap-2 w-100">
                <select class="form-control d-flex align-items-center "  name="Room" id="Room">
                    <option value="" selected>Please select Room</option>
                </select>
                <button type="button" id="open_camera_perRoom" class="btn btn-primary mx-2 w-100 px-2 "> Select Room </button>
                <button type="button" id="cancel" class="btn btn-danger mx-2 w-100 px-2 "> I'll take mine </button>
              </div>
            </div>

            <div class="alert alert-success alert-dismissible text-center position-absolute px-3 align-item-center justify-content-center w-50 start-50 translate-middle"  id="snapShot_container" style="display:none;top:60%;">
                <i class="icon fa fa-circle-check fs-2"></i>
                <div class="result d-grid mb-2"> <span class="message fw-bold"></span></div>
              <button type="button" id="snapShot" class="btn btn-primary fw-bold"> Take a selfie </button>

            </div>

          <div class="alert alert-danger alert-dismissible text-center position-absolute px-3 w-50 justify-content-between align-items-center start-50 translate-middle" style="top:60%;display:none;">
            <div class="result d-grid"><i class="icon fa fa-warning mx-1 fs-3"></i><span class="message fw-bold"></span></div>
            <button type="button" class="close border-0  text-danger bg-transparent position-absolute " style="top:5px;right:5px" data-dismiss="alert" aria-hidden="true"><i class="fa-solid fa-close fw-bold"></i></button>
          </div>  
        </div>

        
        <h3 class="text-center fw-bold fs-3 text-danger py-4"><i class="fa-solid fa-camera"></i> Live Camera</h3>
        <div class="p-4 d-flex flex-wrap justify-content-center align-item-center camera_list"></div>
    </div>

    <!--SETTINGS MODAL-->
    <div class="modal fade" id="setting" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel"><i class="fa-solid fa-gear mx-2" ></i>Settings</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="setting-body">

      <div class="modal-footer">
        <button class="btn btn-primary">Save</button>
        <button class="btn btn-danger"  data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
   
</div>
<div class="modal fade" id="refresh" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalToggleLabel"><i class="fa-solid fa-gear mx-2" ></i>Settings</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" id="setting-body">
       <h3> Are You Sure you want to Refresh ?</h3>
      <div class="modal-footer">
        <button class="btn btn-primary" id="sync_submit">Refresh</button>
        <button class="btn btn-danger"  data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
  </div>

  
           



	<!-- <script type="text/javascript">
   
   document.addEventListener('DOMContentLoaded',function(){
    let video = document.querySelector('#scanner_camera')
    function toTextBox(qrID)
    {
      document.getElementById("faculty").value = qrID.toString();
      document.getElementById("subbtn").click();
    }

    var scanner = new Instascan.Scanner({ video:video, scanPeriod: 5, mirror: false });

    scanner.addListener('scan',function(content){
        console.log(content.toString());
        toTextBox(content.toString());
    });

    Instascan.Camera.getCameras().then(function (cameras){

        let scanner_camera = cameras.splice((cameras.length - 1),1)[0]; //(cameras.length - 1)
        cameras.unshift(scanner_camera)

        if(cameras.length > 0){
            scanner.start(cameras[0]);
            $('[name="options"]').on('change',function(){
                if($(this).val()== 0){
                    if(cameras[1]!=""){
                        scanner.start(cameras[0]);
                    }else{
                        alert('No Front camera found!');
                    }
                }
            });
        }else{
            console.error('No cameras found.');
            alert('No cameras found.');
        }
    }).catch(function(e){
        console.error(e);
        alert(e);
    });

   })

    
		let scanner = new Instascan.scanner({video:  document.getElementById('scanner_camera')});
    let i = 0;
      Instascan.Camera.getCameras().then(function(cameras){
      let scanner_camera = cameras.splice((cameras.length - 1),1)[0]; //instascan index (cameras.length - 1)
      cameras.unshift(scanner_camera)

			if(cameras.length>0)
			{
				scanner.start(cameras[0]);
			}
			else
			{
				alert("no camera Found");
			}

      scanner.addListener('scan',function(c){
			document.getElementById("text").value = c;
		  });
      }).catch(function(e)
		{
			console.error(e);
		});



	</script> -->

	
<script type="text/javascript">

$(function() {
  var interval = setInterval(function() {
    var momentNow = moment();
    $('#date').html(momentNow.format('MMMM DD, YYYY'));  
    $('#time').html(' | ' + momentNow.format('hh:mm:ss A'));
  }, 100);

  $('#attendance').submit(function(e){
    e.preventDefault();
    var attendance = $(this).serialize();

    $.ajax({
      type: 'POST',
      url: 'attendance.php',
      data: attendance,
      dataType: 'json',
      success: function(response){
        if(response.error){
          $('.alert').hide();
          $('.alert-danger').show();
          $('.message').html(response.message);
        }
        else{
          $('.alert').hide();
          $('.alert-success').show();
          $('.message').html(response.message);
          // $('#faculty').val('');
        }
      }
    });
  });
});


</script>


<script>
$(function(){
  $('.edit').click(function(e){
    e.preventDefault();
    $('#edit').modal('show');
    var id = $(this).data('id');
    getRow(id);
  });

  $('.delete').click(function(e){
    e.preventDefault();
    $('#delete').modal('show');
    var id = $(this).data('id');
    getRow(id);
  });
});

function getRow(id){
  $.ajax({
    type: 'POST',
    url: 'attendance_row.php',
    data: {id:id},
    dataType: 'json',
    success: function(response){
      $('#datepicker_edit').val(response.date);
      $('#attendance_date').html(response.date);
      $('#edit_time_in').val(response.time_in);
      $('#edit_time_out').val(response.time_out);
      $('#attid').val(response.attid);
      $('#faculty_name').html(response.faculty_firstname+' '+response.faculty_lastname);
      $('#del_attid').val(response.attid);
      $('#del_faculty_name').html(response.faculty_firstname+' '+response.faculty_lastname);
    }
  });
}

$(document).ready(function(){
			$('#snapShot').click(function(){
				var faculty = $('#faculty').val();
        let attendance = $("#status").val();

				$.ajax({
					url: 'selfieCapture.php',
					type: 'POST',
					data: { faculty: faculty},
					success: function(response){
						
					}
				});
        
        if (attendance !== "out") {
          $("#room_selection").show();
          // $("#faculty").val('')
        } 

        $(this).parent().css("display", "none");
			});
      
      $("#open_camera_perRoom").on('click',function(){
          $(this).parent().parent().hide()
          $("#faculty").val("");
        })
      $("#sync_submit").on('click',function(){
        location.reload();
        })

  
		});

    $('.close').click(function(){
				$(this).parent().css('display','none')
			});
    $('#cancel').click(function(){
				$(this).parent().parent().hide()
			});


</script>


</body>
</html>