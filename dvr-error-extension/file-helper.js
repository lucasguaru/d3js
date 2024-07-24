String.prototype.substringAfter = function(value, startPos = 0) {
	let pos = this.indexOf(value, startPos)
	if (pos > -1) {
		return this.substring(pos + value.length, this.length)
	}
	return this
}

String.prototype.substringBefore = function(value, startPos = 0) {
	let pos = this.indexOf(value, startPos)
	if (pos > -1) {
		return this.substring(startPos, pos)
	}
	return this.substring(startPos)
}

function log(value, text) {
    if (text) {
        console.log(text, value);
    } else {
        console.log(value);
    }
    return value;
}

function readCsvFileAsJson(allText) {

    let lines = readCSVValues(allText, ',', -1)
    const json = csvArrayToJson(lines);
    console.log(`Number of rows read: ${json.length}`);
    return json;
}

function readCSVValues(allText, separator, linesToRead) {
    let pos = 0
    let linePos = 0
    let result = []
    let currentLine = []
    result[linePos] = currentLine
    while (pos < allText.length) {
        let subtext = allText.substringBefore(separator, pos)
        if (isAllValue(subtext)) {
            currentLine.push(subtext)
            pos += subtext.length + 1
        } else {
            if (subtext && subtext[0] == '"') {
                // check when it finishes the value
                // debugger
                let posComma = allText.indexOf(separator, pos + 1)

                // reached end of file
                if (posComma == -1) {
                    subtext = allText.substring(pos + 1, allText.length) // ,THOMASVILLE,"Old Dominion Freight Line, Inc.",NC,27360
                    let posBreak = subtext.indexOf('\n')
                    if (posBreak > -1) {
                        subtext = subtext.substringBefore('"')
                        if (subtext.endsWith('\r')) subtext = subtext.substring(0, subtext.length -1)
                        currentLine.push(subtext)
                        
                        if (linesToRead > 0 && linePos == linesToRead) return result

                        currentLine = []
                        result[++linePos] = currentLine
                        pos += subtext.length + 3 // + 3 bc ("",). The subtext will have the clean value 'Old Dominion Freight Line, Inc.'
                    } else {
                        currentLine.push(subtext)
                        pos += subtext.length
                    }
                    continue
                } else {
                    subtext = allText.substringBefore('"' + separator, pos + 1) // ,THOMASVILLE,"Old Dominion Freight Line, Inc.",NC,27360
                    currentLine.push(subtext)
                    pos += subtext.length + 3 // + 3 bc ("",). The subtext will have the clean value 'Old Dominion Freight Line, Inc.'
                }
                continue
            }
            // Checking if it is end of line
            let posBreak = subtext.indexOf('\n')
            if (posBreak > -1) {
                subtext = subtext.substringBefore('\n')
                if (subtext.endsWith('\r')) subtext = subtext.substring(0, subtext.length -1)
                currentLine.push(subtext)

                if (linesToRead > 0 && linePos == linesToRead) return result

                currentLine = []
                result[++linePos] = currentLine
                pos += posBreak + 1
                continue
            }
        }
    }
    return result
}

function isAllValue(subtext) {
    if (subtext.includes(',')) return false
    if (subtext.includes('"')) return false
    if (subtext.includes('\n')) return false
    return true
}

function csvArrayToJson(lines) {
    const headers = lines[0]
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i]
        obj["_id"] = i

        for (let j = 0; j < headers.length; j++) {
            if (j < currentline.length) {
                let value = currentline[j].trim()
                if (value.includes('\n')) {
                    value = value.split('\n')
                }
                obj[headers[j].trim()] = value;
            }
        }
        result.push(obj);
    }
    return result;
}
