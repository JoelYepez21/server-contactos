const formCreateUser = document.querySelector('#form-create');
const inputCreateUser = document.querySelector('#create-input');
const notification = document.querySelector('.notification');
const formLogin = document.querySelector('#form-login');
const inputLogin = document.querySelector('#login-input');

formCreateUser.addEventListener('submit', async e =>{
    e.preventDefault();
    const users = await (await fetch('http://localhost:3007/users', {method: 'GET'})).json();
    const user = users.find(user => user.username === inputCreateUser.value);
    if (inputCreateUser.value === '') {
        notification.innerHTML = 'El usuario no puede estar vacio';
        notification.classList.add('show-notification');
        setTimeout(() =>{
            notification.classList.remove('show-notification');
        }, 3000);
    } else if (user) {
        notification.innerHTML = 'El usuario ya existe';
        notification.classList.add('show-notification');
        setTimeout(() =>{
            notification.classList.remove('show-notification');
        }, 3000);
    } else {
        await fetch('http://localhost:3007/users', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: inputCreateUser.value}),    
        });
        notification.innerHTML = `El usuario ${inputCreateUser.value} ha sido creado`;
        notification.classList.add('show-notification');
        setTimeout(() =>{
            notification.classList.remove('show-notification');
        }, 3000);
        inputCreateUser.value = '';
    }
});

formLogin.addEventListener('submit', async e =>{
    e.preventDefault();
    const users = await (await fetch('http://localhost:3007/users', {method: 'GET'})).json();
    const user = users.find(user => user.username === inputLogin.value);
    if (!user) {
        notification.innerHTML = 'El usuario no existe';
        notification.classList.add('show-notification');
        setTimeout(() =>{
            notification.classList.remove('show-notification');
        }, 3000);
    } else {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '../contactos-zona/index.html';
    }
});
