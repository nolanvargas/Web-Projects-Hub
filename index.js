function buildSiteTemplate(name, data) {
  let html = `<div class="siteCard" id="${name}">
                  <div class="siteContent">
                    <h1>${data.title}</h1>
                    <p>${data.description}</p>`;

  if (Array.isArray(data.content)) {
    html += `<div class="images">`;
    data.content.forEach((image) => {
      const isGif = image.endsWith(".gif");
      html += `<img src="${image}" alt="" class="hidden content ${
        isGif ? "gif" : "image"
      }">`;
    });
    html += `</div>`;
  } else if (typeof data.content === "string") {
    html += `<img src="${data.content}" alt="" class="hidden content">`;
  }

  if (data.link) {
    html += `<a href="${data.link}" target="_blank" class="hidden visitSite">Visit</a>`;
  }

  html += `</div>
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

function loadEnlargeListener(image) {
  image.addEventListener("click", (event) => {
    event.stopPropagation();

    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    backdrop.style.position = "fixed";
    backdrop.style.top = 0;
    backdrop.style.left = 0;
    backdrop.style.width = "100%";
    backdrop.style.height = "100%";
    backdrop.style.backgroundColor = "rgba(0,0,0,0.5)";
    backdrop.style.zIndex = "998";

    if (!image.enlarged) {
      const body = document.querySelector("body");
      body.style.backgroundColor = "#12242B";
      body.style.overflow = "hidden";

      body.appendChild(backdrop);

      image.style.position = "fixed";
      image.style.top = "50%";
      image.style.left = "50%";
      image.style.transform = "translate(-50%, -50%)";
      image.style.zIndex = "999";
      image.style.width = "90%";
      image.style.height = "auto";

      image.enlarged = true;
    } else {
      const body = document.querySelector("body");
      body.style.backgroundColor = "#19323c";
      body.style.overflow = "";

      image.style.position = "";
      image.style.top = "";
      image.style.left = "";
      image.style.transform = "";
      image.style.zIndex = "";
      image.style.width = "";
      image.style.height = "";

      document.querySelector(".backdrop").remove();
      image.enlarged = false;
    }
  });
}
function loadClickListener(data) {
  const siteCards = document.querySelectorAll(".siteCard");
  siteCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (!event.target.matches("img")) {
        const id = card.id;
        try {
          const button = card
            .querySelector(".visitSite")
            .classList.toggle("hidden");
        } catch {}

        // runPerformanceTest(data[id].link, card);
        // window.open(data[id].link, "_blank");
        card.classList.toggle("expanded");
        const content = card.querySelector(".siteContent");
        const images = content.querySelector(".images");
        console.log(images);
        images.childNodes.forEach((image) => {
          image.classList.toggle("hidden");
          if (image.classList.contains("image")) {
            image.enlarged = false;
            loadEnlargeListener(image);
          }
        });

        const link = card.querySelector("a");
        if (link) {
          link.classList.toggle("hidden");
        }
      }
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
