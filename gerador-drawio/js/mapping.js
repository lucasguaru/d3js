const apiFromToFile = {
    "PurchaseOrder": "purchase_orders",
    "Week": "week",
    "PurchaseOrderShipperOrder": "purchase_order_shipper_order",
    "Lane": "lane",
    "Facility": "facilities",
    "Consignee": "consignees",
    "Shipment": "shipments",
    "Tender": "tenders",
}

const FILE_NAME = 'FileName'
const FILE_FIELD = 'Customer System Field Name'
const API_NAME = 'ISO API Object Name'
const API_FIELD = 'ISO API Field Name'

function Mapping(mapFile) {
    this.rawMapFile = mapFile
    this.mapFields = mapFile.fileContent
        .filter(line => line[FILE_NAME] && line[FILE_FIELD])
        .map(line => {
            return {
                [FILE_NAME]: line[FILE_NAME],
                [FILE_FIELD]: line[FILE_FIELD],
                [API_NAME]: line[API_NAME],
                [API_FIELD]: line[API_FIELD],
                fileConnectionFields: [],
                apiConnectionFields: []
            }
        })
        // .map(line => {
        //     return { ...line, fileConnectionFields: [], apiConnectionFields: []}
        // })
    this.fileFieldMapped = []
    this.apiFieldMapped = []

    this.fileHasThisField = (fileName, fieldName, mappingFieldId, isAddField) => {
        let fileItem = this.mapFields.find(line => fileName.startsWith(line[FILE_NAME]) && line[FILE_FIELD] == fieldName)
        if (fileItem && isAddField) {
            if (!fileItem.fileConnectionFields.some(item => item.mappingFieldId == mappingFieldId)) {
                fileItem.fileConnectionFields.push({ fileName, fieldName, mappingFieldId })
            }
        }
        return fileItem;
    }

    this.addFileMappingField = (fileName, fieldName, mappingFieldId) => {
        let fileItem = this.mapFields.find(line => fileName.startsWith(line[FILE_NAME]) && line[FILE_FIELD] == fieldName)
        fileItem.fileConnectionFields.push({ fileName, fieldName, mappingFieldId })
        fileItem.hasConnection = true
    }

    this.apiHasThisField = (apiName, parentName, apiField, mappingFieldId, isAddField) => {
        let fieldName = parentName ? (parentName + '.' + apiField.fieldName) : apiField.fieldName
        let apiItem = this.mapFields.find(line => line[API_NAME] == apiFromToFile[apiName] && line[API_FIELD] == fieldName)
        if (apiItem && isAddField) {
            if (!apiItem.apiConnectionFields.some(item => item.mappingFieldId == mappingFieldId)) {
                apiItem.apiConnectionFields.push({ apiName, apiField, mappingFieldId })
            }
        }
        return apiItem
    }

    this.addApiMappingField = (apiName, parentName, apiField, mappingFieldId) => {
        let fieldName = parentName ? (parentName + '.' + fieldName) : apiField.fieldName
        let apiItem = this.mapFields.find(line => line[API_NAME] == apiFromToFile[apiName] && line[API_FIELD] == fieldName)
        apiItem.apiConnectionFields.push({ apiName, apiField, mappingFieldId })
        apiItem.hasConnection = true
    }

    this.getItemsWithConnection = (apiName) => {
        return this.mapFields.filter(line => line[API_NAME] == apiFromToFile[apiName] && line.hasConnection)
    }

}