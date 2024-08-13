// Function to make elements draggable
function makeDraggable(element) {
    interact(element).draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        onmove: dragMoveListener
    });
}

// Function to handle dragging
function dragMoveListener(event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    if (target.classList.contains('group')) {
        var children = target.querySelectorAll('.node, .group');
        children.forEach(child => {
            var childX = (parseFloat(child.getAttribute('data-x')) || 0) + event.dx;
            var childY = (parseFloat(child.getAttribute('data-y')) || 0) + event.dy;

            child.style.transform = 'translate(' + childX + 'px, ' + childY + 'px)';
            child.setAttribute('data-x', childX);
            child.setAttribute('data-y', childY);
        });
    }
}

// Apply draggable functionality to all nodes and groups
document.addEventListener('DOMContentLoaded', () => {
    var nodes = document.querySelectorAll('.node, .group');
    nodes.forEach(node => {
        makeDraggable(node);
    });
});