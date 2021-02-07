function filterTable(n, rows, filterArr) {
  const filter = filterArr[n].value;
  const filterAut = filterArr[0];
  const filterGen = filterArr[1];
  const filterPrior = filterArr[2];
  if (filter === '') {
    rows.forEach((row) => {
      row.classList.remove('hidden');
    });
  } else {
    rows.forEach((row) => {
      const filteredCol = row.querySelectorAll('td')[n + 1];
      if (filteredCol.innerText === filter) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    });
  }
  // Reseting other two filters when filter by:
  // Author
  if (filter === filterAut.value) {
    filterGen.selectedIndex = 0;
    filterPrior.selectedIndex = 0;
  }
  // Genre
  if (filter === filterGen.value) {
    filterAut.selectedIndex = 0;
    filterPrior.selectedIndex = 0;
  }
  // Priority
  if (filter === filterPrior.value) {
    filterGen.selectedIndex = 0;
    filterAut.selectedIndex = 0;
  }
  return filterTable;
}

function updateFilter(rows, selectFilterAuthor, selectFilterGenre, selectGenre) {
  // Updating author filter
  const authorsAll = [];
  rows.forEach((row) => {
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

// Sorting

function sortTable(n, rows) {
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
  return sortTable;
}

export { filterTable, updateFilter, sortTable };
