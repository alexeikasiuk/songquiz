import { Game } from './scripts/game';

const pages = document.querySelectorAll('.page');
let game = null;

// go to page
const goTo = (to) => {
  const curMenuItem = document.querySelector('.link_active'),
    curPage = document.querySelector('.page_enable'),
    goToMenuItem = document.querySelector(`[data-class=${to}]`),
    goToPage = document.querySelector(`[data-id=${to}]`);

  // toggle menu items
  curMenuItem.classList.remove('link_active');
  goToMenuItem.classList.add('link_active');

  // // hide current page
  curPage.classList.remove('page_enable');
  curPage.classList.add('page_disable');
  curPage.addEventListener(
    'transitionend',
    () => {
      // show next page
      goToPage.classList.add('page_enable');
      goToPage.classList.remove('page_disable');
    },
    {
      once: true,
    }
  );
};

// load chosen game
const startGame = (name) => {
  game = new Game(name);
  game.init();

  goTo('game-page');
};

// navigation menu
const menuClickHandler = (e) => {
  if (e.target.classList.contains('link_active')) return;

  const goto = e.target.getAttribute('data-class');

  // first page load (game doesn't chose)
  if (goto === 'game-page' && !game) return;

  goTo(goto);

  // if goto = results-page, render current stats results
  if (goto === 'result-page') renderResultsPage();
};

// init navigation menu
document.querySelectorAll('.navigation__link').forEach((link) => {
  link.addEventListener('click', menuClickHandler);
});

//chose game
document.querySelectorAll('.quiz__btn').forEach((btn) => {
  btn.addEventListener('click', (e) =>
    startGame(e.target.getAttribute('data-id'))
  );
});

// render results
const renderResultsPage = () => {
  const local = JSON.parse(localStorage.getItem('game')).reverse();
  if (!local) return;

  const table = document.querySelector('.results__table');

  //clear old version
  table.innerHTML = `
            <tr>
              <th>Дата</th>
              <th>Викторина</th>
              <th>Счёт</th>
            </tr>
  `;

  local.forEach((item) => {
    const name = item.name;
    const score = item.score;
    const date = new Date(item.date),
      year = date.getFullYear(),
      month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1,
      day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
      hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
      minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let wDay = date.getDay();
    wDay =
      wDay == 0
        ? 'вс'
        : wDay == 1
        ? 'пн'
        : wDay == 2
        ? 'вт'
        : wDay == 3
        ? 'ср'
        : wDay == 4
        ? 'чт'
        : wDay == 5
        ? 'пт'
        : 'сб';
    table.insertAdjacentHTML(
      'beforeend',
      `
              <tr>
                <th>${day}.${month}.${year} ${wDay}, ${hours}:${minutes}</th>
                <th>${name}</th>
                <th>${score}</th>
              </tr>
    `
    );
  });
};

// burger menu
const burgerBtn = document.querySelector('.burger');
const burgerMenu = document.querySelector('.header__navigation');
// open menu
burgerBtn.onclick = () => {
  burgerMenu.classList.toggle('_show');
  burgerBtn.classList.toggle('_show');
  console.log('burger on');
};
// close menu
document.onclick = (e) => {
  if (e.target === burgerMenu) return;
  if (
    (e.target.classList.contains('navigation__link') ||
      (e.target !== burgerMenu && e.target !== burgerBtn)) &&
    burgerMenu.classList.contains('_show')
  ) {
    burgerMenu.classList.remove('_show');
    burgerBtn.classList.remove('_show');

    console.log(e.target);
    console.log('burger 0ff');
  }
};
