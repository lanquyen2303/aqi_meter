const firebaseConfig = {
  apiKey: "AIzaSyCU8dUic7lDS4dHTVGAtTggd0w9VirF5wo",
  authDomain: "rtos-2136a.firebaseapp.com",
  databaseURL: "https://rtos-2136a-default-rtdb.firebaseio.com",
  projectId: "rtos-2136a",
  storageBucket: "rtos-2136a.appspot.com",
  messagingSenderId: "751254670688",
  appId: "1:751254670688:web:704d75e7402de83197e205",
  measurementId: "G-HHPYRY4DVT",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//time
function dongho() {
  var date = new Date();
  var gio = date.getHours();
  var phut = date.getMinutes();
  var giay = date.getSeconds();
  var ngay = date.getDate();
  var thang = date.getMonth() + 1;
  var nam = date.getFullYear();

  if (gio < 10) {
    gio = "0" + gio;
  }
  if (phut < 10) {
    phut = "0" + phut;
  }
  if (giay < 10) {
    giay = "0" + giay;
  }
  if (ngay < 10) {
    ngay = "0" + ngay;
  }
  if (thang < 10) {
    thang = "0" + thang;
  }

  document.getElementById("oclock").innerHTML = gio + ":" + phut + ":" + giay;
  document.getElementById("current-time").innerHTML =
    ngay + "/" + thang + "/" + nam;
  setTimeout("dongho()", 1000);
}
dongho();
//temp + humi
const temp1 = document.getElementById("giatrinhietdo1");
const dbTemp1 = firebase.database().ref().child("dht").child("temp");
const humi1 = document.getElementById("giatridoam1");
const dbHumi1 = firebase.database().ref().child("dht").child("humi");

dbTemp1.on("value", (snap) => (temp1.innerText = snap.val() + " °C"));
dbHumi1.on("value", (snap) => (humi1.innerText = snap.val() + " %"));

//pm + Co
const pm = document.getElementById("pm2-value");
const dbpm = firebase.database().ref().child("air").child("pm");
const co = document.getElementById("co-value");
const dbco = firebase.database().ref().child("air").child("co");

// Lắng nghe giá trị PM từ Firebase
dbpm.on("value", (snap) => {
  const pmValue = parseFloat(snap.val()); // Lấy giá trị PM và chuyển đổi thành số
  const pmFormatted = pmValue.toFixed(2); // Định dạng giá trị PM với 2 chữ số thập phân
  pm.innerHTML = pmFormatted + " µg/m³ "; // Cập nhật nội dung với đơn vị
});

// Lắng nghe giá trị CO từ Firebase
dbco.on("value", (snap) => {
  const coValue = parseFloat(snap.val()); // Lấy giá trị CO và chuyển đổi thành số
  const coFormatted = coValue.toFixed(2); // Định dạng giá trị CO với 2 chữ số thập phân
  co.innerHTML = coFormatted + " ppm"; // Cập nhật nội dung với đơn vị
});

//AQI
const aqi = document.getElementById("gia-tri-aqi"); // ID của thẻ hiển thị AQI
const dbaqi = firebase.database().ref().child("air").child("aqi");
const aqiDisplayBox = document.querySelector(".aqi-display-box"); // Thẻ chứa khung AQI

// Lắng nghe giá trị AQI từ Firebase
dbaqi.on("value", (snap) => {
  const aqiValue = snap.val(); // Lấy giá trị AQI
  console.log("AQI: ", aqiValue);
  const aqiFormatted = aqiValue.toFixed(2); // Định dạng giá trị AQI với 2 chữ số thập phân
  setDial(aqiFormatted);
  // aqi.innerText = aqiFormatted; // Cập nhật nội dung với "AQI: " trước giá trị
});

// const temp2 = document.getElementById('giatrinhietdo2');
// const dbTemp2 = firebase.database().ref().child('RTOS').child("sensor2").child("temp");

// dbTemp2.on('value', snap => temp2.innerText = snap.val() + " °C");

// const temp3 = document.getElementById('giatrinhietdo3');
// const dbTemp3 = firebase.database().ref().child('RTOS').child("sensor3").child("temp");

// dbTemp3.on('value', snap => temp3.innerText = snap.val() + " °C");

//
var aqiCoclor = [
  "rgb(0,228,0)",
  "rgb(255,255,0)",
  "rgb(255,126,0)",
  "rgb(255,0,0)",
  "rgb(143,63,151)",
  "rgb(126,0,35)",
];

// Hàm để đặt giá trị dial và màu sắc
function setDial(aqi) {
  let angle = getAQIDialAngle(aqi);
  let [bg, white] = getAQIColor(aqi);

  let meter = document.querySelector(".gauge > div[role=meter]");
  let dial = meter.querySelector(".dial");
  meter.setAttribute("aria-valuenow", aqi);
  meter.setAttribute("aria-valuetext", aqi);
  dial.querySelector(".aqi-num").textContent = aqi; // Cập nhật giá trị AQI trên đồng hồ
  dial.querySelector(".arrow").style.transform = `rotate(${angle - 90}deg)`; // Cập nhật vị trí kim
  dial.style.backgroundColor = bg; // Cập nhật màu nền
  dial.classList.toggle("white", white); // Cập nhật màu chữ
}

// Cập nhật hàm getAQIColor
function getAQIColor(aqi) {
  if (aqi <= 50) {
    return ["rgb(0, 228, 0)", false]; // Màu xanh lá cây
  } else if (aqi <= 100) {
    return ["rgb(255, 255, 0)", false]; // Màu vàng
  } else if (aqi <= 150) {
    return ["rgb(255, 126, 0)", false]; // Màu cam
  } else if (aqi <= 200) {
    return ["rgb(255, 0, 0)", true]; // Màu đỏ
  } else if (aqi <= 300) {
    return ["rgb(143, 63, 151)", true]; // Màu tím
  } else {
    return ["rgb(126, 0, 35)", true]; // Màu đỏ đậm
  }
}

// Các hàm khác không thay đổi
function getAQIDialAngle(aqi) {
  if (aqi >= 301) {
    return Math.min(((aqi - 301) / 200) * 30 + 150, 180);
  } else if (aqi >= 201) {
    return ((aqi - 201) / 100) * 30 + 120;
  } else if (aqi >= 151) {
    return ((aqi - 151) / 50) * 30 + 90;
  } else if (aqi >= 101) {
    return ((aqi - 101) / 50) * 30 + 60;
  } else if (aqi >= 51) {
    return ((aqi - 51) / 50) * 30 + 30;
  } else if (aqi >= 0) {
    return (aqi / 50) * 30;
  } else {
    return 0;
  }
}
