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

console.log('read 1')
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('read 2')
        addDataOnScreen()
    }, 100)
})

function typeOnSimpleSelect(value, selector) {
    let select = document.querySelector(selector)
    select.value = value
    select.dispatchEvent(new Event("change", { view: window, bubbles: true, cancelable: true }));
}
let DEBUG = true
function debug(v1, v2, v3) {
    if (DEBUG) {
        // console.log(v1, v2, v3)
        console.log.apply(this, arguments)
    }
}

function addDataOnScreen() {

    console.log('read 3')
    let url = location.href
    log({url})
    if (url.includes('?data=')) {
        let data = JSON.parse(atob(url.substringAfter('?data=')))
        debug(data)
        typeOnSimpleSelect(data.provider, "#facility_business_provider_type")
        
        typeOnSimpleSelect(data.businessEntity, "#facility_business_business_entity_type")
        
        document.querySelector("#facility_business_external_id").value = data.facilityExternalId
        document.querySelector("#facility_business_name").value = data.name

        let businessEntityName = data.businessEntityName
        if (data.businessEntity != "Customer") {
            businessEntityName = data.shipper
        }

        findSelectCount = 0
        // Set provider name
        typeOnSelect(data.shipper, "#facility_business_provider_id_field > div > div.row > div.col-sm-4 > div > input", () => {
            // Set business entity name
            typeOnSelect(businessEntityName, "#facility_business_business_entity_id_field > div > div.row > div.col-sm-4 > div > input", () => {
                document.querySelector("#facility_business_raw_address_field > div > div").innerText = "Required when Facility is not selected"
                let rawAddress = document.querySelector("#facility_business_raw_address")
                rawAddress.focus({ focusVisible: true })
                rawAddress.style.borderColor = "#df99aa";
                rawAddress.style.boxShadow = "0 0 0 0.25rem rgb(172 43 113 / 25%)";
            })
        })

    }
    
}

const inputSelectEl = {
    "#facility_business_provider_id_field > div > div.row > div.col-sm-4 > div > input": "#ui-id-4 > li",
    "#facility_business_business_entity_id_field > div > div.row > div.col-sm-4 > div > input": "#ui-id-5 > li",
}

function getLinkAndClick(nodes, value) {
    nodes.childNodes.forEach(a => {
        if (a.childNodes[0].innerText == value) {
            a.click()
        }
    })
    return { click: function () {}}
}

let countFindSelect = {}

const MAX_RETRY_FIND_SELECT = 100

function findSelect(value, selector, fnCallback) {
    debug("findSelect", value, selector)
    if (!countFindSelect[selector] || countFindSelect[selector] < MAX_RETRY_FIND_SELECT) {
        countFindSelect[selector] = (countFindSelect[selector] || 0) + 1
        debug("countFindSelect[selector]", countFindSelect[selector])
        setTimeout(() => {
            if (selector) {
                let linksList = document.querySelector(selector)
                if (linksList && linksList.childNodes[0].innerText != " Clear") {
                    // debug(selector, countFindSelect[selector])
                    getLinkAndClick(linksList, value)
                    // debug({ findSelectCount })
                    if (fnCallback) fnCallback()
                } else {
                    findSelect(value, selector, fnCallback)
                }
            }
        }, 100)
    } {
        debug(selector, 'None')
    }
}

function typeOnSelect(value, selector, fnCallback) {
    let input = document.querySelector(selector)
    input.nextElementSibling.click()
    
    input.value = value
    input.dispatchEvent(new Event("input", { view: window, bubbles: true, cancelable: true }));
    findSelect(value, inputSelectEl[selector], fnCallback)
}
// addDataOnScreen()