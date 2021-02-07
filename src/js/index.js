import * as mdb from 'mdb-ui-kit';
import { addTableRow } from './rowOp';
import { filterTable, updateFilter, sortTable } from './filterSort';
import { inputShow, addGenre, countGenres, resetGenres } from './genre';

export default {
  mdb,
};

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
const rows = tableBody.children;
// Sorting
const tableHeads = document.querySelectorAll('thead th');
// Genre Counter
const genCouterList = document.querySelector('#gencounter-list');
// Filtering;
const selectFilterAuthor = document.querySelector('#select-filter-author');
const selectFilterGenre = document.querySelector('#select-filter-genre');
const selectFilterPriority = document.querySelector('#select-filter-priority');
const filtersArr = [selectFilterAuthor, selectFilterGenre, selectFilterPriority];
// -- RESETING GENRE LIST
const resetGenresBtn = document.querySelector('#reset-genres');

// -- EVENT LISTENERS --

// Add, edit, table
addButton.addEventListener('click', addNewBook);
tableBody.addEventListener('click', deleteEdit);
// Filtering events
selectFilterAuthor.addEventListener('input', () => {
  filterTable(0, rows, filtersArr);
});
selectFilterGenre.addEventListener('input', () => {
  filterTable(1, rows, filtersArr);
});
selectFilterPriority.addEventListener('input', () => {
  filterTable(2, rows, filtersArr);
});
// Add new genre
addGenreBtn.addEventListener('click', () => {
  inputShow(inputGenre, selectGenre, addGenreBtn);
});
addGenreBtn.addEventListener('click', (e) => {
  addGenre(e, inputGenre, selectGenre);
  updateFilter(rows, selectFilterAuthor, selectFilterGenre, selectGenre);
});
resetGenresBtn.addEventListener('click', () => {
  resetGenres(selectGenre);
  updateFilter(rows, selectFilterAuthor, selectFilterGenre, selectGenre);
});
// Sorting
tableHeads.forEach((th, index) => {
  th.addEventListener('click', () => {
    sortTable(index, rows);
  });
});

// Adding new book to the list
function addNewBook(e) {
  try {
    const form = document.querySelector('form');
    e.preventDefault();
    addTableRow(
      inputTitle.value,
      inputAuthor.value,
      selectGenre.value,
      selectPrior.value,
      tableBody
    );
    saveToLocal();
    updateFilter(rows, selectFilterAuthor, selectFilterGenre, selectGenre);
    countGenres(rows, genCouterList);
    form.reset();
  } catch {
    alert('Oops! Please check entry...'); // eslint-disable-line no-alert
  }
}
// -- Deleting and editing book entry
function deleteEdit(e) {
  const target = e.target;
  const editedRow = target.parentElement.parentElement;
  if (target.classList.contains('delete-btn')) {
    editedRow.remove();
    updateFilter(rows, selectFilterAuthor, selectFilterGenre, selectGenre);
    countGenres(rows, genCouterList);
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
        updateFilter(rows, selectFilterAuthor, selectFilterGenre, selectGenre);
        countGenres(rows, genCouterList);
        saveToLocal();
      });
    }
  }
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
    addTableRow(book[0], book[1], book[2], book[3], tableBody);
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
  updateFilter(rows, selectFilterAuthor, selectFilterGenre, selectGenre);
}

// Functions call
// localStorage.clear();
getLocal();
countGenres(rows, genCouterList);
