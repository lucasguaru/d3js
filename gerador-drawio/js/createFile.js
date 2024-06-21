function createFile(filename, items) {
    let idStart = 300;
    let yStart = 200;
    let idIncrement = 1;
    let yIncrement = 20;
    
    function scapeValue(value) {
        return value.replaceAll('&', '&amp;amp;')
    }
    
    const createMxCell = (id, fieldName, y) => {
        const fieldScaped = scapeValue(fieldName)
        return `
    <UserObject label="${fieldScaped}" tooltip="${fieldScaped}" id="${id}">
        <mxCell style="rounded=0;whiteSpace=wrap;html=1;fontSize=10;" vertex="1" parent="1">
            <mxGeometry x="90" y="${y}" width="160" height="20" as="geometry"/>
        </mxCell>
    </UserObject>`;
    };
    
    let result = "";
    items.forEach((item, index) => {
        const id = idStart + (index * idIncrement);
        const y = yStart + (index * yIncrement);
        result += createMxCell(id, item, y);
    });

    let fullResult = `<mxGraphModel>
    <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="${filename}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
            <mxGeometry x="70" y="160" width="200" height="40" as="geometry"/>
        </mxCell>
${result}
    </root>
</mxGraphModel>`
    
    console.log(`Create File ${filename}`, fullResult)
    return fullResult
}

