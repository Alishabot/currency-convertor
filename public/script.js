const currencies = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    RON: 4.62,
};

const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const resultText = document.getElementById('resultText');
const rateText = document.getElementById('rateText');
const swapBtn = document.getElementById('swap');
const publishBtn = document.getElementById('publish');
const modal = document.getElementById('shareModal');
const shareLink = document.getElementById('shareLink');
const copyBtn = document.getElementById('copyBtn');
const closeBtn = document.querySelector('.close');

// Initialize currency selects
function initializeCurrencies() {
    Object.keys(currencies).forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.textContent = currency;
        fromCurrency.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.textContent = currency;
        toCurrency.appendChild(option2);
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
}

// Convert currency
function convert() {
    const amount = parseFloat(amountInput.value) || 0;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (amount <= 0) {
        resultText.textContent = 'Enter an amount to convert';
        rateText.textContent = '';
        return;
    }

    const sourceRate = currencies[from];
    const targetRate = currencies[to];
    const amountInUSD = amount / sourceRate;
    const result = (amountInUSD * targetRate).toFixed(2);
    const rate = (targetRate / sourceRate).toFixed(4);

    resultText.textContent = `${amount} ${from} = ${result} ${to}`;
    rateText.textContent = `1 ${from} = ${rate} ${to}`;
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    convert();
}

// Publish conversion
function publishConversion() {
    const amount = amountInput.value;
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const result = resultText.textContent;

    const baseURL = window.location.origin;
    const params = `?amount=${amount}&from=${from}&to=${to}`;
    const fullURL = baseURL + '/' + params;

    shareLink.textContent = fullURL;
    modal.style.display = 'flex';
}

// Copy link to clipboard
function copyToClipboard() {
    const text = shareLink.textContent;
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Link';
        }, 2000);
    });
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
}

// Load URL parameters
function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const amount = params.get('amount');
    const from = params.get('from');
    const to = params.get('to');

    if (amount) amountInput.value = amount;
    if (from) fromCurrency.value = from;
    if (to) toCurrency.value = to;

    convert();
}

// Event listeners
amountInput.addEventListener('input', convert);
fromCurrency.addEventListener('change', convert);
toCurrency.addEventListener('change', convert);
swapBtn.addEventListener('click', swapCurrencies);
publishBtn.addEventListener('click', publishConversion);
copyBtn.addEventListener('click', copyToClipboard);
closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Initialize
initializeCurrencies();
loadFromURL();
