let newX = 0, newY = 0, startX = 0, startY = 0

const card = document.getElementById('card')

card.addEventListener('mousedown', mouseDown)

function mouseDown(e) {
    let { clientX, clientY } = e
    let { offsetLeft, offsetTop } = card
    startX = e.clientX - card.offsetLeft
    startY = e.clientY - card.offsetTop
    log({ offsetLeft, offsetTop, clientX, clientY, startX, startY }, 'down')

    document.addEventListener('mousemove', mouseMove)

}
document.addEventListener('mouseup', mouseUp)

function mouseMove(e) {
    let { clientX, clientY } = e
    newX = e.clientX - startX + 'px'
    newY = e.clientY - startY + 'px'
    log({ clientX, clientY, newX, newY })

    card.style.left = newX
    card.style.top = newY
}

function mouseUp(e) {
    document.removeEventListener('mousemove', mouseMove)
}