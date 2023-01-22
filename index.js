import data from "./sites.json" assert { type: "json" };

function buildSiteTemplate(name, data) {
  const html = `<div class="siteCard">
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

function loadHomeHTML() {
  let homeHTML = [];
  Object.entries(data).forEach(([key, value]) => {
    const siteHTML = buildSiteTemplate(key, value);
    homeHTML.push(siteHTML);
  });
  return homeHTML;
}

async function main() {
  const homeHTML = loadHomeHTML();
  displayHomeMenu(homeHTML);
}

document.addEventListener("DOMContentLoaded", main);

const string = document.lastModified;
document.querySelector(
  "#footer"
).innerHTML = `<p>Nolan Thomas Vargas - Last Updated: ${string}</p>`;
