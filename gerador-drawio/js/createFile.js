let idStart = 300;
function createFile(filename, items) {
    let yBase = 680;
    let yStart = yBase;
    let idIncrement = 1;
    let yIncrement = 20;
    let tagName = filename.replaceAll(" ", "")
    
    const createMxCell = (item, y) => {
        let isObject = typeof item == 'object'
        const fieldScaped = scapeValue(isObject ? item.name : item)
        let style = 'style="rounded=0;whiteSpace=wrap;html=1;fontSize=10;"'
        if (isObject && connectionsData.find(conn => conn.from.id == item.id)) {
            style = 'style="rounded=0;whiteSpace=wrap;html=1;fontSize=10;fillColor=#e1d5e7;strokeColor=#9673a6;opacity=70;"'
        }
        let id = isObject ? item.id :  idStart++
        return `
        <UserObject label="${fieldScaped}" tags="${tagName}" id="${id}">
            <mxCell ${style} vertex="1" parent="1">
                <mxGeometry x="100" y="${y}" width="200" height="20" as="geometry"/>
            </mxCell>
        </UserObject>`;
    };
    
    let result = "";
    items.forEach((item, index) => {
        const y = yStart + (index * yIncrement);
        result += createMxCell(item, y);
    });

    let id = idStart++

    let fullResult = `
        <UserObject label="${filename}" link="data:action/json,{&quot;actions&quot;:[{&quot;toggle&quot;:{&quot;tags&quot;:[&quot;${tagName}&quot;]}}]}" id="${id}">
            <mxCell style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1" >
                <mxGeometry x="90" y="${yBase - 40}" width="220" height="40" as="geometry"/>
            </mxCell>
        </UserObject>${result}`
    
    // console.log(`Create File ${filename}`, fullResult)
    return fullResult
}

