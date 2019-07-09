/* Why this file exists:
It is a commonly seen pattern to use constants for mutation types in various Flux implementations. This allows the code to take advantage of tooling like linters, and putting all constants in a single file allows your collaborators
to get an at-a-glance view of what mutations are possible in the entire application
Source: https://vuex.vuejs.org/guide/mutations.html" */
/* eslint-disable */
// LOGIN ACTIONS
export const CHECK_AUTH = "checkAuth";
export const LOGIN_PWD = "loginPwd";
export const LOGIN_ACCESS_CODE = "loginAccessCode";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_USER = "updateUser";

// OTHERS
export const ARTICLE_PUBLISH = "publishArticle";
export const ARTICLE_DELETE = "deleteArticle";
export const ARTICLE_EDIT = "editArticle";
export const ARTICLE_EDIT_ADD_TAG = "addTagToArticle";
export const ARTICLE_EDIT_REMOVE_TAG = "removeTagFromArticle";
export const ARTICLE_RESET_STATE = "resetArticleState";
export const COMMENT_CREATE = "createComment";
export const COMMENT_DESTROY = "destroyComment";
export const FAVORITE_ADD = "addFavorite";
export const FAVORITE_REMOVE = "removeFavorite";

export const FETCH_AREAS = "fetchAreas";
export const FETCH_QUESTIONS = "fetchQuestions";
export const FETCH_CATEGORIES = "fetchCategories";



export const FETCH_COMMENTS = "fetchComments";
export const FETCH_PROFILE = "fetchProfile";
export const FETCH_PROFILE_FOLLOW = "fetchProfileFollow";
export const FETCH_PROFILE_UNFOLLOW = "fetchProfileUnfollow";
export const FETCH_TAGS = "fetchTags";