const MAPPING_FILE_FIELDS = [FILE_NAME, FILE_FIELD, API_NAME, API_FIELD, ]
function isMappingFile(jsonFile) {
    if (!jsonFile.length) {
        return false
    }

    let line = jsonFile[0]
    for (let i = 0; i < MAPPING_FILE_FIELDS.length; i++) {
        if (!line.hasOwnProperty(MAPPING_FILE_FIELDS[i])) return false
    }
    return true
}

function addDataFilesListener(event) {
    const files = event.target.files;
    const linesToRead = 30;

    if (files.length) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let fileName = file.name
        
            const reader = new FileReader();
            let fileNames = ""
            reader.onload = function(e) {
                const buffer = e.target.result;
                let jsonFile = readCsvFileAsJson(buffer, linesToRead);
                if (isMappingFile(jsonFile)) {
                    mapFile = {
                        fileName: fileName,
                        fileContent: jsonFile,
                    }
                } else {
                    csvFiles.push({
                        fileName: fileName,
                        fileContent: jsonFile,
                    })
                }
                if (mapFile) {
                    fileNames = `<strong>(Mapping)</strong>: ${mapFile.fileName}<br>`
                }
                fileNames += csvFiles.map(f => `<strong>(Data)</strong>: ${f.fileName}`).join('<br>')

                document.getElementById('fileName').innerHTML = fileNames;
            };
            reader.readAsArrayBuffer(file);
        }
    } else {
        alert('Please select a file and specify the number of lines to read.');
    }
}

function addMapFileListener(event) {
    const file = event.target.files[0];
    const linesToRead = 30;

    if (file) {
        let fileName = file.name
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const buffer = e.target.result;
            let jsonFile = readCsvFileAsJson(buffer, linesToRead);
            mapFile = {
                fileName: fileName,
                fileContent: jsonFile,
            }
            let fileNames = `File name: ${fileName}`

            document.getElementById('mappingFileName').innerHTML = fileNames;
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Please select a file and specify the number of lines to read.');
    }
}

function readCsvFileAsJson(buffer, linesToRead) {
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(buffer);
    const lines = text.split('\n').slice(0, linesToRead + 1); // Including header line

    const json = csvToJson(lines);
    // document.getElementById('output').textContent = JSON.stringify(json, null, 2);
    console.log(`Number of rows read: ${json.length}`);
    return json;
}

function csvToJson(lines) {
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');
        obj["_id"] = i

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
        }
        result.push(obj);
    }
    return result;
}