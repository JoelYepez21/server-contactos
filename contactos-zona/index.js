// Regex
const REGEX_NAME = /^[A-Z][a-z]*[ ][A-Z][a-z]*$/;
const REGEX_NUMBER = /^[0](212|412|414|424|416|426)[0-9]{7}$/;

// Selectors
const inputName = document.querySelector('#input-name');
const inputNumber = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const user = JSON.parse(localStorage.getItem('user'));
const closeBtn = document.querySelector('#cerrar-sesion-btn');

// Validations
let nameValidation = false;
let numberValidation = false;
let EditnameValidation = true;
let EditnumberValidation = true;

if (!user) {
    window.location.href = '../home/index.html';
}

// Functions
const validateEditInput = (input, validation) => {
    if (input.value === '') {
        input.classList.remove('correct');
        input.classList.remove('advertencia');
      } else if (validation) {
        input.classList.add('correct');
        input.classList.remove('advertencia');
      } else {
        input.classList.add('advertencia');
        input.classList.remove('correct');
      }
}
const validateInputName = (input, validation) => {
    const infoText = input.parentElement.children[2];

    if (input.value === '') {
        input.classList.remove('correct');
        input.classList.remove('advertencia');
        infoText.classList.remove('show-info');
    } else if (validation) {
        input.classList.add('correct');
        input.classList.remove('advertencia');
        infoText.classList.remove('show-info');
    } else {
        infoText.classList.add('show-info');
        input.classList.add('advertencia');
        input.classList.remove('correct');
    }
}
const validateInput = async (input, validation) => {
    const contactos = await (await fetch('http://localhost:3007/contacts', {method: 'GET'})).json();
    const infoText = input.parentElement.children[2];
    const infonumber = input.parentElement.children[3];
    const userContactos = contactos.filter(contacto => contacto.user === user.username);
    const contacto = userContactos.find((contacto) => input.value === contacto.number);
    if (contacto) {
        validation = false;
        infonumber.classList.add('show-info');
        infoText.classList.remove('show-info');
    } else {
        if (input.value === '') {
            input.classList.remove('correct');
            input.classList.remove('advertencia');
            infoText.classList.remove('show-info');
        } else if (validation) {
            input.classList.add('correct');
            input.classList.remove('advertencia');
            infoText.classList.remove('show-info');
        } else {
            infoText.classList.add('show-info');
            input.classList.add('advertencia');
            input.classList.remove('correct');
            infonumber.classList.remove('show-info');
        }
    }



    if (nameValidation && numberValidation && !contacto) {
        formBtn.disabled = false;
        formBtn.classList.remove('desabilitado');
        formBtn.classList.add('habilitado');
    } else {
        formBtn.disabled = true;
        formBtn.classList.add('desabilitado');
        formBtn.classList.remove('habilitado')
    }
};

const getContacts = async () => {
    formBtn.disabled = true;
    formBtn.classList.add('desabilitado');
    formBtn.classList.remove('habilitado')
    const contactos = await (await fetch('http://localhost:3007/contacts', {method: 'GET'})).json();
    const userContactos = contactos.filter(contacto => contacto.user === user.username);
    list.innerHTML = ''
    userContactos.forEach(contact => {
        const li = document.createElement('li');
        li.id = contact.id;
        li.innerHTML = `
        <button class="delete-btn">
            <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
        <div>
            <p>${contact.name}</p>
            <p>${contact.number}</p>
        </div>
        <button class="edit-btn">
            <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>        
        </button>        
        `;
        list.append(li);
    });
};
getContacts();

  // Events
inputName.addEventListener('input', e => {
    nameValidation = REGEX_NAME.test(inputName.value);
    validateInputName(inputName, nameValidation)
});
  
inputNumber.addEventListener('input', e => {
    numberValidation = REGEX_NUMBER.test(inputNumber.value);
    validateInput(inputNumber, numberValidation)
});

form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!nameValidation || !numberValidation) {
        return;
    }
    const responseJson = await fetch('http://localhost:3007/contacts', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: inputName.value, number: inputNumber.value, user: user.username})
    });
    const response = await responseJson.json();;

    const li = document.createElement('li');
    li.innerHTML = `
        <button class="delete-btn">
            <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
        <div>
            <p>${response.name}</p>
            <p>${response.number}</p>
        </div>
        <button class="edit-btn">
            <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>        
        </button>
    `;
    list.append(li);
    inputName.value = '';
    inputNumber.value = '';
    inputName.classList.remove('correct');
    inputNumber.classList.remove('correct');
    getContacts();
});

list.addEventListener('click', async e =>{
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.parentElement.id;
        await fetch(`http://localhost:3007/contacts/${id}`,{
            method: 'DELETE',});
        e.target.parentElement.remove();
    } else if (e.target.classList.contains('edit-btn')) {
        const editBtn = e.target;
        const id = e.target.parentElement.id;
        const li = e.target.parentElement;
        const nameEdit = li.children[1].children[0];
        const numberEdit = li.children[1].children[1];
        if (nameEdit.classList.contains('editables') || numberEdit.classList.contains('editables')) {
            await fetch(`http://localhost:3007/contacts/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: nameEdit.innerHTML, number: numberEdit.innerHTML})
        });
        nameEdit.classList.remove('editables');
        numberEdit.classList.remove('editables');
        editBtn.classList.remove('editable');
        getContacts();
        editBtn.innerHTML = `
        <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        `
        } else {
            editBtn.classList.add('editable');
            nameEdit.classList.add('editables');
            numberEdit.classList.add('editables');
            nameEdit.setAttribute('contenteditable', 'true');
            numberEdit.setAttribute('contenteditable', 'true');
            editBtn.innerHTML = `
             <svg class="edit-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
             </svg>
            `; 
            nameEdit.addEventListener('input', e => {
                EditnameValidation = REGEX_NAME.test(nameEdit.innerHTML);
                validateEditInput(nameEdit, EditnameValidation);
                if (EditnameValidation && EditnumberValidation) {
                  editBtn.disabled = false;
                } else {
                  editBtn.disabled = true;
                }
            });
            numberEdit.addEventListener('input', e => {
                EditnumberValidation = REGEX_NUMBER.test(numberEdit.innerHTML);
                validateEditInput(numberEdit, EditnumberValidation);
                if (EditnumberValidation && EditnameValidation) {
                  editBtn.disabled = false;
                } else {
                  editBtn.disabled = true;
                }
              });
        }
    } 
});

console.log(closeBtn);

closeBtn.addEventListener('click', async e => {
    localStorage.removeItem('user');
    window.location.href = '../home/index.html';
});