function inputShow(inputGenre, selectGenre, addGenreBtn) {
  inputGenre.classList.toggle('active');
  if (inputGenre.classList.contains('active')) {
    selectGenre.classList.add('hidden');
    addGenreBtn.innerHTML = '<i class="fas fa-check-circle fa-lg"></i>';
  } else {
    selectGenre.classList.remove('hidden');
    addGenreBtn.innerHTML = '<i class="fas fa-plus-circle fa-lg"></i>';
  }
  return inputShow;
}

function addGenre(e, inputGenre, selectGenre) {
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
  }
  return addGenre;
}

// Counting Genres

function countGenres(rows, genCouterList) {
  // Getting genres
  const genresAll = [];
  rows.forEach((row) => {
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
  return countGenres;
}

function resetGenres(selectGenre) {
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
}

export { inputShow, addGenre, countGenres, resetGenres };
