function createFile(filename, items) {
    let idStart = 300;
    let yBase = 680;
    let yStart = yBase;
    let idIncrement = 1;
    let yIncrement = 20;
    
    const createMxCell = (index, y) => {
        const fieldScaped = scapeValue(index.name)
        let style = 'style="rounded=0;whiteSpace=wrap;html=1;fontSize=10;"'
        if (connectionsData.find(conn => conn.from.id == index.id)) {
            style = 'style="rounded=0;whiteSpace=wrap;html=1;fontSize=10;fillColor=#e1d5e7;strokeColor=#9673a6;opacity=70;"'
        }
        return `
        <UserObject label="${fieldScaped}" id="${index.id}">
            <mxCell ${style} vertex="1" parent="1">
                <mxGeometry x="100" y="${y}" width="160" height="20" as="geometry"/>
            </mxCell>
        </UserObject>`;
    };
    
    let result = "";
    items.forEach((item, index) => {
        const y = yStart + (index * yIncrement);
        result += createMxCell(item, y);
    });

    let fullResult = `
        <mxCell id="2" value="${filename}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
            <mxGeometry x="80" y="${yBase - 40}" width="200" height="40" as="geometry"/>
        </mxCell>${result}`
    
    // console.log(`Create File ${filename}`, fullResult)
    return fullResult
}

