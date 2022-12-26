const ctx = document.getElementById('myChart');

const labels = [1, 2, 3, 4, 5, 6, 50]
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [1, 2, 3, 4, 5, 6, 100],
      borderColor: "red",
    }
  ]
};


new Chart(ctx, {
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