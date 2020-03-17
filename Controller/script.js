/**
 * Initialize the app
 */

var globalReqData;
function init() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  /**Initializing */
  requestToAPI(url)
    .then(data => {
      displayData(data);
      return data;
    })
    .then(data => {
      globalReqData = data;
    })
    .then(() => lastUpdate())
    .catch(error => console.log(error));

  /**Updating the table */
  setInterval(function() {
    requestToAPI(url)
      .then(data => displayData(data))
      .then(() => lastUpdate())
      .catch(error => console.log(error));
  }, 10000);

  //DarkMode
  changeDarkMode();
  setDarkMode();

  // Close Modal Window
  closeModalWindow();
}
init();

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
    parentTr.id = data[index].id;
    parentTr.setAttribute("data-id", data[index].id);
    parentTr.addEventListener("click", event => {
      displayModalPopUp(event);
    });

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
    coinSymbol.className = "coinSym";
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
    mktCaptTd.className = "mktCap";
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

/**
 * Change the dark mode and storing the preference in
 * the local storage
 */
function changeDarkMode() {
  var darkBttn = document.getElementById("darkModeBttn");
  var modalElm = document.getElementById("modalDesc");
  var bttnMdlElem = document.getElementById("closeBttnMdl");
  var containerTopElm = document.getElementById("containerTop");

  darkBttn.addEventListener("click", () => {
    var checkMode = localStorage.getItem("DarkMode");
    const bodyElm = document.body;

    if (checkMode === null) {
      localStorage.setItem("DarkMode", "On");
      bodyElm.className = "dark-mode";
      modalElm.className = "modalDarkMode";
      bttnMdlElem.className = "closeBttnMdlDark";
      containerTopElm.style.backgroundColor = "#000000";
    } else if (checkMode === "On") {
      localStorage.removeItem("DarkMode");
      bodyElm.classList.remove("dark-mode");
      modalElm.className = "modal";
      bttnMdlElem.className = "closeBttnMdl";
      containerTopElm.style.backgroundColor = "#002b58";
    }
  });
}

/**
 * Set the dark mode according to the user preferences that
 * are stored in the local storage.
 */
function setDarkMode() {
  const inputCheck = document.getElementById("inputChkDrkMd");
  const checkMode = localStorage.getItem("DarkMode");
  var bttnMdlElem = document.getElementById("closeBttnMdl");
  var modalElm = document.getElementById("modalDesc");
  var containerTopElm = document.getElementById("containerTop");

  const bodyElm = document.body;

  if (checkMode === "On") {
    bodyElm.className = "dark-mode";
    modalElm.className = "modalDarkMode";
    bttnMdlElem.className = "closeBttnMdlDark";
    containerTopElm.style.backgroundColor = "#000000";

    inputCheck.checked = true;
  } else {
    bodyElm.classList.remove("dark-mode");
    modalElm.className = "modal";
    bttnMdlElem.className = "closeBttnMdl";
    containerTopElm.style.backgroundColor = "#002b58";
  }
}

/**
 * Get the id of the coin selected by the user
 * and display the data in the modal accordingly to the
 * cyptocurrency selected.
 * @param {Object} event
 */
function displayModalPopUp(event) {
  const coinId = event.currentTarget.getAttribute("data-id");
  coinDetailInformation(coinId);
}

/**
 * Format and store the data in the modal form
 * @param {Object} data
 */
function editModalInformation(data) {
  // Data
  const name = data.name;
  const price = data.current_price;
  const mktCap = data.market_cap;
  const rank = data.market_cap_rank;
  const totalVlm = data.total_volume;
  const high24Hrs = data.high_24h;
  const low24Hrs = data.low_24h;
  const priceChgPerc24Hrs = data.price_change_percentage_24h;
  const circulationSupply = data.circulating_supply;
  const totalSupply = data.total_supply;

  // Node Elements
  const mdlName = document.getElementById("mdlName");
  const mdlPrice = document.getElementById("mdlPrice");
  const mdlMktCap = document.getElementById("mdlMktCap");
  const mdlRank = document.getElementById("mdlRank");
  const mdlTraVlm = document.getElementById("mdlTraVlm");
  const mdlHighLow = document.getElementById("mdlHighLow");
  const mdlPriceChg = document.getElementById("mdlPriceChg");
  const mdlCirulation = document.getElementById("mdlCirulation");

  // Change value of nodes
  mdlName.innerHTML = name;
  mdlPrice.innerHTML = "$" + price.toLocaleString("en-US");
  mdlMktCap.innerHTML = "$" + mktCap.toLocaleString("en-US");
  mdlRank.innerHTML = "#" + rank;
  mdlTraVlm.innerHTML = "$" + checkDataAva(totalVlm).toLocaleString("en-US");
  mdlHighLow.innerHTML =
    "$" +
    checkDataAva(high24Hrs).toLocaleString("en-US") +
    " / " +
    "$" +
    checkDataAva(low24Hrs).toLocaleString("en-US");
  mdlPriceChg.innerHTML = priceChgPerc24Hrs.toFixed(2) + "%";
  mdlCirulation.innerHTML =
    checkDataAva(circulationSupply).toLocaleString("en-US") +
    " / " +
    checkDataAva(totalSupply).toLocaleString("en-US");

  // Add Class
  if (priceChgPerc24Hrs < 0) {
    mdlPriceChg.className = "mdlNegVal";
  } else {
    mdlPriceChg.className = "mdlPosVal";
  }
}

/**
 * Check when the data is null
 * @param {String} data
 */
function checkDataAva(data) {
  if (data === null) return 0;
  return data;
}

/**
 * Get the data information of an specific cryptocurrency
 * and call the methods "editModalInformation" to store the
 * details on the modal, and also call the method "overlayWindow"
 * to display the modal form with the complete data to the user.
 * @param {String} coin
 */
function coinDetailInformation(coin) {
  Promise.resolve(true)
    .then(() => {
      // Get the coin information from the general data
      var data;
      for (let index = 0; index < globalReqData.length; index++) {
        if (globalReqData[index].id === coin) {
          data = globalReqData[index];
        }
      }

      return data;
    })
    .then(data => {
      editModalInformation(data);
    })
    .then(() => overlayWindow());
}

/**
 * Close the modal form.
 */
function closeModalWindow() {
  var overlay = document.getElementById("over");
  var closeBttn = document.getElementById("closeBttnMdl");
  closeBttn.addEventListener("click", () => {
    overlay.style.visibility = "hidden";
    overlay.style.opacity = 0;
  });
}

/**
 * Display the overlay and the modal when the user
 * has clicked an item or coin on the table
 */
function overlayWindow() {
  var overlay = document.getElementById("over");
  var modalElem = document.getElementById("modalDesc");
  var scrollElm = document.getElementById("modalDesc");

  //Overlay
  overlay.style.visibility = "visible";
  overlay.style.opacity = 1;

  //Modal
  modalElem.style.maxHeight = "500px";
}
