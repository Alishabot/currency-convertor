/**
 * Currency Converter CLI - Utility Functions
 *
 * Helper functions for currency conversion logic.
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Get exchange rates object
 *
 * @returns {Object} Object with currency codes as keys and rates as values
 *                   (USD is base currency with rate 1)
 */
function getExchangeRates() {
  return {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    RON: 4.62,
  };
}

/**
 * Normalize user input for consistent comparison
 *
 * @param {string} currency_input - Raw user input string
 * @returns {string} Normalized currency code in uppercase
 */
function normalizeCurrency(currency_input) {
  return currency_input.toUpperCase().trim();
}

/**
 * Validate if currency is available
 *
 * @param {string} currency - Currency code to validate
 * @returns {boolean} True if currency is valid, false otherwise
 */
function validateCurrency(currency) {
  const rates = getExchangeRates();
  return currency in rates;
}

/**
 * Get and validate user's amount input
 *
 * @returns {Promise<number|null>} Valid amount as number or null if user wants to exit
 */
function getUserAmount() {
  return new Promise((resolve) => {
    const askAmount = () => {
      rl.question("Enter amount (or 'exit' to quit): ", (input) => {
        if (input.toLowerCase() === 'exit') {
          resolve(null);
          return;
        }

        const amount = parseFloat(input);
        if (isNaN(amount) || amount < 0) {
          console.log('Invalid amount! Please enter a valid number.');
          askAmount();
        } else {
          resolve(amount);
        }
      });
    };
    askAmount();
  });
}

/**
 * Get and validate user's currency input
 *
 * @param {string} prompt - Prompt message to display
 * @returns {Promise<string|null>} Valid currency code or null if user wants to exit
 */
function getUserCurrency(prompt) {
  return new Promise((resolve) => {
    const askCurrency = () => {
      rl.question(prompt, (input) => {
        const normalized = normalizeCurrency(input);

        if (normalized === 'EXIT') {
          resolve(null);
          return;
        }

        if (!validateCurrency(normalized)) {
          const rates = getExchangeRates();
          const availableCurrencies = Object.keys(rates).join(', ');
          console.log(
            `Invalid currency! Please choose from: ${availableCurrencies}`
          );
          askCurrency();
        } else {
          resolve(normalized);
        }
      });
    };
    askCurrency();
  });
}

module.exports = {
  getExchangeRates,
  validateCurrency,
  normalizeCurrency,
  getUserAmount,
  getUserCurrency,
  rl,
};
