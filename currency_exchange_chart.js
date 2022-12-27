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
    const response = await fetch(url, requestOptions)
    const jsondata = await response.json();
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

  const createSelectForm = (optionValues, defaultValue) => {
    const $selectFrom = document.createElement("select");
    $selectFrom.classList.add("select-options");
    $customSelectMenu.appendChild($selectFrom);

    for (let i = 0; i < optionValues.length; i++) {
      const $option = document.createElement("option");
      $option.innerHTML = optionValues[i];
      $option.value = optionValues[i];

      if (optionValues[i] === defaultValue) {
        $option.selected = true;
      }

      $selectFrom.appendChild($option);
    }
  }

  let currentCurrencyFrom = "EUR";
  let currentCurrencyTo = "USD";

  const optionValueOne = ["EUR", "USD", "GBP"];
  const optionValueTwo = ["EUR", "USD", "GBP"];
  createSelectForm(optionValueOne, currentCurrencyFrom);
  createSelectForm(optionValueTwo, currentCurrencyTo);

  const exchangeRates = await fetchCurrencyValues();

  const dailyRates = exchangeRates.rates;

  const getCurrencyArray = (currencyFrom, currencyTo) => {
    const result = [];

    for (let i = 0; i < labels.length; i++) {
      result[i] = dailyRates[labels[i]][currencyTo] / dailyRates[labels[i]][currencyFrom];
    }
    return result;
  }

  const currencyArray = getCurrencyArray(currentCurrencyFrom, currentCurrencyTo);

  const getChartDataSet = () => {
    const result = [];

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



})()