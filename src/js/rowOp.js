// Adding position to the table
function addTableRow(titleVal, authorVal, genreVal, priorityVal, tableBody) {
  const row = document.createElement('tr');
  const title = document.createElement('td');
  title.innerText = toUpper(titleVal);
  const author = document.createElement('td');
  author.innerText = toUpper(authorVal);
  const genre = document.createElement('td');
  genre.innerText = genreVal.toLowerCase();
  const priority = document.createElement('td');
  priority.innerText = priorityVal;
  // Btn container
  const btnContainer = document.createElement('div');
  btnContainer.classList.add('btnContainer');
  const editBtn = document.createElement('button');
  editBtn.classList.add('edit-btn');
  editBtn.innerHTML = '<i class="fas fa-pencil-alt fa-xl"></i>';
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.innerHTML = '<i class="far fa-trash-alt fa-xl"></i>';
  // Append btns to container
  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);
  // Append to row
  row.appendChild(title);
  row.appendChild(author);
  row.appendChild(genre);
  row.appendChild(priority);
  row.appendChild(btnContainer);
  // Append to table
  tableBody.appendChild(row);

  return addTableRow;
}

// Upper case first word in str
function toUpper(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');
}

export { addTableRow };
