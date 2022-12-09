const getCurrencyOptions = async ()=>{
    //get API
    const response = await fetch('https://api.exchangerate.host/symbols');
    //as long as you don't put "async" and "await" before fetch, you get -> Promise <pending>

    // console.log(response)//response object
    const json = await response.json();//await again

    return json.symbols;
    
}

// console.log(getCurrencyOptions());//use await again, if not, you will get promise instead of list of values provided by API
//the right console log:
// getCurrencyOptions().then(console.log);

const getCurrencyRate = async (fromCurrency, toCurrency) => {
    //URL object
    const currencyConvertUrl = new URL("https://api.exchangerate.host/convert");
    //append() method of the URLSEarchParams interface appends a specified key/value pair as a new search parameter
    currencyConvertUrl.searchParams.append("from", fromCurrency);
    currencyConvertUrl.searchParams.append("to", toCurrency);

    const response = await fetch(currencyConvertUrl);
    // console.log(response)
    const json = await response.json();

    return json.result;
};


const appendOptionToSelect = (selectElement, optionItem) =>{
    const optionElement = document.createElement("option");
    optionElement.value = optionItem.code;
    optionElement.textContent = optionItem.description;

    selectElement.appendChild(optionElement);
};

const populateSelectElement = (selectElement, optionList) =>{
    optionList.forEach(optionItem=>{
        appendOptionToSelect(selectElement, optionItem);

    })
}

const setupCurrencies = async () =>{
    const fromCurrencyElem = document.getElementById('fromCurrency');
    const toCurrencyElem = document.getElementById('toCurrency');

    const currencyOptions = await getCurrencyOptions();
    const currencies = Object.keys(currencyOptions).map(currencyKey => currencyOptions[currencyKey]);
    console.log(currencies)

    populateSelectElement(fromCurrencyElem, currencies);
    populateSelectElement(toCurrencyElem, currencies);
}
const setupEventListener = () => {
    const formElement = document.getElementById('convertForm');
    formElement.addEventListener('submit', async event =>{
        //doesn't reload the page when you click the button and doesn't stop java script 
        event.preventDefault();

        const fromCurrency = document.getElementById('fromCurrency');
        const toCurrency = document.getElementById('toCurrency');
        const amount = document.getElementById('amount');
        const convertResultElem = document.getElementById('convertResult');
        try{
            //getCurrencyRate is async function, so you need await again
            const rate = await getCurrencyRate(
                fromCurrency.value, 
                toCurrency.value
                );
                const amountValue = Number(amount.value);
        const conversionResult = Number(amountValue * rate).toFixed(2);
        convertResultElem.textContent = `${amountValue} ${fromCurrency.value} = ${conversionResult} ${toCurrency.value}`
        }catch (error){
            convertResultElem.textContent = `There was an error getting the conversion rate [${error.message}]`;
            convertResultElem.classList.add('error');
        }

        
    })
}
setupCurrencies();
setupEventListener();