holst = document.querySelector(".holst");


// Вызывается пр клике на кнопку Ok в 'создать'
function createNewCanvas() {
	var newWidth = document.querySelector("#holst-width").value;
	var newHeight = document.querySelector("#holst-heigth").value;

	// ПРОВЕРЯЕМ ДАННЫЕ НА КОРРЕКТНОСТЬ
	if (
		parseInt(newWidth) > 0 &&
		parseInt(newWidth) <= 10000 &&
		parseInt(newHeight) > 0 &&
		parseInt(newHeight) <= 10000
	) {
		holst.name = document.querySelector("#holst-name").value;
		holst.width = newWidth;
		holst.height = newHeight;
		document.querySelector(".create-new-canvas").classList.remove("active");


		
	ctx.lineCap = 'round'
	ctx.fillStyle = '#fff'
	ctx.fillRect(0,0,holst.width, holst.height)

	} else {
		alert("Введено неверное значение");
	}
}


var J

// Елементы, доступные для перетаскивания
var d = DragdownElem(
	document.querySelector(".create-new-canvas"),
	document.querySelector(".drag-and-drop")
);
var d = DragdownElem(
	document.querySelector(".new-image"),
	document.querySelector(".new-image"), false
);

function DragdownElem(elem, elem_beginingDraddown, correctPos) {
	elem_beginingDraddown.onmousedown = function (e) {
		var startCords = getCoords(elem);

		var distBetweenCursorAndBlockX = e.pageX - startCords.left;
		var distBetweenCursorAndBlockY = e.pageY - startCords.top;

		document.onmousemove = function (e) {
			if (isImgResizing) {
				return
			}
			var newLeft = e.pageX - distBetweenCursorAndBlockX;
			var newTop = e.pageY - distBetweenCursorAndBlockY;

			elem.style.left = newLeft + "px";
			elem.style.top = newTop + "px";
		};

		document.onmouseup = function () {
			document.onmousemove = document.onmouseup = null;

			// Если дропдаун вышел за пределы браузера - вернуть обратно
			if (correctPos != false) {
				isInWindow(
					elem,
					[
						parseInt(elem.style.top),
						parseInt(elem.style.left)
					],
					[
						elem.offsetHeight,
						elem.offsetWidth
					]
				)
			}
	};
};

elem.ondragstart = function () {
	return false;
};

function getCoords(elem) {
	var box = elem.getBoundingClientRect();

	return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
	};
}
}



var cursor = {
	x: 0,
	y: 0,
	isdown: false
}

window.addEventListener("mousedown", function(e) {

	cursor.isdown = true
	getCursorCords(e)
	
	if (activeTool == 'paint') {
		ctx.beginPath();
	}

})
window.addEventListener("mouseup", function() {
	cursor.isdown = false

	
	if (activeTool == 'paint') {
		ctx.closePath();
	}
})

function getCursorCords(e) {

	cursor.oldX = cursor.x
	cursor.oldY = cursor.y

	var targetCoords = canvas.getBoundingClientRect();

	var xCoord = e.clientX - targetCoords.left;
	var yCoord = e.clientY - targetCoords.top;

	cursor.x = xCoord
	cursor.y = yCoord

}


var canvas = document.querySelector(".holst")
var ctx = canvas.getContext('2d')

ctx.fillStyle = '#fff'
ctx.fillRect(0,0,holst.width, holst.height)

ctx.lineCap = 'round'

canvas.onmousedown = function(e) {

	getActiveTool(e)


	if (activeTool == 'paint') {

		
		paint.color = paintColorBlock.value
		paint.width = paintWidthBlock.value.slice(0, paintWidthBlock.value.length-1)

		ctx.lineWidth = paint.width
		ctx.strokeStyle = paint.color

	}

	if (activeTool == 'rubber') {

		rubber.width = rubberWidthBlock.value.slice(0, rubberWidthBlock.value.length-1)

		ctx.lineWidth = rubber.width
		ctx.strokeStyle = "#fff"

	}
}

