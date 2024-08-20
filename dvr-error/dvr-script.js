const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const errorFilter = document.getElementById('errorFilter');
const csvTable = document.getElementById('csvTable');
const headerRow = document.getElementById('headerRow');
const tbody = csvTable.querySelector('tbody');
let jsonData = [];
let originalJsonData = []

const fieldsJson = {
    "Utz-Shipments File": {
        "All": [
            "Pick-up Location Reference Number",
            "Parent Customer Name",
            "Pick-up Location Name",
            "Pick-up Location City",
            "Pick-up Location Postal Code",
            "ERROR_MESSAGES",
            // "ROW_ID"
        ],
        "ISO:MISSING_SOURCE_FACILITY": [
            "Pick-up Location Reference Number",
            "Parent Customer Name",
            "Pick-up Location Name",
            "Pick-up Location City",
            "Pick-up Location Postal Code",
            "ERROR_MESSAGES",
            // "ROW_ID"
        ],
        "ISO:MISSING_DESTINATION_FACILITY": [
            "Delivery Location Reference Number",
            "Parent Customer Name",
            "Delivery Location Name",
            "Delivery Location City",
            "Delivery Location Postal Code",
            "ERROR_MESSAGES",
            // "ROW_ID"
        ]
    }
};

const fieldsAction = {
    "Utz-Shipments File": {
        "ISO:MISSING_SOURCE_FACILITY": [
            { name: "Find Facility", fnAction: findFacilitySource },
            { name: "Search Address", fnAction: searchAddressSource },
            { name: "Create Facility", fnAction: createFacilitySource },
            { name: "DV&R Errors", fnAction: openDVRErrorsSource },
        ],
        "ISO:MISSING_DESTINATION_FACILITY": [
            { name: "Find Facility", fnAction: findFacilityDestination },
            { name: "Search Address", fnAction: searchAddressDestination },
            { name: "Create Facility", fnAction: createFacilityDestination },
            { name: "DV&R Errors", fnAction: openDVRErrorsDestination },
        ],
    }
};

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#f4f4f4';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.backgroundColor = '#fff';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#fff';
    handleFileUpload(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    handleFileUpload(e.target.files[0]);
});

errorFilter.addEventListener('change', (e) => {
    filterTable(e.target.value);
});

let shipperName = null;
let fileName = null;
let fileOriginalFullName = null
let combinationKey = null;
let fieldsToShow = null

function distinctFacility(json) {
    let newJson = {}
    json.forEach(row => {
        let key = ""
        fieldsToShow.forEach(fieldName => {
            key += row[fieldName]
        })
        if (!newJson[key]) {
            newJson[key] = row
        }
    })
    let newJsonArray = []
    for (let prop in newJson) {
        newJsonArray.push(newJson[prop])
    }
    return newJsonArray
}

function sortByFieldName(json, fieldName) {
    return json.sort((a, b) => {
        if (a[fieldName] < b[fieldName]) {
            return -1;
        }
        if (a[fieldName] > b[fieldName]) {
            return 1;
        }
        return 0;
    });
}

function handleFileUpload(file) {
    if (!file.name.endsWith('.csv')) {
        alert('Please upload a CSV file.');
        return;
    }

    fileOriginalFullName = file.name
    shipperName = file.name.split('-')[0];
    fileName = file.name.split('-')[1];
    combinationKey = `${shipperName}-${fileName}`;

    fileInfo.innerHTML = `<strong>Customer:</strong> ${shipperName} &nbsp;&nbsp;&nbsp; <strong>File Name:</strong> ${fileName}`;

    const reader = new FileReader();
    reader.onload = (e) => {
        const csvData = e.target.result;
        originalJsonData = readCsvFileAsJson(csvData, ',', -1)
        jsonData = originalJsonData
        fieldsToShow = fieldsJson[combinationKey]["All"]
        jsonData = distinctFacility(jsonData)
        jsonData = sortByFieldName(jsonData, 'Pick-up Location Reference Number')
        populateErrorFilter(jsonData);
        displayTable(jsonData)
        document.getElementById('errorTypeFilter').style.display = "block"
    };
    reader.readAsText(file);
}

function populateErrorFilter(json) {
    const errorMessages = new Set(json.map(item => item.ERROR_MESSAGES));
    errorFilter.innerHTML = '<option value="All">All</option>';
    errorMessages.forEach(error => {
        const option = document.createElement('option');
        option.value = error;
        option.textContent = error;
        errorFilter.appendChild(option);
    });
}

function displayTable(json, filterValue = 'All') {
    headerRow.innerHTML = '';
    tbody.innerHTML = '';
    csvTable.style.display = 'table';

    fieldsToShow = fieldsJson[combinationKey][filterValue]
    const headersToShow = fieldsToShow || Object.keys(json[0]);
    headersToShow.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    const actionTh = document.createElement('th');
    actionTh.textContent = 'Actions';
    headerRow.appendChild(actionTh);

    json.forEach(row => {
        const tr = document.createElement('tr');
        headersToShow.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });

        let actions = fieldsAction[combinationKey][row["ERROR_MESSAGES"]] || []

        const actionTd = document.createElement('td');

        actions.forEach(action => {
            const actionLink = document.createElement('a');
            actionLink.href = '#';
            actionLink.innerHTML = action.name;
            actionLink.className = "link-action"
            actionLink.onclick = function() {
                action.fnAction(row);
            }
            // () => action.fnAction.call(row);
            actionTd.appendChild(actionLink);
            const span = document.createElement('span')
            span.innerHTML = "&nbsp;&nbsp;";
            actionTd.appendChild(span);
        })

        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}

function filterTable(filterValue) {
    const filteredData = filterValue === 'All' ? jsonData : jsonData.filter(row => row.ERROR_MESSAGES === filterValue);
    displayTable(filteredData, filterValue);
}

let hostname =  "https://app.iso.io"
if (location.href.startsWith("http://127.0.0.1") ||
    location.href.startsWith("chrome-extension://ionddbbajfnnldeeegmbaflgnbphfjhj")) {
    hostname =  "https://6472-ssra-bluebuff-p.staging.iso.io"
}
