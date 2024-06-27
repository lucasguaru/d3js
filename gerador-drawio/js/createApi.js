let yStart = 180;
let xStart = 670;
let yIncrement = 20;
let yApiIncrement = 40;
let xIncrement = 10;

function log(value, text) {
    if (text) {
        console.log(text, value);
    } else {
        console.log(value);
    }
    return value;
}

function createField(apiName, items, x, parentName = "") {
    
    const createMxCell = (id, field) => {
        const fieldScaped = scapeValue(parentName + field.fieldName)
        const descScaped = scapeValue(field.description)
        let style = 'style="rounded=0;whiteSpace=wrap;html=1;fontSize=10;"'
        // if (connectionsData.find(conn => conn.to.id == id)) {
        //     style = 'style="rounded=0;whiteSpace=wrap;html=1;fontSize=10;fillColor=#e1d5e7;strokeColor=#9673a6;opacity=70;"'
        // }
        return `
        <UserObject label="${fieldScaped}" tooltip="${descScaped}" tags="Api${apiName}" id="${id}">
            <mxCell ${style} vertex="1" parent="1">
                <mxGeometry x="${x}" y="${yStart}" width="180" height="20" as="geometry"/>
            </mxCell>
        </UserObject>`;
    };
    
    let result = ""
    items.forEach((field) => {
        const id = field.id;
        result += createMxCell(id, field);
        yStart += (yIncrement);
        if (field.child && Array.isArray(field.child)) {
            result += createField(apiName, field.child, x + xIncrement, field.fieldName + ".");
        }
    });
    return result
}

const entityCoord = {
    "Lane": { x: 490, y: 80},
    "PurchaseOrderShipperOrder": { x: 810, y: 80},
    "Consignee": { x: 490, y: 320},
    "Facility": { x: 810, y: 320},
    "Week": { x: 1130, y: 320},
    "PurchaseOrder": { x: 1450, y: 320},
    "Shipment": { x: 770, y: 680},
    "Tender": { x: 420, y: 2430},
    "aaaaaaaaaa": { x: 1000, y: 1000},
}

const apiOrder = {
    "PurchaseOrder": 1,
    "Week": 2,
    "PurchaseOrderShipperOrder": 3,
    "Lane": 4,
    "Facility": 5,
    "Consignee": 6,
    "Shipment": 7,
    "Tender": 8,
}

// Create Api
function createAllApis(items) {
    yStart = 180;
    yIncrement = 20;
    yApiIncrement = 40;
    xIncrement = 10;
    let tags = ""

    // Function that creates Header concatenated with fields
    const createMxGraphModel = (id, apiName, fieldResult, x, y) => {
        apiName = scapeValue(apiName).replace("PostRequestBody", "")
        tags += `Api${apiName} \n`
        return `
        <UserObject label="${apiName}" link="data:action/json,{&quot;actions&quot;:[{&quot;toggle&quot;:{&quot;tags&quot;:[&quot;Api${apiName}&quot;]}}]}" id="${id}">
            <mxCell style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
                <mxGeometry x="${x}" y="${y}" width="200" height="40" as="geometry"/>
            </mxCell>
        </UserObject>${fieldResult}`
    };

    // Adding sort order to have the connection lines behind the other objects
    let sortedItems = items.map(item => {
        return {...item, order: apiOrder[item.entity]}
    }).sort( (a, b) => a.order - b.order)

    // For each api in the list
    let apiResult = ""
    sortedItems.forEach(item => {
        let apiName = item.entity
        let apiCoord = entityCoord[apiName]

        // Create the fields first
        yStart = apiCoord.y + yApiIncrement
        let fieldResult = createField(apiName, item.fields, apiCoord.x + 10)

        // Create the Header sending the fields string assembled
        apiResult += createMxGraphModel(item.id, apiName, fieldResult, apiCoord.x, apiCoord.y)

        // Create the connections
        let filteredConnections = connectionsData.filter(connection => connection.to.parent.startsWith(apiName))
        apiResult += createConnections(filteredConnections)

    })

    log(tags)
    return apiResult;
}

