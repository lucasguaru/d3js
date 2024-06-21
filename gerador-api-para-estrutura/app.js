let objectList = [
    "ConsigneePostRequestBody",
    "FacilityPostRequestBody",
    "LanePostRequestBody",
    "PurchaseOrderPostRequestBody",
    "ShipmentPostRequestBody",
    "TenderPostRequestBody",
    "WeekPostRequestBody",
    "PurchaseOrderShipperOrderPostRequestBody",
]

const fromTo = {
    "#/components/schemas/UUID": "UUID",
    "#/components/schemas/DateTime": "DateTime",
    "#/components/schemas/Date": "Date",
    "#/components/schemas/CurrencyCode": "CurrencyCode",
    }

function log(value, text) {
    // debugger/
    if (text) {
        console.log(text, value)
    } else {
        console.log(value)
    }
    return value
}

function lastSubstrAfter(text, sub) {
    return text.substring(text.lastIndexOf(sub) + 1, text.length)
}
function lastRef(text) {
    return lastSubstrAfter(text, "/")
}

function getTypeName(prop) {
    if (prop["type"]) {
        return prop.type
    }
    if (prop["$ref"]) {
        const ref = prop["$ref"]
        if (fromTo[(ref)]) {
            return (fromTo[ref])
        } else {
            return lastRef(ref)
        }
    }
    if (prop.anyOf) {
        let refName = prop.anyOf[0]["$ref"]
        if (!refName) return prop.anyOf[0]["type"]
        refName = lastRef(refName)
        return mapApiFields(refName)
    }
    // if (prop.anyOf) return mapApiFields(prop.anyOf[0]["$ref"].substring(0, ))
    
    return ""
}

function getSchema(schemaName) {
    return schemas[schemaName]
}

function mapApiFields(objectName) {

    let obj = getSchema(objectName)
    if (obj.properties) {
        return Object.keys(obj.properties).map(key => {
            const prop = obj.properties[key]
            // log(prop)
            let result =  {
                fieldName: key,
                type: (getTypeName(prop)),
                description: prop.description,
                // _all: prop,
            }
            if (getSchema(result.type)) {
                result.child = mapApiFields(result.type)
            }

            let refName = prop.items?.["$ref"]
            if (refName) {
                refName = lastRef(refName)
                if (getSchema(refName)) {
                    result.child = mapApiFields(refName)
                }
            }
            return result;
        })
    }
    if (obj.type) return obj.type
}

objectList = objectList.map((object, index) => {
    return {
        entity: object,
        fields: mapApiFields(object, index)
    }
})

console.log(objectList[0])
console.log(objectList[0].fields[7])

console.log(objectList)