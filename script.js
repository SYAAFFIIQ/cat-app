document.addEventListener("DOMContentLoaded", () => {

  const card = document.getElementById("card");
  const likeOverlay = document.getElementById("like");
  const dislikeOverlay = document.getElementById("dislike");
  const likeCountText = document.getElementById("likeCount");

  const summary = document.getElementById("summary");
  const finalCount = document.getElementById("finalCount");
  const likedGallery = document.getElementById("likedGallery");

  let startX = 0;
  let isDragging = false;

  const TOTAL_CATS = 10;
  let currentCat = 0;
  let likeCount = 0;
  let likedCats = [];

  function loadCat() {
    if (currentCat >= TOTAL_CATS) {
      showSummary();
      return;
    }

    card.style.transform = "translateX(0)";
    likeOverlay.style.opacity = 0;
    dislikeOverlay.style.opacity = 0;

    const catUrl = `https://cataas.com/cat?${Date.now()}`;
    card.style.backgroundImage = `url(${catUrl})`;
    card.dataset.url = catUrl;
  }

  loadCat();

  /* POINTER EVENTS */
  card.addEventListener("pointerdown", e => {
    startX = e.clientX;
    isDragging = true;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", e => {
    if (!isDragging) return;

    const diff = e.clientX - startX;
    card.style.transform = `translateX(${diff}px) rotate(${diff / 15}deg)`;

    likeOverlay.style.opacity = diff > 40 ? 1 : 0;
    dislikeOverlay.style.opacity = diff < -40 ? 1 : 0;
  });

  card.addEventListener("pointerup", e => {
    if (!isDragging) return;
    isDragging = false;

    const diff = e.clientX - startX;

    if (diff > 100) {
      // LIKE
      likeCount++;
      likedCats.push(card.dataset.url);
      likeCountText.innerText = likeCount;
      currentCat++;
      card.style.transform = "translateX(400px) rotate(20deg)";
      setTimeout(loadCat, 300);

    } else if (diff < -100) {
      // DISLIKE
      currentCat++;
      card.style.transform = "translateX(-400px) rotate(-20deg)";
      setTimeout(loadCat, 300);

    } else {
      // RESET
      card.style.transform = "translateX(0)";
      likeOverlay.style.opacity = 0;
      dislikeOverlay.style.opacity = 0;
    }
  });

  function showSummary() {
    card.classList.add("hidden");
    document.getElementById("counter").classList.add("hidden");
    summary.classList.remove("hidden");

    finalCount.innerText = likeCount;
    likedGallery.innerHTML = likedCats
      .map(url => `<img src="${url}">`)
      .join("");
  }

  window.restart = function () {
    location.reload();
  };

});
