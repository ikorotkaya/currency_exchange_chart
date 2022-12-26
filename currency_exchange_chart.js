const ctx = document.getElementById('myChart');

const labels = Array.from({ length: 365 }, (_, i) => i + 1);

const getRandomArray = () => {
  const result = [];

  for (let i = 0; i < labels.length; i++) {
    result[i] = Math.floor(Math.random() * 100);
  }
  return result;
}

let randomNumbersArray = getRandomArray();

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: randomNumbersArray,
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
        type: 'linear',
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
  randomNumbersArray = getRandomArray();
  chart.data.datasets = [
    {
      label: 'Dataset 1',
      data: randomNumbersArray,
      borderColor: "red",
    }
  ];
  chart.update();
}

$btn.addEventListener("click", () => {
  updateConfigByMutating(currencyExchangeChart);
})