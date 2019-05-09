function log(text) {
  console.log(text);
}

function isNumeric(n) {
  return (!isNaN(parseInt(n)) && isFinite(n) && n % 1 == 0 && n.charAt(n.length - 1) != " " && n.charAt(0) != " "
  );
}

function isInWindow(elem, cords, size) {
  if (cords[0] < 0) {
    elem.style.top = 0
  }
  if (cords[1] < 0) {
    elem.style.left = 0
  }
  if (cords[0] + size[0] > window.innerHeight) {
    elem.style.top = window.innerHeight - size[0] + 'px'
  }
  if (cords[1] + size[1] > window.innerWidth) {
    elem.style.left = window.innerWidth - size[1] + 'px'
  }
}
