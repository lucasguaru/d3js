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