document.addEventListener("DOMContentLoaded", async () => {
    // gallery_data.json を非同期で読み込む
    const fetchGalleryData = async () => {
        const response = await fetch("gallery_data.json");
        if (!response.ok) {
            throw new Error("Failed to load gallery data");
        }
        return await response.json();
    };

    let galleryData = []; // グローバルスコープでデータを保持

    // ギャラリーをレンダリングする関数
    const renderGallery = (view) => {
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";
        gallery.className = view === "grid" ? "gallery-container" : "gallery-container--list";

        galleryData.forEach(item => {
            const galleryItem = document.createElement("div");
            galleryItem.className = view === "grid" ? "gallery__item" : "gallery__item gallery__item--list";

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.title;
            galleryItem.appendChild(img);

            if (view === "list") {
                const title = document.createElement("p");
                title.textContent = item.title;
                galleryItem.appendChild(title);
            }

            gallery.appendChild(galleryItem);
        });
    };

    // イベントリスナーの設定
    const gridViewButton = document.getElementById("gridView");
    const listViewButton = document.getElementById("listView");
    const menuToggle = document.querySelector(".header__toggle");
    const menu = document.querySelector(".header__menu");

    gridViewButton.addEventListener("click", () => renderGallery("grid"));
    listViewButton.addEventListener("click", () => renderGallery("list"));

    menuToggle.addEventListener("click", () => {
        menu.classList.toggle("header__menu--active");
    });

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.classList.remove("header__menu--active");
        }
    });

    try {
        // データを非同期で取得してグローバル変数に保存
        galleryData = await fetchGalleryData();
        renderGallery("grid"); // デフォルト表示をグリッドビューに設定
    } catch (error) {
        console.error("Error loading gallery data:", error);
    }
});
