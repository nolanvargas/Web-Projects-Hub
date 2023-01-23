function buildSiteTemplate(name, data) {
  const html = `<div class="siteCard" id="${name}">
                  <div class="siteContent">
                    <h1>${data.title}</h1>
                    <p>${data.description}</p>
                  </div>
                </div>`;
  return html;
}

function displayHomeMenu(homeHTML) {
  const content = document.querySelector(".content");
  content.innerHTML = homeHTML.join("");
}

function loadHomeHTML(data) {
  let homeHTML = [];
  Object.entries(data).forEach(([key, value]) => {
    const siteHTML = buildSiteTemplate(key, value);
    homeHTML.push(siteHTML);
  });
  return homeHTML;
}

function loadClickListener(data) {
  const siteCards = document.querySelectorAll(".siteCard");
  siteCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const id = card.id;
      // runPerformanceTest(data[id].link, card);
      window.open(data[id].link, "_blank");
    });
  });
}

function runPerformanceTest(url, siteCard) {
  performance.clearMarks();
  performance.clearMeasures();
  performance.mark("startNavigation");
  fetch(url)
    .then(() => {
      performance.mark("endNavigation");
      performance.measure("performance", "startNavigation", "endNavigation");
      const measure = performance.getEntriesByName("performance")[0];
      const loadTime = measure.duration;
      const childNode = `<div class='metrics'><div class="load-time">${loadTime}ms</div>`;
      siteCard.innerHTML += childNode;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function main() {
  let sites = {};
  fetch("./sites.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const homeHTML = loadHomeHTML(data);
      displayHomeMenu(homeHTML);
      loadClickListener(data);
    });
}

document.addEventListener("DOMContentLoaded", main);

const string = document.lastModified;
document.querySelector(
  "#footer"
).innerHTML = `<p>Nolan Thomas Vargas - Last Updated: ${string}</p>`;
