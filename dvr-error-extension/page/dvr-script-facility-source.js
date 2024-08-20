function findFacilitySource(row) {
    console.log('Find Facility:', row);
    let facilityExternalId = row["Pick-up Location Reference Number"]
    let newUrl = `${hostname}/admin/facility?query=${facilityExternalId}`
    window.open(newUrl, '_blank');
}

function createFacilitySource(row) {
    console.log('Create Facility:', row);

    let provider = 'Shipper'
    let shipper = shipperName;
    // let businessEntity = 'Customer'
    // let businessEntityName = row["Parent Customer Name"]
    let businessEntity = 'Shipper'
    let businessEntityName = shipperName
    let facilityExternalId = row["Pick-up Location Reference Number"]
    let name = row["Pick-up Location Name"].replaceAll("–", "-")

    let data = { provider, shipper, businessEntity, businessEntityName, facilityExternalId, name }
    console.log('data:', data);

    let dataBase64 = btoa(JSON.stringify(data))

    let newUrl = `${hostname}/admin/facility_business/new?data=${dataBase64}`
    window.open(newUrl, '_blank');
}

function searchAddressSource(row) {
    console.log('Search Address:', row);
    let city = row["Pick-up Location City"]
    let name = row["Pick-up Location Name"]
    let postalCode = row["Pick-up Location Postal Code"]
    let query = city + '+' + name + (postalCode ? '+' + postalCode : '')
    // https://www.google.com/search?q=OLTON+CSS+FARMS+79064
    let newUrl = `https://www.google.com/search?q=${query}`
    window.open(newUrl, '_blank');
}

function openDVRErrorsSource(row) {
    row.ERROR_MESSAGES
    let query = `q[with_row_data]="Pick-up Location Reference Number":"${row["Pick-up Location Reference Number"]}"&q[organization_name_cont]=${shipperName}&q[row_errors_message_cont]=${row.ERROR_MESSAGES}&commit=Filter`
    let newUrl = `${hostname}/dvr/invalid_rows?${query}&commit=Filter`
    log(newUrl)
    window.open(newUrl, '_blank');

}