import Fraction from 'fraction.js';
import { MSG_TYPE_ERROR } from '../config';
// import icons from 'url:../../img/icons.svg';
const icons = 'h';

export default class View {
  _data;

  // For IntelliJ
  _parentElement;
  _errorMessage;
  _message;

  _generateMarkup() {}

  _clearInsert(insMarkup) {
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', insMarkup);
  }

  _generateMarkupIngredient(ing) {
    return `
      <li class='recipe__ingredient'>
        <svg class='recipe__icon'>
          <use href='${icons}#icon-check'></use>
        </svg>
        <div class='recipe__quantity'>${
          ing.quantity ? new Fraction(ing.quantity).toFraction().toString() : ''
        }</div>
        <div class='recipe__description'>
          <span class='recipe__unit'>${ing.unit}</span>
          ${ing.description}
        </div>
      </li>`;
  }

  _generateMarkupSpinner() {
    return `
      <div class='spinner'>
        <svg>
          <use href='${icons}#icon-loader'></use>
        </svg>
      </div>`;
  }

  _generateMarkupMsg(msgType, msgTxt) {
    return `
    <div class='${msgType === MSG_TYPE_ERROR ? 'error' : 'message'}'>
      <div>
        <svg>
          <use href='${icons}#icon-${
      msgType === MSG_TYPE_ERROR ? 'alert-triangle' : 'smile'
    }'></use>
        </svg>
      </div>
      <p>${msgTxt}</p>
    </div>`;
  }

  /**
   * Renders the received object to dom
   * @param {Object | Object[]} data the data to be rendered (e.g. recipe)
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderMsg(MSG_TYPE_ERROR);
    this._data = data;
    const markup = this._generateMarkup();
    this._clearInsert(markup);
  }

  renderSpinner() {
    const markup = this._generateMarkupSpinner();
    this._clearInsert(markup);
  }

  renderMsg(type, message) {
    if (!message) {
      message = type === MSG_TYPE_ERROR ? this._errorMessage : this._message;
    }
    const markup = this._generateMarkupMsg(type, message);
    this._clearInsert(markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newEls = Array.from(newDom.querySelectorAll('*'));
    const curEls = Array.from(this._parentElement.querySelectorAll('*'));
    newEls.forEach((newElement, i) => {
      const curElement = curEls[i];

      // Update changed text
      if (
        !newElement.isEqualNode(curElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        curElement.textContent = newElement.textContent;
      }

      // Update changed attributes
      if (!newElement.isEqualNode(curElement)) {
        Array.from(newElement.attributes).forEach(attr =>
          curElement.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
}
