const searchBy = document.querySelector('#searchBy');
const searchDataForm = document.querySelector('#searchDataForm');
const searchFetched = document.querySelector('#searchFetched');
const outputResults = document.querySelector('#outputResults .row');

// callbacks
searchDataForm.addEventListener('submit', function(e) {
    switch (searchBy.value) {
        case "searchByCountry":
            getDataByCountry(searchFetched.value, e);
            break;
    }
});

searchBy.addEventListener('change', function(e) {
    switch (e.target.value) {
        case "searchByCountry":
            getAllCountries(e);
            break;

        default:
            break;
    }
});

function countrySortByHandler(countryDataArr) {
    const countrySortBy = document.querySelector('#countrySortForm #sortBy');
    countrySortBy.addEventListener('change', function(e) {
        switch (e.target.value) {
            case "today":
                getDataByCountryDiff(countryDataArr, e);
                break;

            default:
                break;
        }
    });
}

function getAllCountries(e) {
    e.preventDefault();

    // reset all countries data 
    searchFetched.innerHTML = '';

    // add loader 
    searchFetched.classList.add('loader');

    // create an xhr object
    const xhr = new XMLHttpRequest();

    // open 
    xhr.open('GET', 'https://covid19-api.org/api/countries', true);

    // load
    xhr.onreadystatechange = function() {
        if (this.status === 200 && this.readyState === 4) {
            const countries = JSON.parse(this.responseText);
            searchFetched.classList.remove('loader');

            // loop countries 
            countries.forEach((country) => {
                const selectOption = document.createElement('option');
                selectOption.setAttribute('value', country.alpha2);
                selectOption.innerText = `${country.name}`;
                searchFetched.appendChild(selectOption);
            });
        }
    }

    xhr.send();
}

function getDataByCountry(country, e) {
    e.preventDefault();

    // reset all countries data 
    outputResults.innerHTML = '';

    // add loader 
    outputResults.parentElement.classList.add('loader');

    //  create an xhr object
    const xhr = new XMLHttpRequest();

    // open
    xhr.open('GET', `https://covid19-api.org/api/status/${country}`, true);

    // load 
    xhr.onload = function() {
        if (this.status === 200) {
            outputResults.parentElement.classList.remove('loader');

            // get data 
            const country = JSON.parse(this.responseText);
            outputResults.innerHTML = `
            <form class="mb-4" id="countrySortForm">
                <div class="form-row">
                    <div class="col-sm-4 ml-auto">
                        <select id="sortBy" class="form-control">
                            <option value="noselect">Sort By</option>
                            <option value="today">Today</option>
                        </select>
                    </div>
                </div>
            </form>
        <h4 class="text-center text-primary mb-4">Last Updated: ${country.last_update}</h4>
        <div class="col-sm-6 col-md-3 mb-2">
            <div class="circle-wrapper bg-warning d-flex justify-content-center align-items-center">
                Country: ${country.country}
            </div>
        </div>
        <div class="col-sm-6 col-md-3 mb-2">
            <div class="circle-wrapper bg-primary d-flex justify-content-center align-items-center">
                Cases: ${country.cases}
            </div>
        </div>
        <div class="col-sm-6 col-md-3 mb-2">
            <div class="circle-wrapper bg-danger d-flex justify-content-center align-items-center">
                Death: ${country.deaths}
            </div>
        </div>
        <div class="col-sm-6 col-md-3 mb-2">
            <div class="circle-wrapper bg-success d-flex justify-content-center align-items-center">
                Recovered: ${country.recovered}
            </div>
        </div>
        `;
            // now handle dynamic generated sort by select box event
            countrySortByHandler(country);
        }
    }

    // send
    xhr.send();
}

function getDataByCountryDiff(countryDataArr, e) {
    e.preventDefault();

    // reset all countries data 
    outputResults.innerHTML = '';

    // add loader 
    outputResults.parentElement.classList.add('loader');

    //  create an xhr object
    const xhr = new XMLHttpRequest();

    // open
    xhr.open('GET', `https://covid19-api.org/api/diff/${countryDataArr.country}`, true);

    // load 
    xhr.onload = function() {
        if (this.status === 200) {
            outputResults.parentElement.classList.remove('loader');

            // get data 
            const dailyTally = JSON.parse(this.responseText);
            outputResults.innerHTML = `
            <form class="mb-4" id="countrySortForm">
                <div class="form-row">
                    <div class="col-sm-4 ml-auto">
                        <select id="sortBy" class="form-control">
                            <option value="noselect">Sort By</option>
                            <option value="today">Today</option>
                        </select>
                    </div>
                </div>
            </form>
            <!-- Country Sort By Daily Tally -->
            <div class="col-sm-6 mx-auto mb-4">
                    <div class="card text-center">
                        <div class="card-header">
                            Last updated: ${dailyTally.last_update}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-primary">New Cases</h5>
                            <p class="card-text">Total <span class="font-weight-bold text-primary">${dailyTally.new_cases}</span> new active cases during last 24hrs</p>
                            <h5 class="card-title text-danger">New Deaths</h5>
                            <p class="card-text">Total <span class="font-weight-bold text-danger">${dailyTally.new_deaths}</span> reportedly died during last 24hrs</p>
                            <h5 class="card-title text-success">New Recovered</h5>
                            <p class="card-text">Total <span class="font-weight-bold text-success">${dailyTally.new_recovered}</span> new patients recovered during last 24hrs</p>
                        </div>
                        <div class="card-footer text-muted">
                            Daily Tally
                        </div>
                    </div>
            </div>
        <h4 class="text-center text-primary mb-4">Last Updated: ${countryDataArr.last_update} (Total Tally)</h4>
        <div class="col-sm-6 col-md-3 mb-2">
            <div class="circle-wrapper bg-warning d-flex justify-content-center align-items-center">
                Country: ${countryDataArr.country}
            </div>
        </div>
        <div class="col-sm-6 col-md-3 mb-2">
            <div class="circle-wrapper bg-primary d-flex justify-content-center align-items-center">
                Cases: ${countryDataArr.cases}
            </div>
        </div>
        <div class="col-sm-6 col-md-3 mb-2">
            <div class="circle-wrapper bg-danger d-flex justify-content-center align-items-center">
                Death: ${countryDataArr.deaths}
            </div>
        </div>
        <div class="col-sm-6 col-md-3 mb-2">
            <div class="circle-wrapper bg-success d-flex justify-content-center align-items-center">
                Recovered: ${countryDataArr.recovered}
            </div>
        </div>
        `;
        }
    }

    // send
    xhr.send();
}