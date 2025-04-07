document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const tabText = document.getElementById('tab-text');
    const tabFile = document.getElementById('tab-file');
    const textInputContainer = document.getElementById('text-input-container');
    const fileInputContainer = document.getElementById('file-input-container');
    const htmlInput = document.getElementById('html-input');
    const htmlFile = document.getElementById('html-file');
    const fileName = document.getElementById('file-name');
    const previewButton = document.getElementById('preview-button');
    const convertButton = document.getElementById('convert-button');
    const clearButton = document.getElementById('clear-button');
    const htmlPreview = document.getElementById('html-preview');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const imageFormat = document.getElementById('image-format');
    const jpegQualityContainer = document.getElementById('jpeg-quality-container');
    const jpegQuality = document.getElementById('jpeg-quality');
    const qualityValue = document.getElementById('quality-value');
    const bgColor = document.getElementById('bg-color');
    const scale = document.getElementById('scale');

    // 現在のHTMLソース（テキスト入力またはファイルから）
    let currentHtmlSource = '';
    let isFileInput = false;

    // タブ切り替え
    tabText.addEventListener('click', function() {
        tabText.classList.add('active');
        tabFile.classList.remove('active');
        textInputContainer.classList.add('active');
        fileInputContainer.classList.remove('active');
        isFileInput = false;
    });

    tabFile.addEventListener('click', function() {
        tabFile.classList.add('active');
        tabText.classList.remove('active');
        fileInputContainer.classList.add('active');
        textInputContainer.classList.remove('active');
        isFileInput = true;
    });

    // ファイル選択時の処理
    htmlFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            
            // ファイルの内容を読み込む
            const reader = new FileReader();
            reader.onload = function(e) {
                currentHtmlSource = e.target.result;
            };
            reader.readAsText(file);
        } else {
            fileName.textContent = 'ファイルが選択されていません';
            currentHtmlSource = '';
        }
    });

    // テキスト入力の変更を監視
    htmlInput.addEventListener('input', function() {
        currentHtmlSource = htmlInput.value;
    });

    // クリアボタンのクリック時の処理
    clearButton.addEventListener('click', function() {
        htmlInput.value = '';
        currentHtmlSource = '';
        htmlPreview.innerHTML = '';
        imagePreviewContainer.style.display = 'none';
        imagePreview.innerHTML = '';
        convertButton.disabled = true;
        
        // ファイル入力もリセット
        if (htmlFile) {
            htmlFile.value = '';
            fileName.textContent = 'ファイルが選択されていません';
        }
        
        console.log('入力内容をクリアしました');
    });

    // 画像形式の変更時の処理
    imageFormat.addEventListener('change', function() {
        if (imageFormat.value === 'jpeg') {
            jpegQualityContainer.style.display = 'flex';
        } else {
            jpegQualityContainer.style.display = 'none';
        }
    });

    // JPEG品質スライダーの変更時の処理
    jpegQuality.addEventListener('input', function() {
        qualityValue.textContent = jpegQuality.value;
    });

    // プレビューボタンのクリック時の処理
    previewButton.addEventListener('click', function() {
        if (!currentHtmlSource) {
            alert('HTMLコードを入力するか、HTMLファイルをアップロードしてください。');
            return;
        }

        // HTMLプレビューを表示
        htmlPreview.innerHTML = currentHtmlSource;
        
        // 変換ボタンを有効化
        convertButton.disabled = false;
        
        // 画像プレビューをリセット
        imagePreviewContainer.style.display = 'none';
        imagePreview.innerHTML = '';
    });

    // 変換ボタンのクリック時の処理
    convertButton.addEventListener('click', function() {
        if (!currentHtmlSource) {
            alert('HTMLコードを入力するか、HTMLファイルをアップロードしてください。');
            return;
        }

        // プレビューが表示されていない場合は表示する
        if (htmlPreview.innerHTML === '') {
            htmlPreview.innerHTML = currentHtmlSource;
        }

        // 新しいアプローチ: iframeを使用してHTMLをレンダリングし、それをキャプチャする
        const iframe = document.createElement('iframe');
        iframe.style.width = '1200px';  // より広いサイズに調整
        iframe.style.height = '900px';  // より高いサイズに調整
        iframe.style.border = 'none';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.zIndex = '-1000';  // 画面外に配置
        document.body.appendChild(iframe);

        // テキストオーバーフロー問題を修正するためのスタイルを追加
        const fixedHtmlSource = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* テキストオーバーフロー問題を修正するためのスタイル */
                    * {
                        box-sizing: border-box;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                    }
                    /* ユーザーのHTMLに影響を与えないように、特定のクラスを使用 */
                    .html2img-container {
                        width: 100%;
                        padding: 20px;
                        overflow: hidden;
                    }
                </style>
            </head>
            <body>
                <div class="html2img-container">
                    ${currentHtmlSource}
                </div>
            </body>
            </html>
        `;

        // iframeにHTMLを書き込む
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(fixedHtmlSource);
        iframeDoc.close();

        // iframeの読み込みが完了したらキャプチャ
        iframe.onload = function() {
            console.log('iframeの読み込みが完了しました');
            
            // html2canvasオプションの設定
            const options = {
                scale: parseFloat(scale.value),
                backgroundColor: bgColor.value,
                logging: true,
                useCORS: true,
                allowTaint: true,
                foreignObjectRendering: true,
                // コンテンツが切れないように設定
                width: iframe.contentWindow.document.documentElement.scrollWidth,
                height: iframe.contentWindow.document.documentElement.scrollHeight
            };

            // iframeの内容をキャプチャ
            const container = iframeDoc.querySelector('.html2img-container');
            html2canvas(container, options).then(function(canvas) {
                console.log('Canvas生成成功: サイズ', canvas.width, 'x', canvas.height);
                
                // 画像形式とクオリティの設定
                const format = imageFormat.value;
                const quality = format === 'jpeg' ? parseFloat(jpegQuality.value) : 1.0;
                
                console.log('画像形式:', format, '品質:', quality);
                
                // 画像プレビューの表示
                imagePreviewContainer.style.display = 'block';
                imagePreview.innerHTML = '';
                
                const img = document.createElement('img');
                img.src = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png', quality);
                img.style.maxWidth = '100%';
                img.style.border = '1px solid #ddd';
                imagePreview.appendChild(img);
                console.log('プレビュー表示完了');
                
                // ダウンロード処理
                canvas.toBlob(function(blob) {
                    if (!blob) {
                        console.error('Blobの生成に失敗しました');
                        alert('画像データの生成に失敗しました。別の設定で試してください。');
                        return;
                    }
                    
                    console.log('Blob生成成功: サイズ', blob.size, 'bytes', 'タイプ:', blob.type);
                    
                    // ファイル名の生成（現在の日時を含む）
                    const filename = 'html2img_' + getFormattedDate() + '.' + format;
                    
                    // FileSaver.jsを使用してダウンロード
                    saveAs(blob, filename);
                    console.log('ダウンロード開始:', filename);
                    
                    // 使用後にiframeを削除
                    document.body.removeChild(iframe);
                }, format === 'jpeg' ? 'image/jpeg' : 'image/png', quality);
                
            }).catch(function(error) {
                console.error('画像変換エラー:', error);
                alert('画像の変換中にエラーが発生しました: ' + error.message);
                document.body.removeChild(iframe);
            });
        };
    });

    // 日付フォーマット関数
    function getFormattedDate() {
        const date = new Date();
        return date.getFullYear() + 
            ('0' + (date.getMonth() + 1)).slice(-2) + 
            ('0' + date.getDate()).slice(-2) + '_' + 
            ('0' + date.getHours()).slice(-2) + 
            ('0' + date.getMinutes()).slice(-2) + 
            ('0' + date.getSeconds()).slice(-2);
    }

    // 初期表示設定
    if (imageFormat.value !== 'jpeg') {
        jpegQualityContainer.style.display = 'none';
    }
});
