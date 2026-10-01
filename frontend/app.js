// Fetch API Gateway URL from config.js
const API_GATEWAY_URL = window.CONFIG ? window.CONFIG.API_GATEWAY_URL : '';

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!API_GATEWAY_URL) {
        alert('API Gateway URL is missing. Please set up config.js.');
        return;
    }

    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) return;

    const statusContainer = document.getElementById('statusContainer');
    const resultContainer = document.getElementById('resultContainer');
    const plateResult = document.getElementById('plateResult');

    statusContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    try {
        const base64Image = await convertToBase64(file);
        
        const response = await fetch(API_GATEWAY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Image,
                filename: file.name
            })
        });

        const data = await response.json();

        statusContainer.classList.add('hidden');
        if (data.license_plate) {
            plateResult.textContent = data.license_plate;
            resultContainer.classList.remove('hidden');
        } else {
            plateResult.textContent = 'No plate detected.';
            resultContainer.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        statusContainer.classList.add('hidden');
        alert('Failed to process image. Please try again.');
    }
});

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
}

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
}