window.addEventListener('mousemove', function(e) {
	if(e.target != holst) {
		cursor.isdown = false
	}
}) 


canvas.onmousemove = function(e) {


	if (activeTool == 'paint') {
		
		if (cursor.isdown) {

			getCursorCords(e)

			ctx.beginPath();
			ctx.moveTo(cursor.x, cursor.y);
			ctx.lineTo(cursor.oldX, cursor.oldY);
			ctx.stroke();

		}
	}


	if (activeTool == 'rubber') {
		
		if (cursor.isdown) {

			getCursorCords(e)

			ctx.beginPath();
			ctx.moveTo(cursor.x, cursor.y);
			ctx.lineTo(cursor.oldX, cursor.oldY);
			ctx.stroke();

		}

	}

}




var hasInput = false;
var textNow = {
  x: 0,
  y: 0
}

var input = document.createElement('input');

canvas.onclick = function(e) {
	getActiveTool()
	if (activeTool == 'text' && !hasInput) {
		addInput(e.pageX, e.pageY);
		textNow.x = e.offsetX
		textNow.y = e.offsetY
	}
}

function addInput(x, y) { 
	input.value  = ''   
	input.size = '1'
	input.oninput = function () {
	  input.size = input.value.length || 1
	}
	input.type = 'text';
	input.classList.add('form-without-border')
	input.style.position = 'absolute';
	input.style.left = (x) + 'px';
	input.style.top = (y - textSizeBlock.value.slice(0, textSizeBlock.value.length-1)/2) + 2 + 'px';
	input.style.fontSize = textSizeBlock.value.slice(0, textSizeBlock.value.length-1)+'px'
	input.style.color = textColorBlock.value
	input.onkeydown = handleEnter;    
	document.body.appendChild(input);
	input.focus();  
	hasInput = true;
}


document.addEventListener('keydown', function(e) {

	if(e.keyCode == 27) {
		input.remove()
		hasInput = false
	}


	/* if( e.keyCode == 90 && e.ctrlKey ) {
		if (!J) return
		var savedData = JSON.parse(J);
		var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		var data = imgData.data;
		for (var i = 0; i < data.length; i++) {
			 data[i] = savedData[i];
		}
		ctx.putImageData(imgData, 0, 0);
	} */
})

function handleEnter(e) {
	var keyCode = e.keyCode;
	if (keyCode === 13) {
		 ctx.fillStyle = textColorBlock.value;
		 drawText(ctx, this.value, textNow.x + 2, textNow.y + 6 - textSizeBlock.value.slice(0, textSizeBlock.value.length-1)/2);
		 this.remove()
		 hasInput = false;
	}
}
function drawText(ctx, txt, x, y) {
	ctx.fillStyle = textColorBlock.value;
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.font = 'bold ' + textSizeBlock.value.slice(0, textSizeBlock.value.length-1)+'px ' + 'sans-serif';
	ctx.fillText(txt, x, y);

}







var activeTool = 'paint'

function getActiveTool() {
	for (var i = 0; i < document.querySelectorAll('.tools-icon').length; i++) {
		if (document.querySelectorAll('.tools-icon')[i].classList.contains('active')) {
			activeTool = document.querySelectorAll('.tools-icon')[i].id
		}
	}
}




// РИСОВАЛКА

var paintColorBlock = document.querySelector('#paint-color')
var paintWidthBlock = document.querySelector('#paint-width')

var paint = {

	color: paintColorBlock.value,
	width: paintWidthBlock.value.slice(0, paintWidthBlock.value.length-1)

};







// СТИРАЛКА
var rubberWidthBlock = document.querySelector('#rubber-width')


var rubber = {
	width: rubberWidthBlock.value.slice(0, rubberWidthBlock.value.length-1)
};









