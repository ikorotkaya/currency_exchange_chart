const ctx = document.getElementById('myChart');


// Get timeStamps for 2021 year

const getTimeStamps = () => {
  const result = [];

  for (let i = 0; i < 365; i++) {
    let date = new Date("2021-01-01");
    date.setDate(date.getDate() + i);
    result[i] = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
  }
  return result;
}

const labels = getTimeStamps();

// Retrieve USD-EUR currency via a /timeseries endpoint via async/await

async function fetchCurrencyValues() {
  var myHeaders = new Headers();
  myHeaders.append("apikey", "twJXKSiqC9VEUg7WcTotNtEv4vLoySWf");

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders,
    base: 'EUR',
    symbols: 'USD'
  };

  const url = "https://api.apilayer.com/exchangerates_data/timeseries?start_date=2021-01-01&end_date=2021-12-31";
  try {
    const $container = document.querySelector(".chart-container")

    const $img = document.createElement("img");
    $img.src = "spinning_image.gif";
    $img.classList.add("spinner-wait");
    $container.prepend($img);

    const response = await fetch(url, requestOptions)

    const jsondata = await response.json();

    document.querySelector("img").remove();

    return jsondata

  } catch (error) {
    console.log(error);
  }

}

(async () => {

  const $container = document.querySelector(".chart-container");

  const $customSelectMenu = document.createElement("div");
  $customSelectMenu.classList.add("currency-options");
  $container.appendChild($customSelectMenu);

  const createSelectForm = ({ options, defaultOption, jsClass }) => {
    const $selectFrom = document.createElement("select");
    $selectFrom.classList.add("select-options");
    $selectFrom.classList.add(jsClass);
    $customSelectMenu.appendChild($selectFrom);

    for (let i = 0; i < options.length; i++) {
      const $option = document.createElement("option");
      $option.innerHTML = options[i];
      $option.value = options[i];

      if (options[i] === defaultOption) {
        $option.selected = true;
      }

      $selectFrom.appendChild($option);
    }
  }

  let currentCurrencyFrom = "EUR";
  let currentCurrencyTo = "USD";

  const exchangeRates = await fetchCurrencyValues();

  const dailyRates = exchangeRates.rates;

  const currencyList = Object.keys(dailyRates[labels[0]]);

  createSelectForm({
    options: currencyList,
    defaultOption: currentCurrencyFrom,
    jsClass: "js-currency-from"
  });

  createSelectForm({
    options: currencyList,
    defaultOption: currentCurrencyTo,
    jsClass: "js-currency-to"
  });

  const getCurrencyArray = (currencyFrom, currencyTo) => {
    const result = [];

    for (let i = 0; i < labels.length; i++) {
      result[i] = dailyRates[labels[i]][currencyTo] / dailyRates[labels[i]][currencyFrom];
    }
    return result;
  }

  const getChartDataSet = () => {
    const result = [];
    const currencyArray = getCurrencyArray(currentCurrencyFrom, currentCurrencyTo);

    for (let i = 0; i < 365; i++) {
      const point = {};
      point.x = labels[i];
      point.y = currencyArray[i];
      result.push(point);
    }
    return result
  }

  const chartDataSet = getChartDataSet();

  // Chart data

  const data = {
    datasets: [
      {
        label: `from ${currentCurrencyFrom} to ${currentCurrencyTo}`,
        data: chartDataSet,
        borderColor: "red",
      }
    ]
  };

  // New Chart 

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
          text: `Currency Exchange from ${currentCurrencyFrom} to ${currentCurrencyTo}`
        }
      },
      scales: {
        x: {
          type: 'timeseries',
          title: {
            display: true,
          }
        }
      },
    },
  });

  function updateConfigByMutating(chart) {
    chart.options.plugins.title.text = `Currency Exchange from ${currentCurrencyFrom} to ${currentCurrencyTo}`;
    chart.data.datasets = [
      {
        label: `from ${currentCurrencyFrom} to ${currentCurrencyTo}`,
        data: getChartDataSet(),
        borderColor: "red",
      }
    ];
    chart.update();
  }

  const $selectElementFrom = document.querySelector('.js-currency-from');
  const $selectElementTo = document.querySelector('.js-currency-to');

  $selectElementFrom.addEventListener("change", function () {
    currentCurrencyFrom = this.value;
    updateConfigByMutating(currencyExchangeChart);
  })

  $selectElementTo.addEventListener("change", function () {
    currentCurrencyTo = this.value;
    console.log(this.value);
    updateConfigByMutating(currencyExchangeChart);
  })

})()