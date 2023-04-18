const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

const APIController = (function () {
  const _storeCamera_info = (async () => {
    const results = await navigator.mediaDevices.enumerateDevices();
    const devices_arr = [];
    // const available_camera = [];

    results.forEach((result) => {
      if (result.kind === "videoinput") {
        devices_arr.push(result);
      }
    });
    console.log(devices_arr);
    return devices_arr;
  })();
  const _pairing_device = async (deviceInfo, Rooms) => {
    const available_camera = [];
    deviceInfo.forEach((info, index) => {
      info.parameter = Rooms[index].room_name;
      const { parameter, deviceId, label } = info;
      const devices = {
        parameter: parameter,
        deviceId: deviceId,
        label: label,
      };
      available_camera.push(devices);
    });
    return available_camera;
  };

  const _fetch_pairedDevice = async () => {
    try {
      const result = await fetch("./paired_devices.json?" + Date.now(), {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await result.json();
      return data;
    } catch (error) {
      console.log("Please refresh the Page");
    }
  };
  const _fetch_rooms = async () => {
    try {
      const result = await fetch("./rooms.json?" + Date.now(), {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await result.json();
      return data;
    } catch (error) {
      console.log("please Refresh the page");
    }
  };

  const _storeInfo = async (data) => {
    $.ajax({
      method: "POST",
      url: "fetchRoomList.php",
      data: { paired_devices: 1, devices: data },
    });
  };

  const _getRooms = async () => {
    $.ajax({
      method: "POST",
      url: "fetchRoomList.php",
      data: { sync_room: 1 },
    });
  };
  const _scanner = async (camera) => {
    let video = document.querySelector("#scanner_camera");

    const scanner = new Instascan.Scanner({
      video: video,
      scanPeriod: 5,
      mirror: false,
    });

    const webcam = await Instascan.Camera.getCameras();

    webcam.forEach(async (cam) => {
      // console.log(cam.id);
      if (cam.id === camera) {
        if (webcam.length > 0) {
          await scanner.start(cam);
        } else {
          alert("No Camera Found");
        }
      }
    });
    return scanner;
  };

  // const _scanner_webcam = async (deviceId) => {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     var constraints = {
  //       video: {
  //         deviceId: {
  //           exact: deviceId,
  //         },
  //       },
  //     };

  //     var video = document.querySelector("#scanner_camera");

  //     // navigator.mediaDevices
  //     //   .getUserMedia(constraints)
  //     //   .then((stream) => {
  //     //     video.srcObject = stream;
  //     //     // video.play();
  //     //   })
  //     //   .catch(function (error) {
  //     //     console.log(error);
  //     //   });
  //   } else {
  //     console.error("getUserMedia is not supported in this browser");
  //   }
  // };
  const _room_webcam = async (constraints, video) => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (error) {
        console.log(constraints);
        console.log(error);
      });
  };
  const _sendAttendance = async () => {
    $("#attendance").submit(function (e) {
      e.preventDefault();
      var attendance = $(this).serialize();

      $.ajax({
        type: "POST",
        url: "attendance.php",
        data: attendance,
        dataType: "json",
        success: function (response) {
          console.log(response);
          if (response.error) {
            $(".alert").hide();
            $(".alert-danger").show();
            $(".message").html(response.message);
          } else {
            $(".alert").hide();
            $(".alert-success").show();
            $(".message").html(response.message);
            // $('#faculty').val('');
          }
        },
        catch:((err)=>{
          console.log(err.message);
        })
      });
    });
  };
  const _config_setting = async (parameter, label, deviceId) => {
    // const details = [];
    const info = {
      parameter: parameter,
      deviceId: deviceId,
      label: label,
    };
    // details.push(info);
    console.log("my new info", info);
    return info;
  };

  return {
    pairingDevice(deviceInfo, Rooms) {
      return _pairing_device(deviceInfo, Rooms);
    },
    store_pairedDevice(data) {
      return _storeInfo(data);
    },
    fetch_pairedDevice() {
      return _fetch_pairedDevice();
    },
    fetch_rooms() {
      return _fetch_rooms();
    },
    getRooms() {
      return _getRooms();
    },

    storeCamera_info() {
      return _storeCamera_info;
    },
    // scanner_webcam(deviceId) {
    //   return _scanner_webcam(deviceId);
    // },
    scanner(camera) {
      return _scanner(camera);
    },
    room_webcam(constraints, video) {
      return _room_webcam(constraints, video);
    },
    sendAttendance() {
      return _sendAttendance();
    },
    config_setting(parameter, label, deviceId) {
      return _config_setting(parameter, label, deviceId);
    },
    new_pairDevice(item){
      return _new_PairDevice(item);
    }
  };
})();

// console.log(devices_list);
const UIController = (function (APICtrl) {
  const DomElement = {
    scanner_video: "#scanner_camera",
    scanner_container: ".camera-container",
    selfieCapture_button: "#snapShot",
    selfieCapture_container: "#snapShot_container",
    mainCamera_image_result: "#scanner_result_container",
    room_option: "#Room",
    room_cameras: ".camera_list",
    open_camera: "#open_camera_perRoom",
    deviceId: "#deviceId",
    faculty_input: "#faculty",
    attendance_input: "#status",
    sync: "#sync_submit",
    closeModal: ".close",
    setting_container: "#setting-container",
    setting: "#setting-body",
    setting_submit: "#save-settings",
  };
  const timeFormat = {
    date: () => {
      const date = new Date();
      return date;
    },
    currentDay: new Intl.DateTimeFormat("en-ph", {
      dateStyle: "medium",
      timeZone: "Asia/Manila",
    }),
    currentTime: new Intl.DateTimeFormat("en-ph", {
      timeStyle: "short",
      timeZone: "Asia/Manila",
    }),
  };
  return {
    tags() {
      return {
        video: document.querySelector(DomElement.scanner_video),

        setting: document.querySelector(DomElement.setting),
        image_result: document.querySelector(
          DomElement.mainCamera_image_result
        ),
        setting_container: document.querySelector(DomElement.setting_container),
      };
    },
    inputField() {
      return {
        faculty_qr: document.querySelector(DomElement.faculty_input).value,
        attendance_status: document.querySelector(DomElement.attendance_input)
          .value,
        room_options: document.querySelector(DomElement.room_option),
      };
    },
    button() {
      return {
        selfie_button: document.querySelector(DomElement.selfieCapture_button),
        open_camera: document.querySelector(DomElement.open_camera),
        sync_camera: document.querySelector(DomElement.sync),
        save_setting: document.querySelector(DomElement.setting_submit),
      };
    },

    room_option(text, value) {
      const html = `<option value ='${value}'>${text}</option>`;
      document
        .querySelector(DomElement.room_option)
        .insertAdjacentHTML("beforeend", html);
    },

    room_camera_container(index, faculty_qr, room_num) {
      const html = `<div id="${room_num}">
                  <video id="scanner_camera_${index}" data-faculty="${faculty_qr}"  data-attach="camera ${index}" class="mx-2" autoplay></video>
                  <div id="result_container_${index}" class="img_result" ></div>
                  </div>`;
      document
        .querySelector(DomElement.room_cameras)
        .insertAdjacentHTML("beforeend", html);
    },

    room_camera(index, deviceId) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        var constraints = {
          video: {
            deviceId: {
              exact: deviceId,
            },
          },
        };
        // console.log(constraints_1.deviceId);
        var video = document.querySelector(
          `${DomElement.scanner_video}_${index}`
        );
        APICtrl.room_webcam(constraints, video);
      } else {
        console.error("getUserMedia is not supported in this browser");
      }
    },

    setting(room_name, index) {
      const html = `<div class="d-flex justify-content-between align-items-center mb-3">
      <div> <span class="fw-semibold">Parameter : </span> <span id="room_name">${room_name}</span></div>
      <input type="hidden" id="setting-input">
        <div id="setting-container">
        <select class="form-select" aria-label="Default select example" id="setting-body_${index}">
        <option selected>Open this select menu</option>

       </select>
        </div>
      </div>`;
      document
        .querySelector(DomElement.setting)
        .insertAdjacentHTML("afterbegin", html);
    },

    generate_image(img_parent, img_id, video_selector) {
      let time_created = timeFormat.currentTime.format(timeFormat.date());
      let date_created = timeFormat.currentDay.format(timeFormat.date());

      var canvas = document.createElement("canvas");
      let data_time = `${date_created}  :  ${time_created}`;

      const video = document.querySelector(video_selector);

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(data_time, 20, 40);
      var dataUrl_1 = canvas.toDataURL();

      document.querySelector(img_parent).innerHTML =
        '<img id= "' + img_id + '" src = "' + dataUrl_1 + '">';

      var image_1 = document.querySelector(`#${img_id}`).src;

      Webcam.upload(image_1, "./selfieCapture.php", function (code, text) {});
    },
    storeDevideId(value) {
      document.querySelector(DomElement.deviceId).value = value;
    },
    getdeviceId() {
      return {
        id: document.querySelector(DomElement.deviceId).value,
      };
    },
    toTextBox(qrID) {
      document.getElementById("faculty").value = qrID.toString();
      document.getElementById("subbtn").click();
    },
  };
})(APIController);

