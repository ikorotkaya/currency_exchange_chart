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
    const obj = await response.json();
    return obj

  } catch (error) {
    console.log(error);
  }

}

(async () => {
  const exchangeRates = await fetchCurrencyValues();

  const dailyRates = exchangeRates.rates;

  const getCurrencyArray = () => {
    const result = [];

    for (let i = 0; i < labels.length; i++) {
      result[i] = dailyRates[labels[i]]["USD"];
    }
    return result
  }

  const currencyArray = getCurrencyArray();

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