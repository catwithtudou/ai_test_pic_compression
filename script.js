document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let originalFile = null;

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0056b3';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImage(file);
        }
    });

    // 处理点击上传
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImage(file);
        }
    });

    // 处理图片压缩
    function handleImage(file) {
        originalFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalSize.textContent = `原始大小: ${(file.size / 1024).toFixed(2)} KB`;
            compressImage(e.target.result);
        };
        reader.readAsDataURL(file);
        uploadArea.style.display = 'none';
        previewContainer.style.display = 'block';
    }

    function compressImage(base64) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 保持原始宽高比
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const quality = qualitySlider.value / 100;
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

            compressedImage.src = compressedBase64;

            // 计算压缩后大小
            const compressedSize = Math.round((compressedBase64.length * 3) / 4);
            document.getElementById('compressedSize').textContent =
                `压缩后大小: ${(compressedSize / 1024).toFixed(2)} KB`;
        };
        img.src = base64;
    }

    // 质量滑块变化时重新压缩
    qualitySlider.addEventListener('input', () => {
        if (originalImage.src) {
            compressImage(originalImage.src);
        }
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `compressed_${originalFile.name}`;
        link.href = compressedImage.src;
        link.click();
    });

    // 重置
    resetBtn.addEventListener('click', () => {
        uploadArea.style.display = 'block';
        previewContainer.style.display = 'none';
        fileInput.value = '';
        originalImage.src = '';
        compressedImage.src = '';
        originalSize.textContent = '';
        compressedSize.textContent = '';
        qualitySlider.value = 80;
    });
});