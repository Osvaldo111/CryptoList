/**
 * Initialize the app
 */
function init() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  /**Initializing */
  requestToAPI(url)
    .then(data => displayData(data))
    .then(() => lastUpdate());

  /**Updating the table */
  setInterval(function() {
    requestToAPI(url)
      .then(data => displayData(data))
      .then(() => lastUpdate())
      .catch(error => console.log(error));
  }, 10000);
}
init();

/**
 * Erase the previous data from the table
 */
// function erasePreviousData() {
//   var tableRows = document.getElementById("table").rows.length;
//   var tableParent = document.getElementById("table-content");
//   tableParent.innerHTML = "";
//   if (tableRows > 1) {
//     console.log("Entertinf the if ", tableRows);
//     do {
//       tableRows--;
//       tableParent.deleteRow(tableRows);
//     } while (tableRows > 1);
//   }
// }
/**
 * LastUpdate
 */
function lastUpdate() {
  var updateDate = document.getElementById("lastUpdate");

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    "Time: " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();

  var currentDateInfo = date + " " + time + "UTC";

  // Make a Clone of the Node.
  var cloneUpdateDate = updateDate.cloneNode(true);
  cloneUpdateDate.innerHTML = currentDateInfo;

  // Reinsert the node to trigger the animation.
  document.getElementById("time").replaceChild(cloneUpdateDate, updateDate);
  console.log(date, "*******", time);
}
/**
 * Request to the CoinGecko API.
 * Promisify the request to avoid using
 * callbacks.
 * @param {String} url
 */
function requestToAPI(url) {
  return new Promise(function(resolve, reject) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var arrResponse = JSON.parse(this.responseText);
        resolve(arrResponse);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  });
}

/**
 * Format and display the data on the table
 */
function displayData(data) {
  var fragment = new DocumentFragment();

  var tableBody = document.getElementById("table-content");

  for (let index = 0; index < data.length; index++) {
    // Create the row
    var parentTr = document.createElement("tr");

    // Append the Rank id to the row
    var rankTd = document.createElement("td");
    rankTd.append(data[index].market_cap_rank);
    parentTr.append(rankTd);
    fragment.append(parentTr);

    // Append data to the coin row
    var coin = document.createElement("td");
    // Image
    var coinImage = document.createElement("img");
    coinImage.src = data[index].image;
    coinImage.className = "coinImage";
    coin.append(coinImage);
    // Coin Name
    var coinName = document.createElement("span");
    var coinNameData = data[index].id;
    var coinNameFormat =
      coinNameData.charAt(0).toUpperCase() + coinNameData.slice(1);
    coinName.append(coinNameFormat);
    coin.append(coinName);
    parentTr.append(coin);
    // Coin Symbol
    var coinSymbol = document.createElement("span");
    coinSymbol.append(data[index].symbol.toUpperCase());
    coin.append(coinSymbol);
    parentTr.append(coin);
    fragment.append(parentTr);

    // Append the price data to the table
    var cryptoPrice = document.createElement("td");
    cryptoPrice.append("$" + data[index].current_price.toLocaleString("en-US"));
    parentTr.append(cryptoPrice);
    fragment.append(parentTr);

    // Append the price change data to the table
    var priceChangeTd = document.createElement("td");
    var priceChangeFormat = data[index].price_change_percentage_24h.toFixed(2);
    if (priceChangeFormat < 0) {
      priceChangeTd.className = "negativePriceChange";
    } else {
      priceChangeTd.className = "positivePriceChange";
    }
    priceChangeTd.append(priceChangeFormat);
    parentTr.append(priceChangeTd);
    fragment.append(parentTr);

    // Append the Market Cap data to the table
    var mktCaptTd = document.createElement("td");
    mktCaptTd.append("$" + data[index].market_cap.toLocaleString("en-US"));
    parentTr.append(mktCaptTd);
    fragment.append(parentTr);
  }
  /**Reload the table*/
  var tableRows = document.getElementById("table").rows.length;
  if (tableRows > 1) {
    tableBody.innerHTML = "";
    tableBody.append(fragment);
  } else {
    tableBody.append(fragment);
  }
}
