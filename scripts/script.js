document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("gallery-container");
    const jsonFilePath = "gallery_data.json";

    // JSONファイルを取得してギャラリーを生成
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`JSONファイルの読み込みエラー: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            generateGallery(data);
        })
        .catch(error => {
            console.error("ギャラリー生成エラー:", error);
        });

    // ギャラリー生成関数
    function generateGallery(data) {
        if (!data || data.length === 0) {
            galleryContainer.innerHTML = "<p>ギャラリーに表示する画像がありません。</p>";
            return;
        }

        data.forEach(item => {
            const galleryItem = document.createElement("div");
            galleryItem.classList.add("gallery-item");

            const img = document.createElement("img");
            img.src = `images/${item.image}`; // 修正：画像のパスを設定
            img.alt = item.title;

            const caption = document.createElement("div");
            caption.classList.add("caption");
            caption.textContent = item.title;

            galleryItem.appendChild(img);
            galleryItem.appendChild(caption);
            galleryContainer.appendChild(galleryItem);
        });
    }
});
