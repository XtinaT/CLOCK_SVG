"use strict";
var form = document.forms.form;
var button = form.elements.button;
button.addEventListener("click", validateForm, false);

function validateForm(e) {
  e = e || window.event;
  try {
    var form = document.forms.form;
    var diametrField = form.elements.diam;
    var diametr = parseInt(diametrField.value);

    if (isNaN(diametr)) {
      var sp = form.getElementsByTagName("span");
      sp[0].style.color = "red";
      sp[0].textContent = "Введите число от 200 до 800";
      e.preventDefault();
    } else if (diametr < 200 || diametr > 800) {
      var sp = form.getElementsByTagName("span");
      sp[0].style.color = "red";
      sp[0].textContent = "Диаметр часов должен быть от 200 до 800 пикселей";
      e.preventDefault();
    } else {
      var sp = form.getElementsByTagName("span");
      sp[0].textContent = null;
      button.removeEventListener("click", validateForm, false);
      buildWatch(diametr);
    }
  } catch (ex) {
    alert("Что-то пошло не так!");
    e.preventDefault();
  }
}

function buildWatch(diametr) {
  form.style.display = "none";
  var body = document.getElementsByTagName("body");
  var radius = diametr / 2;
  var reducedRadius = diametr / 2.5;
  var numbers = 12; //количесвто делений на циферблате
  var unit = 5; //количесвто делений между делениями numbers
  var standartHoursAngle = 360 / numbers; //угол между двумя делениями
  var standartMinutesAngle = 360 / (numbers * unit);
  var standartSecondsAngle = 360 / (numbers * unit);
  var clockCenterX = diametr / 2;
  var clockCenterY = diametr / 2;

  var container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  container.setAttribute("width", diametr);
  container.setAttribute("height", diametr);
  var clock = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  clock.setAttribute("cx", diametr / 2);
  clock.setAttribute("cy", diametr / 2);
  clock.setAttribute("r", radius);
  clock.setAttribute("fill", "#fccb66");
  body[0].appendChild(container);
  container.appendChild(clock);

  var timer = document.createElementNS("http://www.w3.org/2000/svg", "text");
  timer.setAttribute("x", diametr / 3);
  timer.setAttribute("y", diametr / 3);
  timer.style.fontSize = diametr / 10 + "px";
  container.appendChild(timer);

  for (var i = 0; i < numbers; i++) {
    var number = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    number.setAttribute("r", diametr / 15);
    number.setAttribute("fill", "#46b483");
    container.appendChild(number);
    var angle = ((standartHoursAngle * i + standartHoursAngle) / 180) * Math.PI;
    var numberCenterX = clockCenterX + reducedRadius * Math.sin(angle);
    var numberCenterY = clockCenterY - reducedRadius * Math.cos(angle);
    number.setAttribute("cx", numberCenterX);
    number.setAttribute("cy", numberCenterY);

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", numberCenterX);
    text.setAttribute("y", numberCenterY + diametr / 60);
    text.setAttribute("text-anchor", "middle");
    text.style.fontSize = diametr / 12 + "px";
    text.textContent = i + 1;
    container.appendChild(text);
  }

  var hourHand = document.createElementNS("http://www.w3.org/2000/svg", "line");
  hourHand.setAttribute("id", "HH");
  hourHand.setAttribute("stroke-width", diametr / 37);
  hourHand.setAttribute("x1", clockCenterX);
  hourHand.setAttribute("y1", clockCenterY);
  hourHand.setAttribute("x2", clockCenterX);
  hourHand.setAttribute("y2", clockCenterY - diametr / 4);
  hourHand.setAttribute("stroke", "black");
  hourHand.setAttribute("stroke-linecap", "round");
  container.appendChild(hourHand);

  var minuteHand = document.createElementNS("http://www.w3.org/2000/svg", "line");
  minuteHand.setAttribute("id", "MH");
  minuteHand.setAttribute("stroke-width", diametr / 60);
  minuteHand.setAttribute("x1", clockCenterX);
  minuteHand.setAttribute("y1", clockCenterY);
  minuteHand.setAttribute("x2", clockCenterX);
  minuteHand.setAttribute("y2", clockCenterY - diametr / 2.5);
  minuteHand.setAttribute("stroke", "black");
  minuteHand.setAttribute("stroke-linecap", "round");
  container.appendChild(minuteHand);

  var secondHand = document.createElementNS("http://www.w3.org/2000/svg", "line");
  secondHand.setAttribute("id", "SH");
  secondHand.setAttribute("stroke-width", diametr / 130);
  secondHand.setAttribute("x1", clockCenterX);
  secondHand.setAttribute("y1", clockCenterY);
  secondHand.setAttribute("x2", clockCenterX);
  secondHand.setAttribute("y2", clockCenterY - diametr / 2.2);
  secondHand.setAttribute("stroke", "black");
  secondHand.setAttribute("stroke-linecap", "round");
  container.appendChild(secondHand);

  function updateTime() {
    var currTime = new Date();
    timer.textContent = formatTime(currTime);
    function formatTime(dt) {
      var hours = dt.getHours();
      var minutes = dt.getMinutes();
      var seconds = dt.getSeconds();
      var time = str0l(hours, 2) + ":" + str0l(minutes, 2) + ":" + str0l(seconds, 2);
      console.log(time);
      return time;
    }
    function str0l(val, len) {
      var strVal = val.toString();
      while (strVal.length < len) strVal = "0" + strVal;
      return strVal;
    }
  }
  updateTime();

  function setHands() {
    var currTime = new Date();
    var hours = currTime.getHours();
    var minutes = currTime.getMinutes();
    var seconds = currTime.getSeconds();
    var hourHand = document.getElementById("HH");

    var minuteHand = document.getElementById("MH");
    var secondHand = document.getElementById("SH");
    var ratio = standartHoursAngle / 60; //угол поворота часовой стрелки за 1 минуту
    var hoursAngle = standartHoursAngle * hours + ratio * minutes;

    hourHand.setAttribute("transform", `rotate(${hoursAngle} ${clockCenterX} ${clockCenterY})`);

    var minutesAngle = standartMinutesAngle * minutes;
    minuteHand.setAttribute("transform", `rotate(${minutesAngle} ${clockCenterX} ${clockCenterY})`);

    var secondsAngle = standartSecondsAngle * seconds;
    secondHand.setAttribute("transform", `rotate(${secondsAngle} ${clockCenterX} ${clockCenterY})`);
  }

  setHands();
  setInterval(() => {
    updateTime();
    setHands();
  }, 1000);
}
