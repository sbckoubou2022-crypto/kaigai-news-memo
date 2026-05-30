const newsGrid = document.querySelector(".news-grid");
const categoryLinks = document.querySelectorAll(".category-nav a");

let allNews = [];

fetch("data/news.json")
  .then((response) => response.json())
  .then((newsList) => {
    allNews = newsList;
    displayNews(allNews);
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

categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const selectedCategory = link.textContent.trim();

    if (selectedCategory === "ALL") {
      displayNews(allNews);
      return;
    }

    const filteredNews = allNews.filter((news) => {
      return news.category === selectedCategory;
    });

    displayNews(filteredNews);
  });
});

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  const searchedNews = allNews.filter((news) => {
    return (
      news.title.toLowerCase().includes(keyword) ||
      news.category.toLowerCase().includes(keyword) ||
      (news.summary || "").toLowerCase().includes(keyword) ||
      (news.country || "").toLowerCase().includes(keyword)
    );
  });

  displayNews(searchedNews);
});