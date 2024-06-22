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
        return { typeName: prop.type, refType: "simple-type" }
    }
    if (prop["$ref"]) {
        const ref = prop["$ref"]
        if (fromTo[(ref)]) {
            return { typeName: fromTo[ref], refType: "from-to-ref" }
        } else {
            return { typeName: lastRef(ref), refType: "last-ref" }
        }
    }
    if (prop.anyOf) {
        let refName = prop.anyOf[0]["$ref"]
        if (!refName) return { typeName: prop.anyOf[0]["type"], refType: "any-type-ref" }
        if (fromTo[(refName)]) {
            return { typeName: fromTo[refName], refType: "from-to-ref" }
        }
        return { typeName: lastRef(refName), refType: "any-type-ref" }
        // return mapApiFields(refName)
    }
    // if (prop.anyOf) return mapApiFields(prop.anyOf[0]["$ref"].substring(0, ))
    
    return ""
}

function getSchema(schemaName) {
    return schemas[schemaName]
}

function mapApiFields(objectName, count) {
    // log(`${objectName} - count: ${count}`)
    let obj = getSchema(objectName)
    if (obj.properties) {
        let result = Object.keys(obj.properties).map(key => {
            // log(`${objectName}[${key}] - count: ${count}`)
            const prop = obj.properties[key]
            const { typeName, refType } = getTypeName(prop)
            // log(prop)
            let fields =  {
                fieldName: key,
                id: count++,
                type: typeName,
                description: prop.description,
                // _all: prop,
            }
            // Case it is not comming from table from-to such as UUID
            if (refType != "from-to-ref" && getSchema(fields.type)) {
                let childResult = mapApiFields(fields.type, count)
                if (childResult.fields != "string") {
                    fields.child = childResult.fields
                    count = childResult.count
                }
                // fields.child = mapApiFields(fields.type, count)
            }

            if (prop.type == "array") {
                let refName = prop.items?.["$ref"]
                if (refName) {
                    refName = lastRef(refName)
                    if (getSchema(refName)) {
                        let childResult = mapApiFields(refName, count)
                        fields.child = childResult.fields
                        count = childResult.count
                    }
                }
            }
            return fields
        })
        return { fields: result, count }
        
    }
    if (obj.type) return { fields: obj.type, count };
}

objectList = objectList.map((object, index) => {
    let count = (1000 * (index + 1))
    let result = {
        entity: object.replace("PostRequestBody", ""),
        id: count++,
        fields: mapApiFields(object, count).fields
    }
    return result
})

// console.log(objectList[0])
// console.log(objectList[0].fields[7])

console.log(objectList)

