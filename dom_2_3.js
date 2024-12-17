let tasks = [
  {
    id: '1138465078061',
    completed: false,
    text: 'Посмотреть новый урок по JavaScript',
  },
  {
    id: '1138465078062',
    completed: false,
    text: 'Выполнить тест после урока',
  },
  {
    id: '1138465078063',
    completed: false,
    text: 'Выполнить ДЗ после урока',
  },
]
const createTask = (taskId, taskText) => {
  const taskItem = document.createElement('div')
  taskItem.className = 'task-item'
  taskItem.dataset.taskId = taskId // Устанавливает атрибут data-task-id равным taskId (это будет использоваться для идентификации задачи).
  const taskItemContainer = document.createElement('div')
  taskItemContainer.className = 'task-item__main-container'
  const taskItemContent = document.createElement('div')
  taskItemContent.className = 'task-item__main-content'
  taskItem.append(taskItemContainer)
  taskItemContainer.append(taskItemContent)

  const checkboxForm = document.createElement('form')
  checkboxForm.className = 'checkbox-form'

  const inputCheckbox = document.createElement('input')
  inputCheckbox.className = 'checkbox-form__checkbox'
  inputCheckbox.type = 'checkbox'

  const inputId = `task-${taskId}`
  inputCheckbox.id = inputId

  const labelCheckbox = document.createElement('label')
  labelCheckbox.htmlFor = inputId

  checkboxForm.append(inputCheckbox, labelCheckbox)

  const taskItemText = document.createElement('span')
  taskItemText.className = 'task-item__text'
  taskItemText.innerText = taskText

  const deleteButton = document.createElement('button')
  deleteButton.className =
    'task-item__delete-button default-button delete-button'
  deleteButton.innerText = 'Удалить'

  taskItemContent.append(checkboxForm, taskItemText)
  taskItemContainer.append(deleteButton)

  return taskItem
}

const tasksListContainer = document.querySelector('.tasks-list')

const taskForm = document.querySelector('.create-task-block')
taskForm.addEventListener('submit', (event) => {
  console.log(event)
  event.preventDefault()
  const { target } = event
  console.log(target)

  const text = event.target.taskName.value.trim()
  const $errorBlock = taskForm.querySelector('.error-message-block') // Цель: Этот код предназначен для поиска на странице уже существующего элемента, который отображает сообщение об ошибке. Используется для удаления старого сообщения об ошибке, если оно есть.
  if ($errorBlock) {
    $errorBlock.remove() //если при предыдущей отправке формы возникла ошибка, и сообщение об этой ошибке было показано пользователю, то перед обработкой новой отправки это сообщение об ошибке удаляется. Это делается для того, чтобы пользователь не видел старое сообщение об ошибке, если текущие данные верны.
  }
  if (!text) {
    taskForm.append(createError('Название задачи не должно быть пустым')) //если текст пустой мы добавляем ошибку
    return
  }
  const isEqualText = tasks.some(
    (task) => task.text.toLowerCase() === text.toLowerCase()
  )
  if (isEqualText) {
    taskForm.append(createError('Задача с таким названием уже существует')) //если такой текст уже есть, мы добавляем ошибку
    event.target.taskName.value = ''
    return
  }

  const task = {
    id: String(Date.now()),
    completed: false,
    text,
  }
  tasks.push(task)
  tasksListContainer.append(createTask(task.id, task.text))
  event.target.taskName.value = ''
  console.log(tasks)
})

tasks.forEach((task) => {
  const taskItem = createTask(task.id, task.text)
  tasksListContainer.append(taskItem)
})

function createError(textError) {
  const spanErrorMessage = document.createElement('span') // Это создание нового HTML-элемента и задание ему класса.Используется для добавления нового сообщения об ошибке.
  spanErrorMessage.className = 'error-message-block' // для стилизации ошибки
  spanErrorMessage.innerText = textError
  return spanErrorMessage
}

const modalOverlay = document.createElement('div')
modalOverlay.className = 'modal-overlay modal-overlay_hidden'
const deleteModal = document.createElement('div')
deleteModal.className = 'delete-modal'
modalOverlay.append(deleteModal)

const modalQuestion = document.createElement('h3')
modalQuestion.className = 'delete-modal__question'
modalQuestion.textContent = 'Вы действительно хотите удалить эту задачу?'

const deleteButtons = document.createElement('div')
deleteButtons.className = 'delete-modal__buttons'

const buttonCancel = document.createElement('button')
buttonCancel.className = 'delete-modal__button delete-modal__cancel-button'
buttonCancel.textContent = 'Отмена'

const buttonConfirm = document.createElement('button')
buttonConfirm.className = 'delete-modal__button delete-modal__confirm-button'
buttonConfirm.textContent = 'Удалить'

deleteButtons.append(buttonCancel, buttonConfirm)

deleteModal.append(modalQuestion, deleteButtons)
console.log(modalOverlay)

const bodyTeg = document.querySelector('body')
bodyTeg.append(modalOverlay)
console.log(bodyTeg)

///////////////
let taskItemToDelete
document.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.task-item__delete-button')
  if (!deleteButton) {
    return // Если клик был не по кнопке удаления, то просто выходим.
  }
  taskItemToDelete = deleteButton.closest('.task-item')
  if (!taskItemToDelete) {
    return
  }

  const taskId = taskItemToDelete?.dataset.taskId
  console.log(taskId)

  modalOverlay.classList.remove('modal-overlay_hidden')

  buttonCancel.addEventListener('click', (event) => {
    modalOverlay.classList.add('modal-overlay_hidden')
  })
  buttonConfirm.addEventListener('click', (event) => {
    modalOverlay.classList.add('modal-overlay_hidden')
    tasks = tasks.filter((task) => task.id !== taskId)
    console.log(tasks)
    // Удаление из массива tasks
    // removeChild() предназначен для удаления конкретного дочернего элемента из родительского элемента. Этот метод есть у DOM-элемента, который является родителем, и в него в качестве аргумента мы передаем дочерний элемент.
    tasksListContainer.removeChild(taskItemToDelete)
  })
})

// removeChild(taskItem) - это как взять из ящика (tasksListContainer) конкретную игрушку (taskItem) и вынуть ее оттуда. Метод работает на контейнере ящике, но мы указываем конкретную игрушку для удаления.
// remove(taskItem) - (которого нет) - Это как если бы ящик пытался убрать сам себя (что не имеет смысла).
// taskItem.remove() - это как если бы мы попросили игрушку удалить саму себя. Это сработало бы, но нам нужно удалить игрушку из ящика, поэтому нам нужен removeChild у ящика.
// removeChild() - это метод родительского элемента, а remove - это метод самого элемента, поэтому мы используем removeChild, когда нужно удалить дочерний элемент из контейнера.
