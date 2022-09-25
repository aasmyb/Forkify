import View from './View';

class AddRecipeView extends View {
  _message = 'Recipe was successfully uploaded✅.';
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindowHandler() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      'click',
      this.toggleWindowHandler.bind(this)
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener(
      'click',
      this.toggleWindowHandler.bind(this)
    );
    this._overlay.addEventListener(
      'click',
      this.toggleWindowHandler.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const arrData = [...new FormData(e.currentTarget)];
      const data = Object.fromEntries(arrData);
      handler(data);
    });
  }
}

export default new AddRecipeView();
