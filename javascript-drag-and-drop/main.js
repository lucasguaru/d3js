let newX = 0, newY = 0, startX = 0, startY = 0

const card = document.getElementById('card')

card.addEventListener('mousedown', mousedowns)

function mouseDown(e) {
    startX = e.clientX
    startY = e.clientY

    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)

}

function mouseMove(e) {
    newX = startX - e.clientX
    newY = startY - e.clientY
}

function mouseUp(e) {

}