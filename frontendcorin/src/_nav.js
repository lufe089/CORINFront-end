/* Contiene la información que se muestra en el menu de inicio , para internacionaliar la app, es posible
que se necesite un método que cambie el name de un idioma a otro */
/* eslint-disable */
export default {
    items: [
        /*{
                    name: 'Instrucciones',
                    url: '/instructions',
                    icon: 'icon-info'
                },*/
        {
            name: 'Evaluación',
            url: '/main_instrument',
            icon: 'fa icon-notebook'
                /* children: [ ] */
        },
        /*  {
          name: 'Motivation',
          url: 'main_instrument',
          icon: 'fa fa-check-square-o'
        },
        {
          name: 'Preparation',
          url: '/base/forms',
          icon: 'fa fa-thermometer-1'
        }, */
        {
            title: true,
            name: 'Resultados',
            url: '/result',
            icon: 'fa fa-pie-chart',
        },
        {
            name: 'Por categorías',
            url: '/result-by-categories',
            icon: 'fa icon-graph'
                //TODO completar
        },
        {
            name: 'Por directivos/no directivos',
            url: '/result-by-directives',
            icon: 'fa icon-graph'
                //TODO completar
        },
        {
            name: 'Por áreas',
            url: '/result-by-areas',
            icon: 'fa icon-graph'

        },
        {
            title: true,
            name: 'Resultados específicos',
            url: '/especific_results',
            icon: 'fa icon-puzzle'

        },
        {
            name: 'Por dimensiones y componentes',
            url: '/results_by_dim_comp',
            icon: 'fa icon-chart'

        },
        {
            name: 'Exportar',
            url: '/export',
            icon: 'fa icon-cloud-download',
        },
        {
            title: true,
            name: 'Configuración',
        },
        {
            name: 'Personalizar encuesta',
            url: '/customSurvey',
            icon: 'fa icon-settings'
        },
        {
            name: 'Clientes',
            url: '/clients',
            icon: 'fa icon-people'
        },
        {
            name: 'Configuración de encuestas',
            url: '/configSurveys',
            icon: 'fa icon-docs'
        }
        /*{
            title: true,
            name: 'Satisfaction evaluation',
            class: '',
            wrapper: {
                element: '',
                attributes: {}
            }
        }*/
    ]
}