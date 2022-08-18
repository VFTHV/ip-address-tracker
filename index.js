(function () {
  const apiKey1 = "at_H4jvcSllOaRXGMkxSprwTfmSBuUB2";
  const apiKey2 = "at_tcvPspf3lf41NHU5OjHX4QwonW964";

  const ipfyFetch = (input) => {
    let usedIpOrDomain = "";

    if (!input) {
      usedIpOrDomain = ``;
    } else if (domainOrIp(input)) {
      usedIpOrDomain = `&domain=${input}`;
    } else {
      usedIpOrDomain = `&ipAddress=${input}`;
    }

    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey2}${usedIpOrDomain}`;
    const ipfy = fetch(url);
    return ipfy;
  };

  const domainOrIp = (input) => {
    if (!input) return;
    const expressionString =
      "^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}.(xn--)?([a-z0-9-]{1,61}|[a-z0-9-]{1,30}.[a-z]{2,})$";
    const expression = new RegExp(expressionString);

    if (input.toLowerCase().match(expression)) {
      return true;
    } else {
      return false;
    }
  };

  const ip = document.getElementById("ip");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const zipcode = document.getElementById("zipcode");
  const timezone = document.getElementById("timezone");
  const isp = document.getElementById("isp");
  const errorMessage = document.getElementById("error-message");

  // creating map here

  const map = L.map("map", {
    zoomControl: false,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  const setMapLocation = (lat, lng) => {};

  const assignData = (data, ipAddress) => {
    errorMessage.innerText = "";
    const yours = ipAddress ? "" : " (Yours)";

    errorMessage.innerText = data.code ? data.messages : "";

    // if data.code === 402 i.e. bad request happenned, then put Unknown into the text

    ip.innerText = data.code ? "Unkown" : data.ip + yours;
    city.innerText = data.code ? "" : data.location.city;
    state.innerText = data.code ? "" : data.location.region;
    zipcode.innerText = data.code ? "Unkown" : data.location.postalCode + yours;
    timezone.innerText = data.code ? "Unkown" : data.location.timezone + yours;
    isp.innerText = data.code ? "Unkown" : data.isp + yours;
  };

  const onError = () => {
    alert("Unkown Error Occurred");
  };

  const fetchAndAssign = (ip) => {
    ipfyFetch(ip)
      .then((response) => response.json())
      // .then((data) => console.log(data))
      .then((data) => {
        assignData(data, ip);
        const lat = data.location.lat;
        const lng = data.location.lng;

        map.setView([lat, lng], 13);
        const iconLocation = L.icon({
          iconUrl: "./images/icon-location.svg",
          iconAnchor: [23, 56],
        });
        L.marker([lat, lng], { icon: iconLocation }).addTo(map);
      })
      .catch((error) => onError);
  };

  fetchAndAssign();

  const form = document.getElementById("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const enteredData = event.target.elements["ip-input"].value;

    fetchAndAssign(enteredData);
  });
})();
