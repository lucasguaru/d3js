function createApi(apiName, items) {
    let idStart = 300;
    let yStart = 200;
    let idIncrement = 1;
    let yIncrement = 20;
    
    function scapeValue(value) {
        return value.replaceAll('&', '&amp;amp;')
    }
    
    const createMxCell = (id, field, y) => {
        const fieldScaped = scapeValue(field.fieldName)
        const descScaped = scapeValue(field.description)
        return `
    <UserObject label="${fieldScaped}" tooltip="${descScaped}" id="${id}">
        <mxCell style="rounded=0;whiteSpace=wrap;html=1;fontSize=10;" vertex="1" parent="1">
            <mxGeometry x="680" y="${y}" width="160" height="20" as="geometry"/>
        </mxCell>
    </UserObject>`;
    };
    
    let result = "";
    items.forEach((field, index) => {
        const id = idStart + (index * idIncrement);
        const y = yStart + (index * yIncrement);
        result += createMxCell(id, field, y);
    });

    let fullResult = `<mxGraphModel>
    <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="${apiName}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
            <mxGeometry x="660" y="160" width="200" height="40" as="geometry"/>
        </mxCell>
${result}
    </root>
</mxGraphModel>`
    
    console.log(`Create File ${apiName}`, fullResult)
    return fullResult
}

