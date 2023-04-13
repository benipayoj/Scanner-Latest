// function attach_webcam_2() {
//   var constraints2 = {
//     deviceId: { exact: devices_arr[1].deviceId }, //intergrated Camera deviceId
//   };

//   Webcam.set({ constraints: constraints2 });
//   Webcam.attach("#my_camera2");
//   $("#my_camera2 video").attr("id", "camera2");
// }
const date = new Date();
const currentDay = new Intl.DateTimeFormat("en-us", {
  dateStyle: "medium",
});
const currentTime = new Intl.DateTimeFormat("en-us", {
  timeStyle: "short",
});

//function that attach webcam container
function create_stream(camera_id, camera_className, index, faculty_qr) {
  let camera_container = document.createElement("div");
  let attach_camera = document.createElement("video");
  let img_result = document.createElement("div");

  Object.assign(attach_camera, {
    id: camera_id,
    className: camera_className,
    autoplay: 1,
  });

  Object.assign(camera_container, {
    className: `camera_container container${index}-container`,
  });
  camera_container.setAttribute("data-attach", `camera ${index}`);
  camera_container.setAttribute("data-faculty", faculty_qr);

  Object.assign(img_result, {
    id: `results_container_${index}`,
    className: "img_result",
  });

  camera_container.append(attach_camera);
  camera_container.append(img_result);
  document.querySelector(".camera_list").append(camera_container);
}

// Attach Webcam to the video_container
function attach_webcam(deviceId, index) {
  let camera = document.querySelector(`#my_camera_${index}`);

  var camera_constraints = {
    video: { deviceId: { exact: deviceId } },
  };

  navigator.mediaDevices
    .getUserMedia(camera_constraints)
    .then(function (stream) {
      camera.srcObject = stream;
      camera.play();
    })
    .catch(function (error) {
      console.log(error);
    });
}

//function for capturing the image in the scanner_camera
function scanner_snap() {
  let time_created = currentTime.format(date);
  let date_created = currentDay.format(date);
  let faculty_qr = $("#faculty").val();
  // Your code that uses Webcam.js goes here
  var canvas = document.createElement("canvas");

  let data_time = `${date_created}  :  ${time_created}`;
  canvas.width = video1.videoWidth;
  canvas.height = video1.videoHeight;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(video1, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(data_time, 20, 40);

  var dataUrl_1 = canvas.toDataURL();
  document.querySelector("#scanner_result_container").innerHTML =
    '<img id= "scanner_webcam" src = "' + dataUrl_1 + '">';

  var image_1 = document.querySelector("#scanner_webcam").src;
  Webcam.upload(image_1, "selfieCapture.php", function (code, text) {});
}

const snap_button = document.querySelector("#snapShot"); //button for capturing the image in scanner camera
const autocapture_button = document.querySelector("#autocapture_button"); //button for capturing the image in scanner camera
var video1 = document.querySelector("#scanner_camera");

navigator.mediaDevices.enumerateDevices().then(function (devices) {
  let devices_arr = [];

  devices.forEach(function (device) {
    if (device.kind === "videoinput") {
      devices_arr.push(device);
    }
  });

  //log the available camera
  // console.log(devices_arr);
  //unshift the built-in camera as the first index of array devices_arr
  let scanner = devices_arr.splice(devices_arr.length - 1, 1)[0];
  devices_arr.unshift(scanner);

  const get_cameraList = new Promise((resolve, reject) => {
    fetch("rooms.json")
      .then((response) => response.json())
      .then((data) => {
        devices_arr.forEach((element, index) => {
          element.parameter = data[index].room_name;
          const { parameter, deviceId } = element;

          if (element.parameter !== "scanner") {
            const options = document.createElement("option");
            options.innerText += parameter;
            options.value = deviceId;
            $("#Room").append(options);
          }
          resolve(devices_arr);
        });
      });
  });

  var constraints1 = {
    video: { deviceId: { exact: devices_arr[0].deviceId } },
  };

  navigator.mediaDevices
    .getUserMedia(constraints1)
    .then(function (stream) {
      video1.srcObject = stream;
      video1.play();
    })
    .catch(function (error) {
      console.log(error);
    });

  snap_button.addEventListener("click", function () {
    let attendance = $("#status").val();
    if (attendance === "out") {
      scanner_snap();
    } else {
      scanner_snap();
      $("#room_selection").show();
    }
    $(this).parent().css("display", "none");
  });

  get_cameraList.then(() => {
    const open_camera = document.querySelector("#open_camera_perRoom");
    open_camera.addEventListener("click", open_selected_camera);

    let index = 0;
    let available_camera = [];
    let used_camera = [];

    devices_arr.forEach((device) => {
      if (device.parameter !== "scanner") {
        available_camera.push(device);
      }
    });

    async function open_selected_camera(e) {
      e.preventDefault();
      let deviceId = $("#Room").val();

      console.log(deviceId);
      // index++;
      let faculty_qr = $("#faculty").val();

      if ((available_camera.length = 0)) {
        alert("No Device Available");
      } else {
        if (deviceId === "") {
          alert("Please select a room");
          return;
        } else {
          index++;
          create_stream(`my_camera_${index}`, "camera", index, faculty_qr);
          attach_webcam(deviceId, index);
          $(".alert").hide();
          $("#faculty").val("");
        }
      }

      let online_camera = document.querySelector(`#my_camera_${index}`);
      camera_autoCapture(`#results_container_${index}`, online_camera).then(
        () => {
          index--;
        }
      );
    }
  });
});

function camera_autoCapture(img_container, camera) {
  return new Promise((resolve) => {
    function autoCapture_camera(img_container) {
      var canvas = document.createElement("canvas");

      let time_created = currentTime.format(date);
      let date_created = currentDay.format(date);
      // Your code that uses Webcam.js goes here
      var canvas = document.createElement("canvas");

      let data_time = `${date_created}  :  ${time_created}`;
      canvas.width = camera.videoWidth;
      canvas.height = camera.videoHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(data_time, 20, 40);

      var dataUrl = canvas.toDataURL();
      document.querySelector(img_container).innerHTML =
        '<img id= "webcam" src = "' + dataUrl + '">';

      var image_1 = document.querySelector("#webcam").src;
      Webcam.upload(image_1, "selfieCapture.php", function (code, text) {});
    }

    function remove_finished_container(img_container) {
      const parent_container = $(`${img_container}`).parent().parent();
      $(parent_container).html("");
    }

    function post() {
      let faculty_qr = $(camera).parent().attr("data-faculty");
      $.ajax({
        url: "selfieCapture.php",
        type: "POST",
        data: { faculty: faculty_qr },
        success: function (response) {
          // $('#qr_container').html(response);
        },
      });
    }

    let time = "";
    let gracePeriod = 15;
    for (let i = 0; i < 10; i++) {
      var randNum = Math.floor(Math.random() * 10) + 1;
    }
    time = `${randNum + gracePeriod}000`;
    var timeout = `${randNum + gracePeriod}400`;

    const autoCapture = setInterval(() => {
      autoCapture_camera(img_container);
      post();
    }, time);

    setTimeout(() => {
      remove_finished_container(img_container);
      clearInterval(autoCapture);
    }, timeout);

    resolve(autoCapture);
  });
}
