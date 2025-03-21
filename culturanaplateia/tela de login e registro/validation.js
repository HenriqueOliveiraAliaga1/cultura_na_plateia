const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

form.addEventListener('submit', (e) => {
  let errors = []

  if(firstname_input){
    
    errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input.value)
  }
  else{
    
    errors = getLoginFormErrors(email_input.value, password_input.value)
  }

  if(errors.length > 0){
    
    e.preventDefault()
    error_message.innerText  = errors.join(". ")
  }
})

function getSignupFormErrors(firstname, email, password, repeatPassword){
  let errors = []

  if(firstname === '' || firstname == null){
    errors.push('Nome é obrigatório')
    firstname_input.parentElement.classList.add('incorreto')
  }
  if(email === '' || email == null){
    errors.push('Email é obrigatório')
    email_input.parentElement.classList.add('incorreto')
  }
  if(password === '' || password == null){
    errors.push('Senha é obrigatório')
    password_input.parentElement.classList.add('incorreto')
  }
  if(password.length < 8){
    errors.push('A senha deve ter pelo menos 8 caracteres')
    password_input.parentElement.classList.add('incorreto')
  }
  if(password !== repeatPassword){
    errors.push('A senha não corresponde à senha repetida')
    password_input.parentElement.classList.add('incorreto')
    repeat_password_input.parentElement.classList.add('incorreto')
  }


  return errors;
}

function getLoginFormErrors(email, password){
  let errors = []

  if(email === '' || email == null){
    errors.push('Email é obrigatório')
    email_input.parentElement.classList.add('incorreto')
  }
  if(password === '' || password == null){
    errors.push('Senha é obrigatório')
    password_input.parentElement.classList.add('incorreto')
  }

  return errors;
}

const allInputs = [firstname_input, email_input, password_input, repeat_password_input].filter(input => input != null)

allInputs.forEach(input => {
  input.addEventListener('input', () => {
    if(input.parentElement.classList.contains('incorreto')){
      input.parentElement.classList.remove('incorreto')
      error_message.innerText = ''
    }
  })
})
