const params = new URLSearchParams(window.location.search);
const articleId = Number(params.get("id"));

fetch("data/news.json")
  .then((response) => response.json())
  .then((newsList) => {
    const article = newsList.find((news) => news.id === articleId);

    if (!article) {
      document.querySelector(".article-detail").innerHTML =
        "<p>記事が見つかりませんでした。</p>";
      return;
    }

    document.querySelector("#articleImage").src = article.image;
    document.querySelector("#articleImage").alt = article.title;
    document.querySelector("#articleCategory").textContent = article.category;
    document.querySelector("#articleDate").textContent = article.date;
    document.querySelector("#articleTitle").textContent = article.title;
    document.querySelector("#articleSummary").textContent = article.summary || "";
    document.querySelector("#articleContent").innerHTML = article.content || "";
  
    const relatedGrid = document.querySelector("#relatedGrid");

    const relatedNews = newsList
      .filter((news) => {
        return (
          news.category === article.category &&
          news.id !== article.id
        );
      })
      .slice(0, 3);

    relatedNews.forEach((news) => {

      const card = document.createElement("article");

      card.className = "related-card";

      card.innerHTML = `
        <img src="${news.image}" alt="${news.title}">

        <div class="related-content">
          <span>${news.category}</span>
          <h3>${news.title}</h3>
        </div>
      `;

      card.addEventListener("click", () => {
        window.location.href = `article.html?id=${news.id}`;
      });

      relatedGrid.appendChild(card);

    });
  
  })
  .catch((error) => {
    console.error("記事データの読み込みに失敗しました", error);
  });