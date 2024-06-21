let resultsContainer = document.getElementsByClassName("container")[0];
let debounceTimeout;

const debounce = (func, delay) => {
    return (...args) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const validateInput = (el) => {
    if (el.value === "") {
        resultsContainer.innerHTML = "<p>Type something in the above search input</p>";
    } else {
        debounceGenerateResults(el.value, el);
    }
};

const generateResults = (searchValue, inputField) => {
    fetch(
        "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch="
        + searchValue
    )
    .then(response => response.json())
    .then(data => {
        let results = data.query.search;
        let numberOfResults = data.query.search.length;
        resultsContainer.innerHTML = "";
        for (let i = 0; i < numberOfResults; i++) {
            let result = document.createElement("div");
            result.classList.add("results");
            result.innerHTML = `
            <div>
                <h3>${results[i].title}</h3>
                <p>${results[i].snippet}</p>
            </div>
            <a href="https://en.wikipedia.org/?curid=${results[i].pageid}" target="_blank">Read More</a>
            `;
            resultsContainer.appendChild(result);
        }
        if (inputField.value === "") {
            resultsContainer.innerHTML = "<p>Type something in the above search input</p>";
        }
    });
};

const debounceGenerateResults = debounce(generateResults, 300);

// Attach the validateInput function to the input element
document.querySelector('.search input').addEventListener('keyup', function() {
    validateInput(this);
});
