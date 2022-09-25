import View from './View';
// import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPaginate(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtn('next', curPage);
    }
    // Page 1 and no other pages
    if (curPage === 1 && numPages === 1) {
      return '';
    }

    // Last page
    if (curPage === numPages) {
      return this._generateMarkupBtn('prev', curPage);
    }
    // Other page
    return [
      this._generateMarkupBtn('prev', curPage),
      this._generateMarkupBtn('next', curPage),
    ].join('');
  }

  _generateMarkupBtn(pageType, currentPage) {
    const gotoPage = pageType === 'prev' ? currentPage - 1 : currentPage + 1;
    return `
      <button data-goto='${gotoPage}' class='btn--inline pagination__btn--${pageType}'>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-${
      pageType === 'prev' ? 'left' : 'right'
    }'></use>
        </svg>
        <span>Page ${gotoPage}</span>
      </button>`;
  }
}

export default new PaginationView();
