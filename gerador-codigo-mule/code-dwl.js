function getCodeDwlFileContent(app, flow) {
    return `%dw 2.0
output application/csv
---
payload map ($ ++ ({"row_number" : ($$ + 1)}))`
}

function getCodeDwlFilter(app, flow) {
    return `%dw 2.0
output application/csv
---
( 
	if ( vars.operationType == ("shipper_ingestion_" ++ vars.reportFormat))(
		((payload map ($ ++ {"ROW_NUM": ($$ + 1)})))
	)
	else
		( vars.varRetryPayload )
)`
}