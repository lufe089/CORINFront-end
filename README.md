# CORIN
Survey about the organizational culture in industries

# CORIN VUE js project structure
[Adapted from ] (https://itnext.io/how-to-structure-a-vue-js-project-29e4ddc1aeeb)

- **assets** — Where you put any assets that are imported into your components
-  **components** — All the components of the projects that are not the main views
// - **mixins** — The mixins are the parts of javascript code that is reused in different components. In a mixin you can put any component’s -methods from Vue.js they will be merged with the ones of the component that uses it.
- **router** — Routes of the projects (in this project all of them are in the index.js). 
// Basically in Vue.js everything is a component. 
// But not - **everything is a page. A page has a route like “/dashboard”, “/settings” or “/search”. 
// If a component has a route it is routed.
- **store** (optional) — The Vuex constants in mutation-type.js, the Vuex modules in the subfolder modules (which are then loaded in the index.js).
- **lang** — Locales files to i18n. This project uses Vue-i18n.
- **common (optional)** — Functions that I use in some components, such as regex value testing, constants or filters.
- **views** —Components that represent the main pages inside the web site and have its own route such as “/dashboard”, “/settings” or “/search”. 
