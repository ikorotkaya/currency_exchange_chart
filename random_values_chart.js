const ctx = document.getElementById('myChart');

const getTimeStamps = () => {
  const result = [];

  for (let i = 0; i < 365; i++) {
    let date = new Date("2022-01-01");
    date.setDate(date.getDate() + i);
    result[i] = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
  }
  return result;
}

const labels = getTimeStamps();


const getRandomArray = () => {
  const result = [];

  for (let i = 0; i < labels.length; i++) {
    result[i] = Math.floor(Math.random() * 100);
  }
  return result;
}


const dataArray = () => {
  const result = [];
  let randomNumbersArray = getRandomArray();

  for (let i = 0; i < 365; i++) {
    const point = {};
    point.x = labels[i];
    point.y = randomNumbersArray[i];
    result.push(point);
  }

  return result
}

const data = {
  datasets: [
    {
      data: dataArray(),
      borderColor: "red",
    }
  ]
};

const currencyExchangeChart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Currency Exchange'
      }
    },
    scales: {
      x: {
        type: 'timeseries',
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
  },
});

const $container = document.querySelector(".chart-container");
const $btn = document.createElement("btn");
$btn.classList.add("change-chart-line");
$btn.innerHTML = "Randomize";
$container.appendChild($btn);


function updateConfigByMutating(chart) {
  chart.options.plugins.title.text = 'new title';
  chart.data.datasets = [
    {
      data: dataArray(),
      borderColor: "red",
    }
  ];
  chart.update();
}

$btn.addEventListener("click", () => {
  updateConfigByMutating(currencyExchangeChart);
})