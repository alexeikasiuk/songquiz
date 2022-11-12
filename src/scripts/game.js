import birds from './birds';
import animals from './animals';
import { Player } from './player';
import wrongSound from '../assets/media/wrong.mp3';
import correctSound from '../assets/media/correct.mp3';

export class Game {
  constructor(name) {
    this.name = name;
    this.data = null;
    this.count = 0;
    this.task = null;
    this.levels = null;
    this.level = 0;
    // while user doesn't have wrong answers
    this.levelStatus = true;
    // game nodes
    this.nextLvlBtn = null;
    this.scoreNodes = null;
    // max score
    this.taskScore = 5;
    this.taskComplete = false;
  }

  init() {
    this.data = this.name === 'birds' ? birds : animals;

    // set game name, levels names, start score
    this.preSet();

    // set random task for first level & list of answers
    this.setLevel(this.level);

    // bind game click events
    this.bindEvents();
  }

  preSet() {
    this.scoreNode = document.querySelector('.count');
    this.levels = document.querySelectorAll('.levels__level');

    document.querySelector('.game-logo__theme').textContent = this.name;
    this.scoreNode.textContent = this.count;

    this.levels.forEach((level, i) => {
      level.textContent = this.data[i][0];
    });
  }

  setLevel(lvl) {
    // highlight current level
    this.levels.forEach((level, i) => {
      if (i === lvl) level.classList.add('_active');
      else level.classList.remove('_active');
    });

    // load random task for current level
    this.loadTask(lvl);

    // load answers for current level
    this.loadAnswers(lvl);
  }

  loadTask(lvl) {
    const playerNode = document.querySelector('.task__player');

    this.taskComplete = false;
    this.taskScore = 5;

    this.task = this.random(this.data[lvl][1]);
    this.taskImg = document.querySelector('.task__image');
    this.taskName = document.querySelector('.task__title');

    this.taskName.textContent = '********';
    this.taskImg.src =
      'https://birds-quiz.netlify.app/static/media/bird.06a46938.jpg';

    if (this.taskPlayer) {
      this.taskPlayer.destroy();
    }
    this.taskPlayer = new Player(this.task.audio, playerNode);
  }

  showFullTaskData() {
    this.taskName.textContent = this.task.name;
    this.taskImg.src = this.task.image;
  }

  loadAnswers(lvl) {
    const level = this.data[lvl][1];
    this.answers = document.querySelectorAll('.answer');

    this.answers.forEach((answer, i) => {
      answer.setAttribute('data-id', level[i].id);
      answer.lastElementChild.textContent = level[i].name;
      answer.firstElementChild.classList.remove('_correct');
      answer.firstElementChild.classList.remove('_wrong');
    });
  }

  bindEvents() {
    // go to next level
    this.nextLvlBtn = document.querySelector('.next__btn');
    this.nextLvlBtn.onclick = this.nextLvlClickHandler.bind(this);

    // play again button
    document.querySelector('.win__btn').onclick = this.gameRestart.bind(this);

    // answer click
    this.answers.forEach((answer) => {
      answer.onclick = this.answerClickHandler.bind(this);
    });
  }

  answerClickHandler(e) {
    let el = e.target;
    el = !el.classList.contains('answer') ? el.closest('.answer') : el;

    const id = +el.getAttribute('data-id');

    this.showAnswerData(id);
    this.checkAnswer(id, el);
  }

  nextLvlClickHandler(e) {
    if (e.target.classList.contains('_disable')) return;

    // stop players
    this.taskPlayer.stop();
    this.answerPlayer.stop();

    // check game status
    if (this.level === 5 && this.taskComplete) {
      this.showWinMsg();
      this.saveResult();
      return;
    }

    // disable next level button
    document.querySelector('.next__btn').classList.add('_disable');

    this.level += 1;
    this.setLevel(this.level);
    this.hideAnswerData();
  }

  showAnswerData(id) {
    // order № in data array for level == (id - 1)
    this.loadAnswerData(id - 1);

    // at the begin of the game
    this.renderAnswerData();
  }

