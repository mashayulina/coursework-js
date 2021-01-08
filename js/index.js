const UsersList = [];

let TodoList = JSON.parse(localStorage.getItem('todos')) || [];

const t_title = document.querySelector('.t_title');
const t_text = document.querySelector('.t_text');
const t_date = document.querySelector('.t_date');
const UsersWrap = document.querySelector('.users');
const Modal = document.querySelector('.modal_window');
const CloseModal = document.querySelector('.close_modal');

const Table = document.querySelector('.collection');

const AddTodo = document.querySelector('.add_todo');
const RemoveSelected = document.querySelector('.remove_selected');
const SortBtn = document.querySelector('.sort_btn');


let sortDirection = false; //ASC

t_date.value = new Date().toISOString().split('T').shift();

AddTodo.onclick = () => Modal.classList.add('visible');

RemoveSelected.onclick = () => {
    TodoList = TodoList.filter((elem) => !elem.selected);

    renderTable();
}

SortBtn.onclick = function()
{
    sortDirection = !sortDirection;

    this.children[0].textContent = sortDirection ? 'ASC' : 'DESC';

    renderTable();
}

CloseModal.onclick = () => Modal.classList.remove('visible');

renderTable();


//Users

function initUsers()
{   
    const UserItem = document.querySelectorAll('.user_item');
    const RemoveUser = document.querySelectorAll('.remove_user');

    RemoveUser.forEach((btn, index) => {
        btn.onclick = function()
        {
            UsersList.splice(index, 1);
            renderUsers();
        }

        UserItem[index].oninput = function()
        {
            UsersList[index] = this.value;
        }
    })

}

function renderUsers()
{
    UsersWrap.textContent = '';

    if(UsersList.length)
    {
        UsersList.forEach((username) => {
            UsersWrap.innerHTML += `<article class="row">
                                        <div class="col s8">
                                            <input type="text" class="user_item" placeholder="New user" value="${username ? username : ''}">
                                        </div>
                                        <div class="col s3 offset-s1">
                                            <button type="button" class="btn red remove_user">Remove</button>
                                        </div>
                                    </article>`  
        });
        initUsers();
    }

    
}

//Todos

function initElems()
{
    const SelectTodo = document.querySelectorAll('.selected');
    const RemoveTodo = document.querySelectorAll('.remove_todo');

    RemoveTodo.forEach((remove_btn, index) => {
        remove_btn.onclick = function()
        {
            TodoList.splice(index, 1);

            renderTable();
        }

        SelectTodo[index].onchange = function()
        {
            TodoList[index].selected = this.checked;

            RemoveSelected.disabled = TodoList.find((elem) => elem.selected) ? false : true;
        }
    })
}


function renderTable()
{
    Table.textContent = '';

    RemoveSelected.disabled = TodoList.find((elem) => elem.selected) ? false : true;     

    if(TodoList.length)
    {
        TodoList = TodoList.sort((start, end) => {
            return !sortDirection 
                        ? Date.parse(start.t_date) - Date.parse(end.t_date)
                        : Date.parse(end.t_date) - Date.parse(start.t_date);
        })


        TodoList.forEach((elem) => {

            function getUsers()
            {
                let Layout = '';
                if(elem.t_users.length)
                {
                    elem.t_users.forEach((user) => {
                        Layout += `<li>${user}</li>`
                    })
                }
                else
                {
                    Layout = `<p class="red-text">No users</p>`
                }

                return Layout;
            }

            Table.innerHTML += `<div class="collection-item row">
                                    <div class="col s5">
                                        <label>
                                            <input type="checkbox" class="selected" />
                                            <span></span>
                                        </label>
                                        <em class="grey-text">${elem.t_date}</em>
                                        <h5>${elem.t_title}</h5>
                                    </div>
                                    <div class="col s3">
                                        <em class="grey-text">Users:</em>
                                        
                                        ${ getUsers() }
                                        
                                    </div>
                                    <div class="col s3 offset-s1">
                                        <button class="btn red remove_todo">Remove</button>
                                    </div>
                                </div>`
        })
        initElems();
    }
    else
    {
        Table.innerHTML = `<h3 class="grey-text">No todos</h3>`
    }

    localStorage.setItem('todos', JSON.stringify(TodoList));

}


document.querySelector('#add_user').onclick = function()
{
    UsersList.push(null);   

    renderUsers();
}

document.querySelector('form').onsubmit = function(e)
{
    e.preventDefault();

    if(!t_title.value.trim())
    {
        alert('Todo title is empty!!!');
        return;
    }

    if(t_title.value.trim().length < 3)
    {
        alert(`Todo title min 3 sym!!! You input ${t_title.value.trim().length} sym`);
        return;
    }
    
  
    TodoList.push({ 
        selected: false,
        t_title: t_title.value,
        t_text: t_text.value,
        t_date: t_date.value,
        t_users: UsersList ? [ ...UsersList.filter(elem => elem) ] : []
     });


    Modal.classList.remove('visible');

    renderTable();
}

