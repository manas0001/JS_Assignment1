const url = 'https://crudcrud.com/api/975f892e480f4ec59cd9f46bf3f45b90';
let editingStudentId = null;
let originalButtonText = '';
let countElement = document.querySelector('#studentCnt');

document.addEventListener('DOMContentLoaded', () => renderAll());

function formSubmit(event) {
  event.preventDefault();

  const student = {
    username: event.target.username.value,
    phone: event.target.phone.value,
    address: event.target.address.value,
  };

  saveAndRender(student);
  document.querySelector('form').reset();
}

async function saveAndRender(student) {
  try {
    if (editingStudentId) {
      const id = editingStudentId;
      await axios.put(`${url}/students/${id}`, student);
      renderItem({ ...student, _id: id });
      editingStudentId = null;
      document.querySelector('#btn').textContent = originalButtonText;
      document.querySelector('form').reset();
      return;
    }

    const response = await axios.post(`${url}/students`, student);
    renderItem(response.data);
    let count = countElement.textContent;
    countElement.textContent = count * 1 + 1;
  } catch (error) {
    console.log('saveAndRender:', error);
  }
}

function renderItem(student) {
  let ul = document.querySelector('ul');

  let li = document.createElement('li');
  li.textContent = `${student.username} ${student.phone} ${student.address}`;
  li.id = student._id;
  li.className = 'student';

  let deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => deleteItem(student._id);

  let editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => editItem(student);

  li.appendChild(deleteBtn);
  li.appendChild(editBtn);

  const existingItem = document.getElementById(student._id);
  if (existingItem) {
    existingItem.replaceWith(li);
  } else {
    ul.appendChild(li);
  }
}

async function deleteItem(id) {
  try {
    await axios.delete(`${url}/students/${id}`);
    const ul = document.querySelector('ul');
    const studentItem = document.getElementById(id);

    if (studentItem) {
      ul.removeChild(studentItem);
      let count = countElement.textContent;
      countElement.textContent = count * 1 - 1;
    }
  } catch (error) {
    console.log(error);
  }
}

async function renderAll() {
  try {
    const response = await axios.get(`${url}/students`);
    const students = response.data;
    countElement.textContent = students.length;
    for (const student of students) {
      renderItem(student);
    }
  } catch (error) {
    console.log(error);
  }
}

async function editItem(student) {
  let form = document.querySelector('form');
  editingStudentId = student._id;
  originalButtonText = document.querySelector('#btn').textContent;
  form.username.value = student.username;
  form.phone.value = student.phone;
  form.address.value = student.address;

  document.querySelector('#btn').textContent = 'Save Changes';
}
