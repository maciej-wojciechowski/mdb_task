import * as mdb from 'mdb-ui-kit';

export default {
  mdb,
};

// --  Form and Book Counter --

// Book counter
const bookCounter = document.querySelector('#booksCounter');
// Form
const addButton = document.querySelector('#add-btn');
const inputTitle = document.querySelector('#input-title');
const inputAuthor = document.querySelector('#input-author');
const selectGenre = document.querySelector('#select-genre');
const selectPrior = document.querySelector('#select-prior');
const addGenreBtn = document.querySelector('#add-genre-btn');
const inputGenre = document.querySelector('#input-new-genre');
const tableBody = document.querySelector('#table tbody');

// Event listeners
addButton.addEventListener('click', addNewBook);
tableBody.addEventListener('click', deleteEdit);

// Adding new book to the list
function addNewBook(e) {
  try {
    const form = document.querySelector('form');
    e.preventDefault();
    addTableRow(inputTitle.value, inputAuthor.value, selectGenre.value, selectPrior.value);
    saveToLocal();
    updateFilter();
    countGenres();
    form.reset();
  } catch {
    alert('Oops! Please check entry...'); // eslint-disable-line no-alert
  }
}

// Adding position to the table
function addTableRow(titleVal, authorVal, genreVal, priorityVal) {
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

// -- Deleting and editing book entry
function deleteEdit(e) {
  const target = e.target;
  const editedRow = target.parentElement.parentElement;
  if (target.classList.contains('delete-btn')) {
    editedRow.remove();
    updateFilter();
    countGenres();
    saveToLocal();
  } else if (target.classList.contains('edit-btn')) {
    const rowCells = editedRow.querySelectorAll('td');
    if (!editedRow.classList.contains('edit')) {
      target.innerHTML = '<i class="fas fa-check-circle fa-xl"></i>';
      editedRow.classList.add('edit');
      rowCells[0].innerHTML = `<input type='text' value='${rowCells[0].innerText}' class='input-edit'></input>`;
      rowCells[1].innerHTML = `<input type='text' value='${rowCells[1].innerText}' class='input-edit'></input>`;
      rowCells[2].innerHTML = selectGenre.outerHTML;
      rowCells[3].innerHTML = selectPrior.outerHTML;
    } else {
      target.innerHTML = '<i class="fas fa-pencil-alt fa-xl"></i>';
      rowCells.forEach((cell) => {
        const value = cell.firstChild.value;
        cell.innerHTML = value;
        editedRow.classList.remove('edit');
        updateFilter();
        countGenres();
        saveToLocal();
      });
    }
  }
}

// -- FILTERING --

// Filtering;
const selectFilterAuthor = document.querySelector('#select-filter-author');
const selectFilterGenre = document.querySelector('#select-filter-genre');
const selectFilterPriority = document.querySelector('#select-filter-priority');

// Event listeners
selectFilterAuthor.addEventListener('input', () => {
  filterTable(1, selectFilterAuthor.value);
});
selectFilterGenre.addEventListener('input', () => {
  filterTable(2, selectFilterGenre.value);
});
selectFilterPriority.addEventListener('input', () => {
  filterTable(3, selectFilterPriority.value);
});

function filterTable(n, filter) {
  const rows = tableBody.querySelectorAll('tr');
  if (filter === '') {
    rows.forEach((row) => {
      row.classList.remove('hidden');
    });
  } else {
    rows.forEach((row) => {
      const filteredCol = row.querySelectorAll('td')[n];
      if (filteredCol.innerText === filter) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    });
  }
  // Reseting other two filters when filter by:
  // Author
  if (filter === selectFilterAuthor.value) {
    selectFilterGenre.selectedIndex = 0;
    selectFilterPriority.selectedIndex = 0;
  }
  // Genre
  if (filter === selectFilterGenre.value) {
    selectFilterAuthor.selectedIndex = 0;
    selectFilterPriority.selectedIndex = 0;
  }
  // Priority
  if (filter === selectFilterPriority.value) {
    selectFilterGenre.selectedIndex = 0;
    selectFilterAuthor.selectedIndex = 0;
  }
}

function updateFilter() {
  // Updating author filter
  const authorsAll = [];
  const tableRows = document.querySelectorAll('#table tbody tr');
  tableRows.forEach((row) => {
    authorsAll.push(row.querySelectorAll('td')[1].innerText);
  });
  // Remove duplicates
  const authors = [...new Set(authorsAll)];
  // Insert into select filter
  selectFilterAuthor.innerHTML = '<option value="">ALL</option>';
  authors.forEach((author) => {
    selectFilterAuthor.innerHTML += `<option value="${author}">${author}</option>`;
  });
  // Updating genre filter
  selectFilterGenre.innerHTML = '<option value="">ALL</option>';
  selectFilterGenre.innerHTML += selectGenre.innerHTML;
}

// -- ADDING NEW GENRE --

// Event listeners
addGenreBtn.addEventListener('click', inputShow);
addGenreBtn.addEventListener('click', addGenre);

function inputShow(e) {
  e.preventDefault();
  inputGenre.classList.toggle('active');
  if (inputGenre.classList.contains('active')) {
    selectGenre.classList.add('hidden');
    addGenreBtn.innerHTML = '<i class="fas fa-check-circle fa-lg"></i>';
  } else {
    selectGenre.classList.remove('hidden');
    addGenreBtn.innerHTML = '<i class="fas fa-plus-circle fa-lg"></i>';
  }
}

function addGenre(e) {
  e.preventDefault();
  if (inputGenre.value !== '') {
    selectGenre.innerHTML += `<option value='${inputGenre.value.toLowerCase()}'>${inputGenre.value.toLowerCase()}</option>`;
    // Saving to local
    const localGenres = [];
    const options = selectGenre.children;
    options.forEach((option) => {
      localGenres.push(option.value);
    });
    localStorage.setItem('localGenres', JSON.stringify(localGenres));
    inputGenre.value = '';
    updateFilter();
  }
}

// -- RESETING GENRE LIST
const resetGenresBtn = document.querySelector('#reset-genres');

resetGenresBtn.addEventListener('click', resetGenres);

function resetGenres() {
  // GENRES
  let localGenres;
  if (localStorage.getItem('localGenres')) {
    selectGenre.innerHTML = '';
    localGenres = ['sci-fi', 'criminal', 'fantasy', 'poetry', 'drama', 'science'];
    localGenres.forEach((genre) => {
      selectGenre.innerHTML += `<option value='${genre.toLowerCase()}'>${genre.toLowerCase()}</option>`;
    });
    localStorage.setItem('localGenres', JSON.stringify(localGenres));
  }
  // Updating  filters
  updateFilter();
}

// -- SORTING --

const tableHeads = document.querySelectorAll('thead th');
// Event listeners
tableHeads.forEach((th, index) => {
  th.addEventListener('click', () => {
    sortTable(index);
  });
});

function sortTable(n) {
  const rows = tableBody.rows;
  let switching;
  let i;
  let x;
  let y;
  let shouldSwitch;
  let dir;
  let switchcount = 0;
  switching = true;
  dir = 'asc';
  while (switching) {
    switching = false;
    for (i = 0; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName('TD')[n];
      y = rows[i + 1].getElementsByTagName('TD')[n];
      if (dir === 'asc') {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir === 'desc') {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else if (switchcount === 0 && dir === 'asc') {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      dir = 'desc';
      switching = true;
    }
  }
}
// -- COUNTING GENRE BOOKS --

const genCouterList = document.querySelector('#gencounter-list');

function countGenres() {
  // Getting genres
  const genresAll = [];
  const tableRows = tableBody.querySelectorAll('tr');
  tableRows.forEach((row) => {
    genresAll.push(row.querySelectorAll('td')[2].innerText);
  });
  // Remove duplicates
  const genres = [...new Set(genresAll)];
  // Insert into genrescounter list
  genCouterList.innerHTML = '';
  genres.forEach((genre) => {
    let i = 0;
    genresAll.forEach((pos) => {
      if (pos === genre) {
        i++;
      }
    });
    genCouterList.innerHTML += `<li>${genre}: <span>${i}</span></li>`;
  });
}

// -- SAVING --

function saveToLocal() {
  // Checking local storage
  const localBooks = [];
  // Getting books from table
  const bookEntries = tableBody.querySelectorAll('tr');
  bookEntries.forEach((row) => {
    const rowArr = [];
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      rowArr.push(cell.innerText);
    });
    localBooks.push(rowArr);
  });
  // Updating Book Counter
  bookCounter.innerText = localBooks.length;
  // Saving to local
  localStorage.setItem('localBooks', JSON.stringify(localBooks));
}

// -- GETTING LOCAL --

function getLocal() {
  // BOOKS
  let localBooks;
  if (localStorage.getItem('localBooks') === null) {
    localBooks = [];
  } else {
    localBooks = JSON.parse(localStorage.getItem('localBooks'));
  }
  localBooks.forEach((book) => {
    addTableRow(book[0], book[1], book[2], book[3]);
  });
  // Updating Book Counter
  bookCounter.innerText = localBooks.length;
  // GENRES
  let localGenres;
  if (localStorage.getItem('localGenres') === null) {
    localGenres = ['sci-fi', 'criminal', 'fantasy', 'poetry', 'drama', 'science'];
  } else {
    localGenres = JSON.parse(localStorage.getItem('localGenres'));
  }
  localGenres.forEach((genre) => {
    selectGenre.innerHTML += `<option value='${genre.toLowerCase()}'>${genre.toLowerCase()}</option>`;
  });
  // Updating  filters
  updateFilter();
}

// Functions call
// localStorage.clear();
getLocal();
countGenres();
