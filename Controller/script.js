/**
 * Initialize the app
 */
function init() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
  requestToAPI(url);
}
init();

/**
 * Request to the CoinGecko API
 */
function requestToAPI(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var arrResponse = JSON.parse(this.responseText);
      displayData(arrResponse);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

/**
 * Format and display the data on the table
 */
function displayData(data) {
  var fragment = new DocumentFragment();

  var table = document.getElementById("table");
  console.log(data.length, data[0].market_cap_rank);

  for (let index = 0; index < 10 /*data.length*/; index++) {
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
    coinName.append(data[index].id);
    coin.append(coinName);
    parentTr.append(coin);
    // Coin Symbol
    var coinSymbol = document.createElement("span");
    coinSymbol.append(data[index].symbol);
    coin.append(coinSymbol);
    parentTr.append(coin);
    fragment.append(parentTr);

    // Append the price data to the table
    var cryptoPrice = document.createElement("td");
    cryptoPrice.append(data[index].current_price);
    parentTr.append(cryptoPrice);
    fragment.append(parentTr);

    // Append the price change data to the table
    var priceChangeTd = document.createElement("td");
    priceChangeTd.append(data[index].price_change_percentage_24h);
    parentTr.append(priceChangeTd);
    fragment.append(parentTr);

    // Append the Market Cap data to the table
    var mktCaptTd = document.createElement("td");
    mktCaptTd.append(data[index].market_cap);
    parentTr.append(mktCaptTd);
    fragment.append(parentTr);
  }

  table.append(fragment);
}
