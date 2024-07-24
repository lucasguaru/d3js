String.prototype.substringAfter = function(value, startPos = 0) {
    let pos = this.indexOf(value, startPos)
    if (pos > -1) {
        return this.substring(pos + value.length, this.length)
    }
    return this
}

String.prototype.substringBefore = function(value, startPos = 0) {
    let pos = this.indexOf(value, startPos)
    if (pos > -1) {
        return this.substring(startPos, pos)
    }
    return this.substring(startPos)
}

function log(value, text) {
    if (text) {
        console.log(text, value);
    } else {
        console.log(value);
    }
    return value;
}

window.addEventListener('load', addDataOnScreen)

function addDataOnScreen() {
    let url = location.href
    if (url.includes('?data=')) {
        let data = JSON.parse(atob(url.substringAfter('?data=')))
        log(data)
        document.querySelector("#facility_business_provider_type").value = data.provider
        document.querySelector("#facility_business_provider_id_field > div > div.row > div.col-sm-4 > div > input").value = data.shipper
        document.querySelector("#facility_business_business_entity_type").value = data.businessEntity
        document.querySelector("#facility_business_business_entity_id_field > div > div.row > div.col-sm-4 > div > input").value = data.businessEntityName
        document.querySelector("#facility_business_external_id").value = data.facilityExternalId
        document.querySelector("#facility_business_name").value = data.name
    }
    
}

// addDataOnScreen()