let idCount = 10000
function createConnections(items) {
    
    const createMxCell = (item) => {
        const idFrom = item.from.id
        const idTo = item.to.id
        idCount++;
        return `
        <mxCell id="${idCount}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;curved=1;endArrow=none;endFill=0;fillColor=#dae8fc;strokeColor=#2C85DE;exitX=1;exitY=0.5;exitDx=0;exitDy=0;" edge="1" source="${idFrom}" target="${idTo}" parent="1">
            <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
    };
    
    let result = "";
    items.forEach((item) => {
        result += createMxCell(item);
    });
    return result
}

