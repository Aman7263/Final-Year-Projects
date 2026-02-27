// ================= PASSWORD PROTECTION =================

const correctPassword = "7263";
const unlockBtn = document.getElementById("unlockBtn");
const accessCode = document.getElementById("accessCode");
const lockScreen = document.getElementById("lockScreen");
const errorMsg = document.getElementById("errorMsg");

// Disable scrolling initially
document.body.style.overflow = "hidden";

// Unlock button click
if (unlockBtn) {
  unlockBtn.addEventListener("click", () => {

    if (accessCode.value === correctPassword) {

      lockScreen.style.display = "none";
      document.body.style.overflow = "auto";

      // Save login state
      sessionStorage.setItem("accessGranted", "true");

    } else {
      errorMsg.textContent = "Incorrect Password!";
    }

  });
}

// Keep unlocked during session
window.addEventListener("load", () => {

  if (sessionStorage.getItem("accessGranted") === "true") {
    lockScreen.style.display = "none";
    document.body.style.overflow = "auto";
  }

});

// ========= AUTO VIDEO THUMBNAIL GENERATOR (STABLE VERSION) =========
function createVideoThumbnail(videoSrc, imgElement) {

  const storageKey = "thumb_" + videoSrc;

  // ✅ Use saved thumbnail if already generated
  const savedThumbnail = localStorage.getItem(storageKey);
  if (savedThumbnail) {
    imgElement.src = savedThumbnail;
    return;
  }

  const video = document.createElement("video");
  video.src = videoSrc;
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.preload = "metadata";

  video.addEventListener("loadeddata", function () {

    video.currentTime = 1;

    video.addEventListener("seeked", function () {

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const thumbnailData = canvas.toDataURL("image/jpeg");

      // ✅ Save thumbnail permanently
      localStorage.setItem(storageKey, thumbnailData);

      imgElement.src = thumbnailData;
    });

  });

  // ✅ Fallback image if video fails
  video.onerror = function () {
    imgElement.src = "photo/1.jpg";
  };
}

// ================= MENU TOGGLE =================
const menuIcon = document.querySelector(".menu-icon");
const sidebar = document.querySelector(".sidebar");
const container = document.querySelector(".container");

if (menuIcon) {
  menuIcon.onclick = () => {
    sidebar.classList.toggle("small-sidebar");
    container.classList.toggle("large-container");
  };
}

// ================= DARK MODE WITH STORAGE =================
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

if (themeToggle) {
  themeToggle.onclick = () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

  };
}

// ================= AUTO VIDEO FILE LIST =================

// 🔹 Numbered Videos (45–66)
const videoFiles = [
  "45.mp4",
  "46.mp4",
  "47.mp4",
  "48.mp4",
  "49.mp4",
  "50.mp4",
  "51.mp4",
  "52.mp4",
  "53.mp4",
  "54.mp4",
  "55.mp4",
  "56.mp4",
  "57.mp4",
  "58.mp4",
  "59.mp4",
  "60.mp4",
  "61.mp4",
  "62.mp4",
  "63.mp4",
  "64.mp4",
  "65.mp4",
  "66.mp4",

  // 🔹 Named Videos
  "ABCD_Yaariyan_Song_Meme_Compilation.mp4",
  "Baby_Ko_Bass_Pasand_Hai_Song_Meme_Compilation.mp4",
  "Back_Benchers__Rap_Song__Song_Meme_Compilation.mp4",
  "Ban_Ja_Tu_Meri_Rani_Song_Meme_Compilation.mp4",
  "Bedardi_Se_Pyaar_Ka_Song_Meme_Compilation.mp4",
  "Burjkhalifa_Song_Meme_Compilation.mp4",
  "Chamma_Chamma_Song_Meme_Compilation.mp4",
  "ChinTa_Ta_Ta_Chita_Chita_Song_Meme_Compilation.mp4",
  "Chura_Ke_Dil_Mera_2.0_Song_Meme_Compilation.mp4",
  "Chura_Ke_Dil_Mera_Song_Meme_Compilation.mp4",
  "Daddy_Mummy_Song_Meme_Compilation.mp4",
  "Dil_Mein_Baji_Guitar_Song_Meme_Compilation.mp4",
  "Hawa_Hawa_Song_Meme_Compilation.mp4",
  "Hookah_Bar_Khiladi_786_Song_Meme_Compilation.mp4",
  "Hua_Hai_Aaj_Pehli_Baar_Song_Meme_Compilation.mp4",
  "Husnn_Hai_Suhaana_Song_Meme_Compilation.mp4",
  "Jhalak_Dikhla_Jaa_Song_Meme_Compilation.mp4",
  "Jo_Akh_Lad_Jaave_Song_Meme_Compilation.mp4",
  "Kaddu_Katega_Song_Meme_Compilation.mp4",
  "Kajra_Re_Song_Meme_Compilation.mp4",
  "KANTA_LAGA_Song_Meme_Compilation.mp4",
  "Kar_Gayi_Chull_Song_Meme_Compilation.mp4",
  "Kaun_Tujhe_yun_Payar_Song_Meme_Compilation.mp4",
  "Ladki_Harami__Rap___PART_1__Song_Meme_Compilation.mp4",
  "Ladki_Harami__Rap___PART_2__Song_Meme_Compilation.mp4",
  "Lat_Lag_Gayee_Song_Meme_Compilation.mp4",
  "Locha-E-Ulfat_Song_Meme_Compilation.mp4",
  "Love_Mera_Hit_Hit_Song_Meme_Compilation.mp4",
  "Lut_Gaye_Song_Meme_Compilation.mp4",
  "Maine_Tujhko_Dekha_Song_Meme_Compilation.mp4",
  "Maria_Maria_Song_Meme_Compilation.mp4",
  "Mere_Samne_Wali_Khidki_Mein_Song_Compilation.mp4",
  "Oh_Ho_Ho_Ho_Song_Meme_Compilation.mp4",
  "Padosi_Bc_Song_Meme_Compilation.mp4",
  "PARAM_SUNDARI_Song_Meme_Compilation.mp4",
  "Photo__Luka_Chuppi__Song_Meme_Compilation.mp4",
  "Rishtedar_Bc__PART_1__Song_Meme_Compilation.mp4",
  "Rishtedar_Bc__PART_2__Song_Meme_Compilation.mp4",
  "Super_Girl_From_China_Song_Meme_Compilation.mp4",
  "The_Humma_Song_Meme_Compilation.mp4",
  "Tu_Cheez_Badi_Hai_Mast_Mast_Song_Meme_Compilation.mp4",
  "Tum_Kyu_Chale_Aate_Ho_Song_Meme_Compilation.mp4",
  "Tumse_Mil_ke_Dil_ka_Song_Meme_Compilation.mp4",
  "Woh_Ladki_Jo__PART_1__Song_Meme_Compilation.mp4",
  "Woh_Ladki_Jo__PART_2__Song_Meme_Compilation.mp4"
];