var textColorBlock = document.querySelector('#text-color')
var textSizeBlock = document.querySelector('#text-width')

var text = {
	color: textColorBlock.value,
	size: textSizeBlock.value.slice(0, textSizeBlock.value.length-1)
}

document.querySelector('#text-width-range').oninput = function () {
	input.style.fontSize = this.value+'px'
 }

// Изменение цвета текста
textColorBlock.oninput = function () {
	input.style.color = textColorBlock.value
 }
 // Изменение размера текста
 textSizeBlock.oninput = function () {
	
		if ( !(parseInt(this.value) >= 0 && parseInt(this.value) <= 100) ) {
			return
		}

	input.style.fontSize = parseInt(this.value)+'px'
 }






 /* holst.addEventListener('mousedown', function() {
	getActiveTool()



	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	J = JSON.stringify(imgData.data);
 }) */



 


 function save() {
	var image = holst.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

	window.location.href=image; // it will save locally
 }











var newImageB = document.querySelector(".new-image")
var images = []

function handleImage(e){


	var reader = new FileReader();
	reader.onload = function(event){
		 var img = new Image();
		 img.onload = function(){
			newImageB.appendChild(img)

			
			newImageB.style.top = holst.getBoundingClientRect().top + 8 + 'px'
			newImageB.style.left = holst.getBoundingClientRect().left + 8 + 'px'

			if ( newImageB.children[1].clientWidth > holst.clientWidth ) {
				newImageB.children[1].style.width = holst.clientWidth + 'px'
			}
		 }
		 img.src = event.target.result;
	}
	reader.readAsDataURL(e.dataTransfer.files[0]);

	newImageB.children[0].classList.add('active')
	
} 


function handleFileSelect(e) {
	e.stopPropagation();
	e.preventDefault();
	handleImage(e)
	ctx.lineCap = 'round'
	ctx.fillStyle = '#fff'
 }


function handleDragOver(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
 }


 window.addEventListener('dragover', function(e) {
	handleDragOver(e)
})

window.addEventListener('drop', function(e) {

	handleFileSelect(e)
})




var resizer = document.querySelector(".resizer")

var isImgResizing = false

var oldImgSettings = {

}
resizer.onmousedown = function(e) {
	isImgResizing = true

	oldImgSettings.x = e.pageX
	oldImgSettings.y = e.pageY
	oldImgSettings.w = newImageB.children[1].clientWidth
	oldImgSettings.h = newImageB.children[1].clientHeight

}

window.addEventListener('mousemove', function(e) {
	if ( isImgResizing ) {
		if ( e.shiftKey ) {
			newImageB.children[1].style.width = oldImgSettings.w + ( e.pageX - oldImgSettings.x ) + 'px'
			newImageB.children[1].style.width = oldImgSettings.w + ( e.pageX - oldImgSettings.x ) + 'px'
		} else {
			newImageB.children[1].style.width = oldImgSettings.w + ( e.pageX - oldImgSettings.x ) + 'px'
			newImageB.children[1].style.height = oldImgSettings.h + ( e.pageY - oldImgSettings.y ) + 'px'
		}
	}
})

window.addEventListener('mouseup', function(e) {
	isImgResizing = false
})



document.addEventListener('keydown', function(e) {
	if (e.keyCode == 46) {
		if ( newImageB.children[1] ) {
			newImageB.children[0].classList.remove('active')
			newImageB.children[1].remove()
		}
	}

	if (e.keyCode == 13) {
		if ( newImageB.children[1] ) {

			var image = newImageB.children[1]
			log( image.getBoundingClientRect().left - e.pageX )
			ctx.drawImage(image, image.getBoundingClientRect().left - holst.getBoundingClientRect().left, image.getBoundingClientRect().top - holst.getBoundingClientRect().top, image.clientWidth, image.clientHeight);
			
			newImageB.children[0].classList.remove('active')
			newImageB.children[1].remove()
			
		}
	}
})

