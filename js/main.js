document.addEventListener('DOMContentLoaded', function() {
    // 要素の取得
    const tabText = document.getElementById('tab-text');
    const tabFile = document.getElementById('tab-file');
    const textInputContainer = document.getElementById('text-input-container');
    const fileInputContainer = document.getElementById('file-input-container');
    const htmlInput = document.getElementById('html-input');
    const htmlFile = document.getElementById('html-file');
    const fileName = document.getElementById('file-name');
    const fileNameInput = document.getElementById('file-name-input');
    const previewButton = document.getElementById('preview-button');
    const convertButton = document.getElementById('convert-button');
    const downloadHtmlButton = document.getElementById('download-html-button');
    const downloadPdfButton = document.getElementById('download-pdf-button');
    const clearButton = document.getElementById('clear-button');
    // 削除または使用しない変数を修正
    // const htmlPreview = document.getElementById('html-preview'); // このHTML要素はindex.htmlに存在しない
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
        
        // プレビューフレームをクリア
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame) {
            const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            frameDoc.open();
            frameDoc.write('');
            frameDoc.close();
        }
        
        imagePreviewContainer.style.display = 'none';
        imagePreview.innerHTML = '';
        
        // すべてのダウンロードボタンを無効化
        convertButton.disabled = true;
        downloadHtmlButton.disabled = true;
        downloadPdfButton.disabled = true;
        
        // 入力欄をリセット
        if (htmlFile) {
            htmlFile.value = '';
            fileName.textContent = 'ファイルが選択されていません';
        }
        
        // ファイル名入力欄もクリア
        if (fileNameInput) {
            fileNameInput.value = '';
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

        // HTMLプレビューをiframeに表示
        const previewFrame = document.getElementById('preview-frame');
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(currentHtmlSource);
        frameDoc.close();
        
        // プレビューフレームを表示
        previewFrame.style.display = 'block';
        
        // プレビューフレームの高さを調整（ロード後）
        previewFrame.onload = function() {
            try {
                // iframeのコンテンツの高さに合わせる（最小600px、最大1000px）
                const height = Math.max(600, Math.min(1000, 
                    previewFrame.contentWindow.document.body.scrollHeight || 600));
                previewFrame.style.height = height + 'px';
                console.log('プレビューの高さを調整しました:', height);
            } catch (e) {
                console.error('高さ調整エラー:', e);
            }
        };
        
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
        
        // ファイル名がまだ設定されていない場合は確認ダイアログを表示
        if (!fileNameInput.value.trim()) {
            const userFileName = prompt('ダウンロードするファイル名を入力してください（拡張子不要）:', 'html2img_' + getFormattedDate());
            if (userFileName !== null) {
                fileNameInput.value = userFileName.trim();
            }
        }

        // プレビューがまだ表示されていない場合は表示する
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame) {
            const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            if (!frameDoc.body.innerHTML || frameDoc.body.innerHTML === '') {
                frameDoc.open();
                frameDoc.write(currentHtmlSource);
                frameDoc.close();
            }
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
        // プレビューフレームの高さを参考にする（最小600px）
        const previewHeight = document.getElementById('preview-frame').style.height;
        const heightValue = parseInt(previewHeight) || 600;
        iframe.style.height = isMobile ? 
            Math.max(600, heightValue) + 'px' : 
            Math.max(900, heightValue) + 'px';
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
                    
                    // ファイル名の生成（ユーザー指定または現在の日時）
                    let filename;
                    if (fileNameInput && fileNameInput.value.trim() !== '') {
                        // ユーザー指定のファイル名を使用（拡張子を追加）
                        filename = fileNameInput.value.trim() + '.' + format;
                    } else {
                        // デフォルトのファイル名生成（現在の日時を含む）
                        filename = 'html2img_' + getFormattedDate() + '.' + format;
                    }
                    
                    // iOS Safariの場合は特別な処理
                    const isIOS = isIOSDevice();
                    const isSafari = getMobileBrowserType() === 'safari';
                    
                    if (isIOS && isSafari) {
                        // iOS Safariの場合は新しいタブで画像を開く
                        const imgUrl = URL.createObjectURL(blob);
                        
                        // ダウンロード情報を表示
                        const downloadInfo = document.createElement('div');
                        downloadInfo.className = 'download-info';
                        downloadInfo.innerHTML = `
                            <p>iOS Safariでは直接ダウンロードできないため、以下の手順で保存してください：</p>
                            <ol>
                                <li><a href="${imgUrl}" target="_blank" class="ios-download-link">ここをタップ</a>して画像を新しいタブで開く</li>
                                <li>画像を長押しして「イメージを保存」を選択</li>
                            </ol>
                        `;
                        
                        // スタイルの追加
                        const style = document.createElement('style');
                        style.textContent = `
                            .download-info {
                                margin: 15px 0;
                                padding: 15px;
                                background-color: #fff9db;
                                border: 1px solid #ffd43b;
                                border-radius: 8px;
                                font-size: 14px;
                            }
                            .ios-download-link {
                                display: inline-block;
                                padding: 8px 16px;
                                background-color: #3498db;
                                color: white;
                                text-decoration: none;
                                border-radius: 4px;
                                margin: 10px 0;
                            }
                        `;
                        document.head.appendChild(style);
                        
                        // 既存のダウンロード情報があれば削除
                        const existingInfo = document.querySelector('.download-info');
                        if (existingInfo) {
                            existingInfo.remove();
                        }
                        
                        // 画像プレビューの前に挿入
                        imagePreviewContainer.insertBefore(downloadInfo, imagePreview);
                    } else {
                        // 通常のブラウザではFileSaver.jsを使用
                        try {
                            saveAs(blob, filename);
                            console.log('ダウンロード開始:', filename);
                        } catch (e) {
                            console.error('ダウンロードエラー:', e);
                            
                            // エラーが発生した場合は代替手段を提供
                            const imgUrl = URL.createObjectURL(blob);
                            const downloadLink = document.createElement('a');
                            downloadLink.href = imgUrl;
                            downloadLink.download = filename;
                            downloadLink.textContent = '画像を保存できない場合はここをクリック/タップ';
                            downloadLink.className = 'fallback-download-link';
                            downloadLink.style.display = 'block';
                            downloadLink.style.margin = '15px 0';
                            downloadLink.style.textAlign = 'center';
                            
                            // 既存のリンクがあれば削除
                            const existingLink = imagePreviewContainer.querySelector('.fallback-download-link');
                            if (existingLink) {
                                existingLink.remove();
                            }
                            
                            // 画像プレビューの後に挿入
                            imagePreviewContainer.appendChild(downloadLink);
                        }
                    }
                    
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

    // HTMLダウンロードボタンのクリック時の処理
    downloadHtmlButton.addEventListener('click', function() {
        if (!currentHtmlSource) {
            alert('HTMLコードを入力するか、HTMLファイルをアップロードしてください。');
            return;
        }
        
        // ファイル名がまだ設定されていない場合は確認ダイアログを表示
        if (!fileNameInput.value.trim()) {
            const userFileName = prompt('ダウンロードするファイル名を入力してください（拡張子不要）:', 'download_' + getFormattedDate());
            if (userFileName !== null) {
                fileNameInput.value = userFileName.trim();
            }
        }

        // HTMLファイルを作成してダウンロード
        const blob = new Blob([currentHtmlSource], { type: 'text/html;charset=utf-8' });
        
        // ファイル名の設定（ユーザー指定または現在の日時）
        let filename;
        if (fileNameInput && fileNameInput.value.trim() !== '') {
            // ユーザー指定のファイル名を使用（拡張子を追加）
            filename = fileNameInput.value.trim() + '.html';
        } else {
            // デフォルトのファイル名生成（現在の日時を含む）
            filename = 'download_' + getFormattedDate() + '.html';
        }
        
        // iOS Safariの場合は特別な処理
        const isIOS = isIOSDevice();
        const isSafari = getMobileBrowserType() === 'safari';
        
        if (isIOS && isSafari) {
            // iOS Safariの場合はデータURLを生成
            try {
                const htmlUrl = URL.createObjectURL(blob);
                
                // ダウンロード情報を表示
                const downloadInfo = document.createElement('div');
                downloadInfo.className = 'download-info html-download-info';
                downloadInfo.innerHTML = `
                    <p>iOS Safariでは直接HTMLファイルをダウンロードできないため、以下の手順で保存してください：</p>
                    <ol>
                        <li><a href="${htmlUrl}" target="_blank" class="ios-download-link">ここをタップ</a>してHTMLを新しいタブで開く</li>
                        <li>画面を長押ししてコピーするか、シェアボタンから「ファイルに保存」を選択</li>
                    </ol>
                `;
                
                // 既存のダウンロード情報があれば削除
                const existingInfo = document.querySelector('.html-download-info');
                if (existingInfo) {
                    existingInfo.remove();
                }
                
                // プレビューセクションの上部に挿入
                const previewSection = document.querySelector('.preview-section');
                previewSection.insertBefore(downloadInfo, previewSection.firstChild);
                
                console.log('iOS向けHTMLリンクを生成しました');
            } catch (e) {
                console.error('iOS HTML生成エラー:', e);
                alert('HTMLの表示に失敗しました: ' + e.message);
            }
        } else {
            // 通常のブラウザではFileSaver.jsを使用
            try {
                saveAs(blob, filename);
                console.log('HTMLダウンロード開始:', filename);
            } catch (e) {
                console.error('HTMLダウンロードエラー:', e);
                
                // エラーが発生した場合は代替手段を提供
                const htmlUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = htmlUrl;
                downloadLink.download = filename;
                downloadLink.textContent = 'HTMLを保存できない場合はここをクリック/タップ';
                downloadLink.className = 'fallback-download-link html-fallback-link';
                downloadLink.style.display = 'block';
                downloadLink.style.margin = '15px 0';
                downloadLink.style.textAlign = 'center';
                
                // 既存のリンクがあれば削除
                const existingLink = document.querySelector('.html-fallback-link');
                if (existingLink) {
                    existingLink.remove();
                }
                
                // プレビューセクションの最後に挿入
                document.querySelector('.preview-section').appendChild(downloadLink);
            }
        }
    });

    // PDFダウンロードボタンのクリック時の処理
    downloadPdfButton.addEventListener('click', function() {
        if (!currentHtmlSource) {
            alert('HTMLコードを入力するか、HTMLファイルをアップロードしてください。');
            return;
        }
        
        // ファイル名がまだ設定されていない場合は確認ダイアログを表示
        if (!fileNameInput.value.trim()) {
            const userFileName = prompt('ダウンロードするファイル名を入力してください（拡張子不要）:', 'pdf_' + getFormattedDate());
            if (userFileName !== null) {
                fileNameInput.value = userFileName.trim();
            }
        }

        // プレビューがまだ表示されていない場合は表示する
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame) {
            const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            if (!frameDoc.body.innerHTML || frameDoc.body.innerHTML === '') {
                frameDoc.open();
                frameDoc.write(currentHtmlSource);
                frameDoc.close();
            }
        }

        // iframeを使用してHTMLをレンダリングし、それをPDFに変換する
        const iframe = document.createElement('iframe');
        // モバイルデバイスではサイズを小さくする
        const isMobile = isMobileDevice();
        iframe.style.width = isMobile ? '800px' : '1200px';
        // プレビューフレームの高さを参考にする（最小600px）
        const previewHeight = document.getElementById('preview-frame').style.height;
        const heightValue = parseInt(previewHeight) || 600;
        iframe.style.height = isMobile ? 
            Math.max(600, heightValue) + 'px' : 
            Math.max(900, heightValue) + 'px';
        iframe.style.border = 'none';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.zIndex = '-1000';
        document.body.appendChild(iframe);

        // スタイルを追加したHTML
        const fixedHtmlSource = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
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
                    .html2pdf-container {
                        width: 100%;
                        padding: 20px;
                        overflow: hidden;
                    }
                </style>
            </head>
            <body>
                <div class="html2pdf-container">
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

        // iframeの読み込みが完了したらPDF変換
        iframe.onload = function() {
            console.log('iframeの読み込みが完了しました - PDF変換開始');
            
            // html2canvasでキャプチャ
            const container = iframeDoc.querySelector('.html2pdf-container');
            html2canvas(container, {
                scale: parseFloat(scale.value),
                backgroundColor: bgColor.value,
                logging: true,
                useCORS: true,
                allowTaint: true,
                foreignObjectRendering: true,
                width: iframe.contentWindow.document.documentElement.scrollWidth,
                height: iframe.contentWindow.document.documentElement.scrollHeight
            }).then(function(canvas) {
                console.log('Canvas生成成功 (PDF用): サイズ', canvas.width, 'x', canvas.height);

                try {
                    // jsPDFインスタンスを作成
                    const pdf = new jspdf.jsPDF({
                        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                        unit: 'mm',
                    });
                    
                    // キャンバスをイメージとしてPDFに追加
                    const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    
                    // 画像のアスペクト比を維持しながらPDFに追加
                    const imgProps = pdf.getImageProperties(imgData);
                    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
                    const imgWidth = imgProps.width * ratio;
                    const imgHeight = imgProps.height * ratio;
                    
                    // 中央に配置するための計算
                    const x = (pdfWidth - imgWidth) / 2;
                    const y = (pdfHeight - imgHeight) / 2;
                    
                    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
                    
                    // PDFをダウンロード - ユーザー指定のファイル名を使用
                    let filename;
                    if (fileNameInput && fileNameInput.value.trim() !== '') {
                        // ユーザー指定のファイル名を使用（拡張子を追加）
                        filename = fileNameInput.value.trim() + '.pdf';
                    } else {
                        // デフォルトのファイル名生成（現在の日時を含む）
                        filename = 'pdf_' + getFormattedDate() + '.pdf';
                    }
                    
                    // iOS Safariの場合は特別な処理
                    const isIOS = isIOSDevice();
                    const isSafari = getMobileBrowserType() === 'safari';
                    
                    if (isIOS && isSafari) {
                        // iOSデバイスの場合は、データURLを生成してリンクを表示
                        try {
                            // blob URLを作成
                            const pdfDataUri = pdf.output('datauristring');
                            
                            // PDFダウンロード情報を表示
                            const downloadInfo = document.createElement('div');
                            downloadInfo.className = 'download-info pdf-download-info';
                            downloadInfo.innerHTML = `
                                <p>iOS Safariでは直接PDFをダウンロードできないため、以下の手順で保存してください：</p>
                                <ol>
                                    <li><a href="${pdfDataUri}" target="_blank" class="ios-download-link">ここをタップ</a>してPDFを新しいタブで開く</li>
                                    <li>画面右上のシェアボタンをタップ</li>
                                    <li>「ファイルに保存」を選択</li>
                                </ol>
                            `;
                            
                            // 既存のダウンロード情報があれば削除
                            const existingInfo = document.querySelector('.pdf-download-info');
                            if (existingInfo) {
                                existingInfo.remove();
                            }
                            
                            // プレビューセクションの上部に挿入
                            const previewSection = document.querySelector('.preview-section');
                            previewSection.insertBefore(downloadInfo, previewSection.firstChild);
                            
                            console.log('iOS向けPDFリンクを生成しました');
                        } catch (e) {
                            console.error('iOS PDF生成エラー:', e);
                            alert('PDFの表示に失敗しました: ' + e.message);
                        }
                    } else {
                        // 通常のブラウザではjsPDFの標準機能を使用
                        try {
                            pdf.save(filename);
                            console.log('PDFダウンロード開始:', filename);
                        } catch (e) {
                            console.error('PDF保存エラー:', e);
                            
                            // エラーが発生した場合は代替手段を提供
                            const pdfDataUri = pdf.output('datauristring');
                            const downloadLink = document.createElement('a');
                            downloadLink.href = pdfDataUri;
                            downloadLink.download = filename;
                            downloadLink.textContent = 'PDFを保存できない場合はここをクリック/タップ';
                            downloadLink.className = 'fallback-download-link';
                            downloadLink.style.display = 'block';
                            downloadLink.style.margin = '15px 0';
                            downloadLink.style.textAlign = 'center';
                            
                            // 既存のリンクがあれば削除
                            const existingLink = document.querySelector('.fallback-download-link');
                            if (existingLink) {
                                existingLink.remove();
                            }
                            
                            // プレビューセクションの最後に挿入
                            document.querySelector('.preview-section').appendChild(downloadLink);
                        }
                    }
                } catch (error) {
                    console.error('PDF変換エラー:', error);
                    alert('PDFの作成中にエラーが発生しました: ' + error.message);
                }
                
                // 使用後にiframeを削除
                document.body.removeChild(iframe);
            }).catch(function(error) {
                console.error('Canvas生成エラー (PDF用):', error);
                alert('PDFの作成中にエラーが発生しました: ' + error.message);
                document.body.removeChild(iframe);
            });
        };
    });

    // 初期表示設定
    if (imageFormat.value !== 'jpeg') {
        jpegQualityContainer.style.display = 'none';
    }
});