baseCurrencyCodeSelector = document.getElementById('base-currencies')
targetCurrencyCodeSelector = document.getElementById('target-currencies')
currencyAmountInput = document.getElementById('amount')
convertedAmountSection = document.getElementById('converted')
conversion_rates = {}


// Explicitly call updateConvertedCurrency after the page loads
document.addEventListener('DOMContentLoaded', (e) => {
    handleBaseCurrencyUpdate();
}, true);


/**
 * Handle update to base currency selected. Updates conversion rates by
 * requesting conversion rates matching the base currency selected.
 * Handled separately to reduce unnecessary requests that may be made 
 * when changing target currency or the amount to be converted instead.
 */

function handleBaseCurrencyUpdate() {
    baseCode = document.getElementById('base-currencies').value

    // Add loading icon during conversion rates request
    convertedAmountSection.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only"></span></div>'

    fetch(`https://currency-converter-hrfz.onrender.com/rates/${baseCode}`)
        .then(res => res.json())
        .then(data => {
            conversion_rates = data['conversion_rates']

            // Remove loading icon
            convertedAmountSection.innerText = ''
            
            // Update displayed amount to match updated rates for the base currency
            updateConvertedCurrency()
        })
}


/**
 * Handle any updates to target currency and amount to be converted. Handles 
 * display of the converted amount.
 */
function updateConvertedCurrency() {
    let targetCode = document.getElementById('target-currencies').value;
    amount = document.getElementById('amount').value == '' ? 0 : parseFloat(document.getElementById('amount').value);
    currencyAmountInput = amount;
    //If the value is empty, it defaults to 0.

    convertedAmount = amount * (conversion_rates[targetCode] ?? 0) //convert the amount

    convertedAmountSection.innerText = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: `${targetCode}`,
        minimumIntegerDigits: 1,
        minimumFractionDigits: 2,
    }).format(Number(convertedAmount));
}

baseCurrencyCodeSelector.addEventListener('input', handleBaseCurrencyUpdate)
targetCurrencyCodeSelector.addEventListener('input', updateConvertedCurrency)
currencyAmountInput.addEventListener('input', updateConvertedCurrency)