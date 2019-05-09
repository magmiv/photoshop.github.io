window.addEventListener('click', function () {



	// Закрывает все активные блоки, помимо тех случаев, когда был нажат сам блок
	(function closeActiveBlocks() {

		if (isMainMenuActive) {
			mainMenuList.classList.remove('active')
		}

		if (activeRange) {
			activeRange.opener.classList.remove('active')
			activeRange.range.classList.remove('active')
			activeRange.correctValues()

			activeRange = null
		}
	})()



})






// СВЯЗЫВАЕМ ЛЕВУЮ И ВЕРХНЮЮ ПАНЕЛЬ ИНСТРУМЕНТОВ

var leftToolsIcons = document.querySelectorAll('.tools-icon')
var topToolsPanels = document.querySelectorAll('.tool')

for (var i = 0; i < leftToolsIcons.length; i++) {
	leftToolsIcons[i].addEventListener('click', function () {

		// Сделать неактивными все иконки
		for (var i = 0; i < leftToolsIcons.length; i++) {
			leftToolsIcons[i].classList.remove('active')
			topToolsPanels[i].classList.remove('active')

			// Если кликнутый блок и иконка в цикле совпадают - сделать эту иконку и панель инструментов, привязанную к ней активными
			if (this == leftToolsIcons[i]) {
				topToolsPanels[i].classList.add('active')
				this.classList.add('active')
			}
		}

	})
}






// ГЛАВНОЕ МЕНЮ

var mainMenu = document.querySelector('.main-menu')
mainMenu = new MainMenu()


var isMainMenuActive = false;
var mainMenuList;


function MainMenu() {
	var mainMenuHeader = mainMenu.querySelector('.drop-down_header')
	mainMenuList = mainMenu.querySelector('.drop-down_list')

	mainMenuHeader.addEventListener('click', function (e) {
		mainMenuList.classList.toggle('active')
		isMainMenuActive = !isMainMenuActive
		// Отменяем всплытие события, чтобы меню не закрывалось сразу же при открытии
		e.stopPropagation()
	})

	mainMenuList.addEventListener('click', function () {
		mainMenuList.classList.remove('active')
		isMainMenuActive = false
	})


}









// RANGE c тектовой формой и выпадающим меню. Все range выражают значения только в %
var inputsWithRange = document.querySelectorAll('.input-with-range')

for (var i = 0; i < inputsWithRange.length; i++) {
	inputsWithRange[i] = new InputWithRange(inputsWithRange[i])
}



// Далее по коду будет содержать локальные переменные и функции для открытого InputWithRange
var activeRange = null



function InputWithRange(parent_elem) {
	// Далее по коду везде используется that для большей читабельночти. Если бы происходили чередования this и that, то было бы говнокодней
	var that = this

	// Добавляем в родительский элемент новые блоки




	// Хранить блоки необходимо именно таким образом, так как в дальнейшем они считываются из других мест, где другой контекст вызова
	that.textForm = parent_elem.querySelector('.text-form')
	that.opener = parent_elem.querySelector('.block__open-range')
	that.range = parent_elem.querySelector('.range')


	// Закрывает/открывает выпадающий ползунок
	that.opener.addEventListener('click', function (e) {
		if (that.opener.classList.contains('active')) {
			that.opener.classList.remove('active')
			that.range.classList.remove('active')
			activeRange = null
		}

		else {
			// Во избежании открытия нескольких range'й - закрывает последний открытый
			if (activeRange) {
				activeRange.opener.classList.remove('active')
				activeRange.range.classList.remove('active')
			}

			// Открывает новый
			that.opener.classList.add('active')
			that.range.classList.add('active')
			activeRange = that
			e.stopPropagation()
		}
	})



	// При изменении значения range меняет значение текстовой формы
	that.range.addEventListener('input', function (e) {
		that.textForm.value = that.range.value + '%'
	})




	// Сторое значение формы, которое будет воспроизведено при ошибке ввода хранится в that.vastValue
	that.textForm.addEventListener("focus", function () {
		that.vastValue = that.textForm.value
	})






	that.correctValues = function () {
		// Получаем число из строки, проверяем его. Из-за чего значение 45g% может пройти проверку, но на выходе получится 45%
		if (parseInt(that.textForm.value) >= 0 && parseInt(that.textForm.value) <= 100) {
			that.textForm.value = parseInt(that.textForm.value) + "%"
			return
		}

		that.textForm.value = that.vastValue


	};










	// Событие window.click скрывает все активные блоки, из-за чего они закрываются при клике на себя. Отменяет всплытие события, ликвидируя баг
	that.textForm.addEventListener('click', function (e) {
		e.stopPropagation()
	})
	that.range.addEventListener('click', function (e) {
		e.stopPropagation()
	})



	// События, при которых срабатывает проверка на правильность введенных данных
	that.textForm.addEventListener('blur', function (e) {
		that.correctValues()
	})
	that.textForm.addEventListener('keydown', function (e) {
		if (e.keyCode == 13) {
			that.correctValues()
		}
	})






}









/*

// СОЗДАНИЕ НОВОГО ОКНА

var newCanvasCrearor = document.querySelectorAll('.create-new-canvas')

newCanvasCrearor = new NewCanvasCrearor()

















// БЛОКИ, КОТОРЫЕ МОЖНО ПЕРЕМЕЩАТЬ ПО ЭКРАНУ
*/
