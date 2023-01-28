const wheelHTML = `<div class="wheel_main" id="wheelMain">
<div class="wheel_inner">
  <div id="wheel_modal">
    <button id="close_btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-x"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <canvas id="wheel"></canvas>
    <div class="wheel_result">
      <div class="spin_area">
        <button id="spin_btn">Çevir</button>
      </div>
      <div class="wheel_result_iner">
        <input
          type="text"
          id="wheel_result"
          readonly
          placeholder="XXXXXX"
        />
        <button id="copy_btn">Kopyala</button>
      </div>
    </div>
  </div>
</div>
</div>`;
const wheelButtonHTML = `<div id="wheel_open_btn">
<img src="https://web-tools-sw.s3.eu-west-3.amazonaws.com/wheel/wheelIcon.gif" alt="wheel" class="wheel_open_img" />
</div>`;

const wheelFirstHTML = `<div class="wheel_main" id="wheelMain">
<div class="wheel_inner">
  <div id="wheel_modal">
    <button id="close_btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-x"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="wheel_form">
    <h2 class="wheel_form_title">Çarkı Çevirmek için E-Posta ve Telefon numaranızı girmelisiniz.</h2>
    <form action="" class="wheel_form_form">
      <div class="wheel_form_form_group">
        <label for="email" class="wheel_form_form_label">E-Posta</label>
        <input type="email" id="email" class="wheel_form_form_input" />
      </div>
      <div class="wheel_form_form_group">
        <label for="phone" class="wheel_form_form_label">Telefon</label>
        <input type="text" id="phone" class="wheel_form_form_input" />
      </div>
      <div class="wheel_form_form_group_check">
      <input type="checkbox" id="wheel_form_form_checkbox" class="wheel_form_form_checkbox" />
      <a href="https://www.google.com" class="wheel_form_form_checkbox_label">Kullanıcı Sözleşmesi okudum ve kabul ediyorum.</a>
        </div>
      <div class="continue_area">
          <button id="continue_btn">Devam Et</button>
        </div>
      </form>
    </div> </div> </div>
    `;

const fetchWheelData = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/wheel/63cba65e0fff48122356bd56",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return response.json();
    }
  } catch (error) {
    console.log(error);
  }
};

fetchWheelData().then((wheelData) => {
  document.body.insertAdjacentHTML("beforeend", wheelButtonHTML);
  if (localStorage.getItem("wheelFirst") === null) {
    document.body.insertAdjacentHTML("beforeend", wheelFirstHTML);
    const formEmail = document.getElementById("email");
    const formPhone = document.getElementById("phone");
    const formCheckbox = document.getElementById("wheel_form_form_checkbox");
    const continueBtn = document.getElementById("continue_btn");

    continueBtn.addEventListener("click", () => {
      if (formEmail.value === "" || formPhone.value === "") {
         alert("Lütfen E-Posta ve Telefon numaranızı giriniz.");
      } else if (!formCheckbox.checked) {
          alert("Kullanıcı Sözleşmesini kabul etmelisiniz.");
      } else {
        localStorage.setItem("wheelFirst", { email: formEmail.value, phone: formPhone.value });
        document.body.insertAdjacentHTML("beforeend", wheelHTML);
        const wheel = document.getElementById("wheel");
        wheel.style.display = "block";
      }
    });
  }
  document.body.insertAdjacentHTML("beforeend", wheelHTML);
  const wheel = document.getElementById("wheel");
  const spinBtn = document.getElementById("spin_btn");
  const finalValue = document.getElementById("wheel_result");
  const closeBtn = document.getElementById("close_btn");
  const wheelMain = document.getElementById("wheelMain");
  const copyBtn = document.getElementById("copy_btn");
  const wheelOpenBtn = document.getElementById("wheel_open_btn");

  closeBtn.addEventListener("click", () => {
    wheelMain.style.display = "none";
  });

  wheelOpenBtn.addEventListener("click", () => {
    wheelMain.style.display = "block";
  });

  if (!wheelData) {
    return;
  }
  let data = [];
  const color = wheelData.map((data) => data.color);

  for (let i = 0; i < wheelData.length; i++) {
    data.push(1);
  }

  //Create chart

  let myChart = new Chart(wheel, {
    //Plugin for displaying text on pie chart
    plugins: [ChartDataLabels],
    //Chart Type Pie
    type: "pie",
    data: {
      //Labels(values which are to be displayed on chart)
      labels: wheelData.map((data) => data.coupon),
      //Settings for dataset/pie
      datasets: [
        {
          backgroundColor: color,
          data: data,
        },
      ],
    },
    options: {
      //Responsive chart
      responsive: true,
      animation: { duration: 0, easing: "linear", delay: 5 },
      plugins: {
        //hide tooltip and legend
        tooltip: true,
        legend: {
          display: false,
        },
        //display labels inside pie chart
        datalabels: {
          color: "#ffffff",
          formatter: (_, context) =>
            context.chart.data.labels[context.dataIndex],
          font: { size: 24 },
        },
      },
    },
  });

  const copyToClipboard = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  copyBtn.addEventListener("click", () => {
    copyToClipboard(finalValue.value);
    copyBtn.innerHTML = "Kopyalandı!";
    setTimeout(() => {
      copyBtn.innerHTML = "Kopyala";
    }, 2000);
  });
  const valueGenerator = () => {
    spinBtn.disabled = false;

    const expanded = wheelData.flatMap((incData) =>
      Array(incData.percentage).fill(incData)
    );
    const random = expanded[Math.floor(Math.random() * expanded.length)];
    finalValue.value = random.coupon;
    spinBtn.style.pointerEvents = "none";
    spinBtn.style.opacity = "0.5";
  };

  let count = 0;

  let resultValue = 101;

  spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    finalValue.value = "İyi şanslar!";
    let randomDegree = Math.floor(Math.random() * (255 - 0 + 1) + 0);
    let rotationInterval = window.setInterval(() => {
      myChart.options.rotation = myChart.options.rotation + resultValue;

      myChart.update();
      //If rotation>360 reset it back to 0
      if (myChart.options.rotation >= 360) {
        count += 1;
        resultValue -= 5;
        myChart.options.rotation = 0;
      } else if (count > 15 && myChart.options.rotation == randomDegree) {
        valueGenerator(randomDegree);
        clearInterval(rotationInterval);
        count = 0;
        resultValue = 101;
      }
    }, 10);
  });
});