// ================= AUTO TITLE GENERATOR =================
const videos = videoFiles.map((file, index) => {

  let cleanTitle = decodeURIComponent(file)
    .replace(".mp4", "")
    .replace(/_/g, " ")
    .replace(/\(.*?\)/g, "")
    .trim();

  return {
    id: index,
    title: cleanTitle,
    src: "video/" + file,
    thumbnail: "photo/" + ((index % 30) + 1) + ".jpg",
    views: Math.floor(Math.random() * 50) + "K",
    date: "Recently"
  };
});

// ================= DOM =================
const videoList = document.getElementById("videoList");
const homeView = document.getElementById("homeView");
const videoView = document.getElementById("videoView");
const mainVideo = document.getElementById("mainVideo");
const videoSource = document.getElementById("videoSource");
const videoTitle = document.getElementById("videoTitle");
const viewsDate = document.getElementById("viewsDate");
const recommended = document.getElementById("recommended");

// ================= RENDER HOME =================
function renderHome(videoArr) {

  videoList.innerHTML = "";

  videoArr.forEach((vid) => {

    const div = document.createElement("div");
    div.className = "vid-list";

    const link = document.createElement("a");
    link.href = `?v=${vid.id}`;

    const img = document.createElement("img");
    img.className = "thumbnail1";

    createVideoThumbnail(vid.src, img);

    link.appendChild(img);
    div.appendChild(link);

    div.innerHTML += `
      <div class="whole">
        <img src="photo/Jack.png">
        <div class="vid-info">
          <a href="?v=${vid.id}">${vid.title}</a>
          <p>Sarcasm Editx</p>
          <p>${vid.views} views • ${vid.date}</p>
        </div>
      </div>
    `;

    videoList.appendChild(div);
  });
}

// ================= LOAD PAGE =================
function loadPage() {

  const params = new URLSearchParams(window.location.search);
  const videoId = params.get("v");

  if (videoId !== null) {

    homeView.style.display = "none";
    videoView.style.display = "block";

    const vid = videos[videoId];

    if (vid) {
      videoSource.src = vid.src;
      mainVideo.load();
      videoTitle.textContent = vid.title;
      viewsDate.textContent = `${vid.views} views • ${vid.date}`;
      document.getElementById("tags").innerHTML = "#meme #funny #crossover";

      localStorage.setItem("lastVideo", vid.src);

      recommended.innerHTML = "";

      videos.forEach((v, i) => {

        if (i != videoId) {

          recommended.innerHTML += `
            <div class="side-video-list">
              <a href="?v=${v.id}" class="small-thumbnail">
                <img src="${v.thumbnail}">
              </a>
              <div class="vid-info">
                <a href="?v=${v.id}">${v.title}</a>
                <p>Sarcasm Editx</p>
                <p>${v.views} views</p>
              </div>
            </div>
          `;

        }

      });

    }

  } else {

    homeView.style.display = "block";
    videoView.style.display = "none";
    renderHome(videos);

  }

}

window.addEventListener("load", loadPage);

// ================= SEARCH =================
document.getElementById("searchInput")
.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(term)
  );
  renderHome(filtered);
});

// ================= LIKE =================
const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

let likes = Number(localStorage.getItem("likes")) || 5000;
likeCount.textContent = likes;

likeBtn.onclick = (e) => {
  e.preventDefault();
  likes++;
  likeCount.textContent = likes;
  localStorage.setItem("likes", likes);
};

// ================= SUBSCRIBE =================
const subscribeBtn = document.getElementById("subscribeBtn");

subscribeBtn.onclick = () => {
  subscribeBtn.classList.toggle("subscribed");
  subscribeBtn.textContent =
    subscribeBtn.classList.contains("subscribed")
      ? "Subscribed"
      : "Subscribe";
};

// ================= COMMENTS =================
const postComment = document.getElementById("postComment");
const commentInput = document.getElementById("commentInput");
const commentSection = document.getElementById("commentSection");
const commentCount = document.getElementById("commentCount");

let totalComments = 150;

postComment.onclick = () => {

  const text = commentInput.value.trim();

  if (text !== "") {

    commentSection.innerHTML += `
      <div class="old-comment">
        <img src="photo/Jack.png">
        <div>
          <h3>You <span>Just now</span></h3>
          <p>${text}</p>
        </div>
      </div>
    `;

    totalComments++;
    commentCount.textContent = `${totalComments} comments`;
    commentInput.value = "";

  }

};