const APPController = (function (APICtrl, UICtrl) {
  const DomCtrl = UICtrl.button();
  const DomInputs = UICtrl.inputField();

  let index = 0;

  //fetch room from database and store it to a json file
  const fetch_rooms = () => {
    APICtrl.fetch_rooms();
  };

  const UInterface = async () => {
    const paired_Device = await APICtrl.fetch_pairedDevice();

    console.log(paired_Device);
    //select device-deviceId from local json file generated device info
    paired_Device.forEach(async (device) => {
      if (device.parameter === "scanner") {
        // console.log(device);
        // await APICtrl.scanner_webcam(device.deviceId);
        const scan = await APICtrl.scanner(device.deviceId);
        scan.addListener("scan", async (content) => {
          UICtrl.toTextBox(content.toString());
        });
      }
    });

    //select device parameter and deviceId from browser generated device info
    const new_setting = [];

    paired_Device.forEach((device, index) => {
      console.log(device.parameter);
      if (device.parameter !== "scanner") {
        UICtrl.room_option(device.parameter, device.deviceId);
      }
      UICtrl.setting(device.parameter, index);

      const setting_select = document.getElementById("setting-body_" + index);

      
      setting_select.addEventListener("change", async function () {
        
        const input = $(this).parent().parent().children("input");
        const label = $(this).children("option:selected").text();
        const deviceId = $(input).val(this.value);
        const id = $(deviceId).val()
        
        const info = await APICtrl.config_setting(device.parameter,label ,id);
        new_setting.push(info)

    
      }); 



    });

    DomCtrl.save_setting.addEventListener('click',async()=>{
      try {
        await APICtrl.store_pairedDevice(new_setting)
        location.reload();
      } catch (error) {
        console.error(error);
      }
      
    })

    for (var i = 0; i < paired_Device.length; i++) {
      // Create a select element

      // Append select element to container
      var selectContainer = document.getElementById("setting-body_" + i);
      

      // Append options to the select element
      for (var j = 0; j < paired_Device.length; j++) {
        var option = document.createElement("option");
        option.text = paired_Device[j].label;
        option.value = paired_Device[j].deviceId;
        selectContainer.add(option);

      }
      

    }
    await APICtrl.sendAttendance();
  };

  const autoCapture_timer = (index) => {
    return new Promise(() => {
      let time = "";
      let gracePeriod = 15;
      for (let i = 0; i < 10; i++) {
        var randNum = Math.floor(Math.random() * 10) + 1;
      }

      time = `${randNum + gracePeriod}000`;
      var timeout = `${randNum + gracePeriod}400`;

      const autoCapture = setInterval(() => {
        UICtrl.generate_image(
          `#result_container_${index}`,
          "webcam",
          `#scanner_camera_${index}`
        );
        send_facultyQr();
      }, time);

      setTimeout(() => {
        remove_finished_container(index);
        clearInterval(autoCapture);
      }, timeout);

      function remove_finished_container(index) {
        var parent = document.querySelector(".camera_list");
        var child = document.querySelector(`#room_num_${index}`);
        if (parent && child) {
          parent.removeChild(child);
        } else {
          console.log("Parent or child element not found.");
        }
      }

      function send_facultyQr() {
        const faculty_qr = document
          .querySelector(`#scanner_camera_${index}`)
          .getAttribute("data-faculty");
        $.ajax({
          url: "selfieCapture.php",
          type: "POST",
          data: { faculty: faculty_qr },
        });
      }
    });
  };


  DomCtrl.selfie_button.addEventListener("click", async (e) => {
    e.preventDefault();
    const img_id = "scanner_image";
    if (DomInputs.attendance_status === "out") {
      UICtrl.generate_image(
        "#scanner_result_container",
        img_id,
        "#scanner_camera"
      );
    } else {
      UICtrl.generate_image(
        "#scanner_result_container",
        img_id,
        "#scanner_camera"
      );
    }
  });

  DomCtrl.sync_camera.addEventListener("click", async () => {
    //get Webcams Details
    const webcams_info = await APICtrl.storeCamera_info();
    //get Room Details
    const rooms_detail = await APICtrl.fetch_rooms();
    //pairedDevice and Rooms
    const pairedDevice = await APICtrl.pairingDevice(
      webcams_info,
      rooms_detail
    );
    await APICtrl.store_pairedDevice(pairedDevice); //send info to fetchRoomList.php
  });

  DomCtrl.open_camera.addEventListener("click", async function () {
    const faculty_qr = document.querySelector("#faculty").value;

    let deviceId = UICtrl.getdeviceId().id;
    if (deviceId === "") {
      alert("Please Select a Room");
      return;
    } else {
      index++;
      //generate webcam video container
      UICtrl.room_camera_container(index, faculty_qr, `room_num_${index}`);
      //set webcam visaul
      UICtrl.room_camera(index, deviceId);
    }
    autoCapture_timer(index).then((index) => {
      index--;
    });
  });

  DomInputs.room_options.addEventListener("change", function (e) {
    e.preventDefault();
    UICtrl.storeDevideId(this.value);
  });

  return {
    init() {
      fetch_rooms();
      UInterface();
    },
  };
})(APIController, UIController);

APPController.init();
