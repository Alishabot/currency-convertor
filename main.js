/**
 * Currency Converter CLI - Main Program
 *
 * A command-line currency converter where users convert amounts
 * between different currencies using fixed exchange rates.
 */

const {
  getExchangeRates,
  validateCurrency,
  normalizeCurrency,
  getUserAmount,
  getUserCurrency,
  rl,
} = require('./utils');

/**
 * Convert amount from source currency to target currency
 *
 * @param {number} amount - Amount to convert
 * @param {string} source_currency - Source currency code
 * @param {string} target_currency - Target currency code
 * @returns {number} Converted amount
 */
function convertCurrency(amount, source_currency, target_currency) {
  const rates = getExchangeRates();
  const sourceRate = rates[source_currency];
  const targetRate = rates[target_currency];

  // Convert from source to USD (base), then from USD to target
  const amountInUSD = amount / sourceRate;
  const convertedAmount = amountInUSD * targetRate;

  return Math.round(convertedAmount * 100) / 100;
}

/**
 * Display available currencies
 */
function displayCurrencies() {
  const rates = getExchangeRates();
  const currencies = Object.keys(rates).join(', ');
  console.log(`Available currencies: ${currencies}`);
}

/**
 * Main program loop
 */
async function main() {
  console.log('Welcome to Currency Converter CLI!\n');

  while (true) {
    displayCurrencies();

    const amount = await getUserAmount();
    if (amount === null) {
      console.log('Thank you for using Currency Converter CLI!');
      rl.close();
      break;
    }

    const rates = getExchangeRates();
    const availableCurrencies = Object.keys(rates).join('/');
    const sourceCurrency = await getUserCurrency(
      `Enter source currency (${availableCurrencies}): `
    );
    if (sourceCurrency === null) {
      console.log('Thank you for using Currency Converter CLI!');
      rl.close();
      break;
    }

    const targetCurrency = await getUserCurrency(
      `Enter target currency (${availableCurrencies}): `
    );
    if (targetCurrency === null) {
      console.log('Thank you for using Currency Converter CLI!');
      rl.close();
      break;
    }

    const convertedAmount = convertCurrency(
      amount,
      sourceCurrency,
      targetCurrency
    );
    console.log(
      `${amount.toFixed(2)} ${sourceCurrency} = ${convertedAmount.toFixed(2)} ${targetCurrency}\n`
    );
  }
}

/* Run the main function */
main();
