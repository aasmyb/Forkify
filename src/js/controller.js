// https://forkify-api.herokuapp.com/v2
import '../styles/main.scss';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import {
  MSG_TYPE_ERROR,
  MODAL_CLOSE_SECS,
  MSG_TYPE_SUCCESS,
} from './config.js';

const controlRecipesHandler = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // Update results view & bookmarks view to match selected recipe
    resultsView.update(model.getSearchResultsByPage());
    bookmarksView.update(model.state.bookmarks);

    // Loading recipe
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderMsg(MSG_TYPE_ERROR);
  }
};

const controlSearchResultsHandler = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;

    // Render spinner
    resultsView.renderSpinner();

    // Loading results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsByPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderMsg(MSG_TYPE_ERROR);
  }
};

const controlPaginationHandler = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsByPage(goToPage));

  // Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServingsHandler = function (newServings) {
  // Update recipe servings (state)
  model.updateServings(newServings);
  // Update recipe view
  recipeView.update(model.state.recipe);
};

const controlBookmarksHandler = function () {
  model.loadStoredBookmarks();
  bookmarksView.render(model.state.bookmarks);
};

const controlAddBookmarkHandler = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipeHandler = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMsg(MSG_TYPE_SUCCESS);

    // Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close modal form
    setTimeout(() => {
      addRecipeView.toggleWindowHandler();
    }, MODAL_CLOSE_SECS * 1000);
  } catch (err) {
    addRecipeView.renderMsg(
      MSG_TYPE_ERROR,
      'Wrong ingredient format. Please use the correct format.'
    );
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarksHandler);
  recipeView.addHandlerRender(controlRecipesHandler);
  recipeView.addHandlerUpdateServings(controlServingsHandler);
  recipeView.addHandlerAddBookmark(controlAddBookmarkHandler);
  addRecipeView.addHandlerUpload(controlAddRecipeHandler);
  searchView.addHandlerSearch(controlSearchResultsHandler);
  paginationView.addHandlerPaginate(controlPaginationHandler);
};
init();