  loadAnswerData(id) {
    const data = this.data[this.level][1][id];
    const img = document.querySelector('.answer__image');
    const name = document.querySelector('.answer__title');
    const group = document.querySelector('.answer__subtitle');
    const playerNode = document.querySelector('.answer__player');
    const description = document.querySelector('.answer__description');

    img.src = data.image;
    img.alt = data.name;
    name.textContent = data.name;
    group.textContent = data.species;

    // stop last play if it exist
    if (this.answerPlayer) {
      this.answerPlayer.destroy();
    }

    this.answerPlayer = new Player(data.audio, playerNode);
    description.textContent = data.description;
  }

  renderAnswerData() {
    const preDataNode = document.querySelector('.pre-answer');
    if (preDataNode.classList.contains('_disable')) return;

    // show disabled children elements for the answer-data block
    document
      .querySelectorAll('.answer-data ._disable')
      .forEach((el) => el.classList.remove('_disable'));

    // hide the pre-answer block
    preDataNode.classList.add('_disable');
  }

  hideAnswerData() {
    document.querySelector('.pre-answer').classList.remove('_disable');
    document.querySelector('.answer__media').classList.add('_disable');
    document.querySelector('.answer__description').classList.add('_disable');
  }

  checkAnswer(id, el) {
    const checkbox = el.firstElementChild;
    if (this.taskComplete) return;

    // repeat answer click
    if (
      checkbox.classList.contains('_wrong') ||
      checkbox.classList.contains('_correct')
    )
      return;

    if (id !== this.task.id) {
      // wrong answer
      this.wrongAnswerHandler(el);
    } else {
      // right answer
      this.correctAnswerHandler(el);
    }
  }

  correctAnswerHandler(el) {
    this.taskComplete = true;
    new Audio(correctSound).play();

    // increase & update total score
    this.count += this.taskScore;
    this.scoreNode.textContent = this.count;
    el.firstElementChild.classList.add('_correct');
    this.showFullTaskData();

    // stop players
    if (!this.taskPlayer.paused) this.taskPlayer.stop();
    if (!this.answerPlayer.paused) this.answerPlayer.stop();

    // enable next level button
    document.querySelector('.next__btn').classList.remove('_disable');
  }

  wrongAnswerHandler(el) {
    new Audio(wrongSound).play();
    this.taskScore--;
    el.firstElementChild.classList.add('_wrong');
  }

  showWinMsg() {
    // max Score = 30
    if (this.count == 30) {
      document.querySelector('.top-lvl').classList.remove('_disable');
    }

    document.querySelector('.task').classList.add('_disable');
    document.querySelector('.answers-wrapper').classList.add('_disable');
    document.querySelector('.next').classList.add('_disable');
    document.querySelector('.win').classList.remove('_disable');

    // show score
    document.querySelector('.win-score').textContent = this.count;
  }

  hideWinMsg() {
    const bestGame = document.querySelector('.top-lvl');

    if (!bestGame.classList.contains('_disable'))
      bestGame.classList.add('_disable');

    document.querySelector('.task').classList.remove('_disable');
    document.querySelector('.answers-wrapper').classList.remove('_disable');
    document.querySelector('.next').classList.remove('_disable');
    document.querySelector('.win').classList.add('_disable');
  }

  gameRestart() {
    this.count = 0;
    this.level = 0;
    this.scoreNode.textContent = this.count;
    this.setLevel(this.level);
    this.hideWinMsg();
  }

  saveResult() {
    const result = {
      name: this.name,
      date: Date.now(),
      score: this.count,
    };
    let local = JSON.parse(localStorage.getItem('game'));

    // first game
    if (!local) localStorage.setItem('game', JSON.stringify([result]));

    // save only 20 last games
    if (local.length > 9) local = local.slice(local.length - 19);

    local.push(result);
    localStorage.setItem('game', JSON.stringify(local));
  }

  random(arr) {
    //correct random for min & max items
    // max = last element + 1
    const min = 0,
      max = arr.length;
    const rand = min + Math.random() * (max - min);
    return arr[Math.floor(rand)];
  }
}