//

var rectangleColor = document.querySelector('#rectangle-color')

var newRectangle = document.querySelector('.newRectangle')

var borderWidth = 0
holst.addEventListener('mousedown', function(e) {
	getActiveTool()

	if (activeTool == 'rectangle') {
		isRectangle = true
		ctx.beginPath()
		
		var newRectangle = document.querySelector('.newRectangle')

		newRectangle.classList.add('active')
		newRectangle.style.backgroundColor = rectangleColor.value

		borderWidth = parseInt(document.querySelector('#rectangle-border-width').value)

		newRectangle.startPos = {
			x: e.pageX - borderWidth,
			y: e.pageY - borderWidth
		} 


		newRectangle.style.top = 0
		newRectangle.style.left = 0
		newRectangle.style.width = 0
		newRectangle.style.height = 0
		newRectangle.style.border = document.querySelector('#rectangle-border-color').value + ' solid ' + borderWidth + 'px'
	}
})


var isRectangle = false

window.addEventListener('mousemove', function(e) {
	if (activeTool == 'rectangle') {
		
		if ( e.pageY > newRectangle.startPos.y ) {
			if ( e.shiftKey ) {
				newRectangle.style.top = newRectangle.startPos.y + 'px'
				newRectangle.style.height = Math.abs(newRectangle.startPos.x - e.pageX) - borderWidth + 'px'
			} else {
				newRectangle.style.top = newRectangle.startPos.y + 'px'
				newRectangle.style.height = Math.abs(newRectangle.startPos.y - e.pageY) - borderWidth + 'px'
			}

		}

		if ( e.pageX > newRectangle.startPos.x ) {
			newRectangle.style.left = newRectangle.startPos.x + 'px'
			newRectangle.style.width = Math.abs(newRectangle.startPos.x - e.pageX) - borderWidth + 'px'
		}




		if ( e.pageY < newRectangle.startPos.y ) {
			newRectangle.style.top = newRectangle.startPos.y - Math.abs(newRectangle.startPos.y - e.pageY) - borderWidth + 'px'
			newRectangle.style.height = Math.abs(newRectangle.startPos.y - e.pageY) + 'px'
		}

		if ( e.pageX < newRectangle.startPos.x ) {
			newRectangle.style.left = newRectangle.startPos.x - Math.abs(newRectangle.startPos.x - e.pageX) - borderWidth + 'px'
			newRectangle.style.width = Math.abs(newRectangle.startPos.x - e.pageX) + 'px'
		}

		
	}
})

window.addEventListener('mouseup', function(e) {
	if (isRectangle) {
		isRectangle = false

		newRectangle.classList.remove('active')

		ctx.fillStyle = rectangleColor.value
		ctx.fillRect( e.pageX - holst.getBoundingClientRect().left, e.pageY - holst.getBoundingClientRect().top, newRectangle.startPos.x - e.pageX, newRectangle.startPos.y - e.pageY )

		if (borderWidth) {
			ctx.strokeStyle = document.querySelector('#rectangle-border-color').value
			ctx.lineWidth = borderWidth
			var cords = {}

			if (e.pageX > newRectangle.startPos.x) {
				cords.x = borderWidth/2
				cords.w = 0
			} else {
				cords.x = -borderWidth/2
				cords.w = borderWidth
			}

			if (e.pageY > newRectangle.startPos.y) {
				cords.y = borderWidth/2
				cords.w = 0
			} else {
				cords.y = -borderWidth/2
				cords.h = borderWidth
			}

			ctx.rect( e.pageX - holst.getBoundingClientRect().left + cords.x, e.pageY - holst.getBoundingClientRect().top + cords.y, newRectangle.startPos.x - e.pageX + cords.w, newRectangle.startPos.y - e.pageY + cords.w)

			ctx.stroke()
		}
		ctx.closePath()

	}
})
