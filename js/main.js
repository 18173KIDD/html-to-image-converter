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
    const downloadHtmlButton = document.getElementById('download-html-button');
    const downloadPdfButton = document.getElementById('download-pdf-button');
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
        
        // すべてのダウンロードボタンを無効化
        convertButton.disabled = true;
        downloadHtmlButton.disabled = true;
        downloadPdfButton.disabled = true;
        
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
        
        // 各ダウンロードボタンを有効化
        convertButton.disabled = false;
        downloadHtmlButton.disabled = false;
        downloadPdfButton.disabled = false;
        
        // 画像プレビューをリセット
        imagePreviewContainer.style.display = 'none';
        imagePreview.innerHTML = '';
    });

    // モバイルデバイスの検出
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // iOS端末の検出
    function isIOSDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
    
    // モバイルブラウザタイプの検出
    function getMobileBrowserType() {
        const ua = navigator.userAgent;
        if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'safari';
        if (/Chrome/i.test(ua)) return 'chrome';
        return 'other';
    }
    
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
        
        // モバイルデバイスのログ出力
        console.log('デバイス情報:', {
            isMobile: isMobileDevice(),
            isIOS: isIOSDevice(),
            browserType: getMobileBrowserType()
        });

        // 新しいアプローチ: iframeを使用してHTMLをレンダリングし、それをキャプチャする
        const iframe = document.createElement('iframe');
        // モバイルデバイスではサイズを小さくする
        const isMobile = isMobileDevice();
        iframe.style.width = isMobile ? '800px' : '1200px';
        iframe.style.height = isMobile ? '600px' : '900px';
        iframe.style.border = 'none';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.zIndex = '-1000';  // 画面外に配置
        document.body.appendChild(iframe);