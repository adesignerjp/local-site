document.addEventListener("DOMContentLoaded", () => {
    // ギャラリーコンテナとデータファイルパス
    const galleryContainer = document.getElementById("gallery-container");
    const jsonFilePath = "/gallery_data.json";

    // ハンバーガーメニュー関連
    const hamburgerToggle = document.getElementById("hamburger-toggle");
    const hamburgerMenu = document.getElementById("hamburger-menu");

    // 表示切り替えボタン
    const gridViewBtn = document.getElementById("grid-view-btn");
    const listViewBtn = document.getElementById("list-view-btn");

    // 初期表示モード
    let currentViewMode = "grid";

    // JSONファイルを取得してギャラリーを生成
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`JSONファイルの読み込みエラー: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            generateGallery(data, currentViewMode);
        })
        .catch(error => {
            console.error("ギャラリー生成エラー:", error);
        });

    // ギャラリー生成関数
    function generateGallery(data, viewMode) {
        if (!data || data.length === 0) {
            galleryContainer.innerHTML = "<p>ギャラリーに表示する画像がありません。</p>";
            return;
        }

        galleryContainer.innerHTML = ""; // コンテナの初期化

        data.forEach(item => {
            const galleryItem = document.createElement("div");
            galleryItem.classList.add("gallery-item");

            if (viewMode === "list") {
                galleryItem.classList.add("list-item");
            }

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.title;

            galleryItem.appendChild(img);

            // リスト表示のみテキストを追加
            if (viewMode === "list") {
                const title = document.createElement("span");
                title.textContent = item.title;
                galleryItem.appendChild(title);
            }

            galleryContainer.appendChild(galleryItem);
        });

        // ビューモードに応じたクラスを適用
        galleryContainer.className = `gallery-container ${viewMode}-view`;
    }

    // 表示モード切り替え
    gridViewBtn.addEventListener("click", () => {
        currentViewMode = "grid";
        fetch(jsonFilePath)
            .then(response => response.json())
            .then(data => generateGallery(data, currentViewMode))
            .catch(error => console.error("表示切り替えエラー:", error));
    });

    listViewBtn.addEventListener("click", () => {
        currentViewMode = "list";
        fetch(jsonFilePath)
            .then(response => response.json())
            .then(data => generateGallery(data, currentViewMode))
            .catch(error => console.error("表示切り替えエラー:", error));
    });

    // ハンバーガーメニューの開閉
    hamburgerToggle.addEventListener("click", () => {
        hamburgerMenu.classList.toggle("active");
    });
});
