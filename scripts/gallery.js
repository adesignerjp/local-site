document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("gallery-container");
    const gridViewBtn = document.getElementById("grid-view-btn");
    const listViewBtn = document.getElementById("list-view-btn");
    const hamburgerToggle = document.getElementById("hamburger-toggle");
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const jsonFilePath = "/gallery_data.json";

    // ハンバーガーメニュー開閉
    hamburgerToggle.addEventListener("click", () => {
        const isActive = hamburgerMenu.classList.toggle("active");
        hamburgerToggle.setAttribute("aria-expanded", isActive);
    });

    document.addEventListener("click", (event) => {
        if (!hamburgerToggle.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            hamburgerMenu.classList.remove("active");
        }
    });

    // 表示切り替え機能
    const fetchAndRenderGallery = (viewMode) => {
        fetch(jsonFilePath)
            .then(response => response.json())
            .then(data => {
                galleryContainer.innerHTML = data.map(item => `
                    <div class="gallery-item">
                        <img src="${item.image}" alt="${item.title}">
                        ${viewMode === "list" ? `<span>${item.title}</span>` : ""}
                    </div>
                `).join("");
                galleryContainer.className = `gallery-container ${viewMode}-view`;
            })
            .catch(error => console.error("エラー:", error));
    };

    gridViewBtn.addEventListener("click", () => fetchAndRenderGallery("grid"));
    listViewBtn.addEventListener("click", () => fetchAndRenderGallery("list"));

    // 初期表示
    fetchAndRenderGallery("grid");
});
