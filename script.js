const newsGrid = document.querySelector(".news-grid");
const categoryLinks = document.querySelectorAll(".category-nav a");
const searchInput = document.querySelector("#searchInput");

let allNews = [];
let activeCategory = "ALL";
let searchKeyword = "";

fetch("data/news.json")
  .then((response) => response.json())
  .then((newsList) => {
    allNews = newsList;
    renderFilteredNews();
  })
  .catch((error) => {
    console.error("JSON読み込み失敗:", error);
  });

function displayNews(newsList) {
  newsGrid.innerHTML = "";

  newsList.forEach((news) => {
    const card = document.createElement("article");
    card.className = `news-card ${news.size || ""}`;

    card.innerHTML = `
      <img src="${news.image}" alt="${news.title}">
      <div class="card-shade"></div>

      <div class="card-content">
        <span class="category">${news.category}</span>
        <h2>${news.title}</h2>
        <time>${news.date}</time>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `article.html?id=${news.id}`;
    });

    newsGrid.appendChild(card);
  });
}

function renderFilteredNews() {
  const filteredNews = allNews.filter((news) => {
    const matchesCategory =
      activeCategory === "ALL" || news.category === activeCategory;
    const normalizedKeyword = searchKeyword.toLowerCase();
    const matchesKeyword =
      normalizedKeyword === "" ||
      news.title.toLowerCase().includes(normalizedKeyword) ||
      news.category.toLowerCase().includes(normalizedKeyword) ||
      (news.summary || "").toLowerCase().includes(normalizedKeyword) ||
      (news.country || "").toLowerCase().includes(normalizedKeyword);

    return matchesCategory && matchesKeyword;
  });

  displayNews(filteredNews);
}

categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    activeCategory = link.textContent.trim();
    renderFilteredNews();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    searchKeyword = searchInput.value.trim();
    renderFilteredNews();
  });
}

function playRadio(newsList) {

  speechSynthesis.cancel();

  const latest = newsList.slice(0, 10);

  let script =
    "本日の海外ニュースです。";

  latest.forEach((item) => {

    /*script += `${item.category}ニュース。`
    'script += `${item.title}。`;*/
    script += `${item.source}より。`;
    script += `${item.title}。`;
    script += `${item.summary}。`;
  });

  script +=
    "以上、本日の海外ニュースでした。";

  const speech =
    new SpeechSynthesisUtterance(script);

  speech.lang = "ja-JP";
  speech.rate = 1;
  speech.pitch = 1;

  speechSynthesis.speak(speech);
}

const radioBtn = document.getElementById("radioBtn");

if (radioBtn) {
  radioBtn.addEventListener("click", () => {
    playRadio(allNews);
  });
}

document
  .getElementById("stopRadioBtn")
  ?.addEventListener("click", () => {
    speechSynthesis.cancel();
  });
