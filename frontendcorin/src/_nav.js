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
            icon: 'fa fa-thermometer-1'
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
            icon: 'fa fa-pie-chart'
                //TODO completar
        },
        {
            name: 'Por directivos/no directivos',
            url: '/result-by-directives',
            icon: 'fa fa-pie-chart'
                //TODO completar
        },
        {
            name: 'Por áreas',
            url: '/result-by-areas',
            icon: 'icon-puzzle'

        },
        {
            title: true,
            name: 'Resultados específicos',
            url: '/especific_results',
            icon: 'icon-puzzle'

        },
        {
            name: 'Por dimensiones y componentes',
            url: '/results_by_dim_comp',
            icon: 'icon-puzzle'

        },
        {
            name: 'Exportar',
            url: '/export',
            icon: 'fa fa-pie-chart',
        },
        {
            title: true,
            name: 'Configuración',
        },
        {
            name: 'Personalizar encuesta',
            url: '/customSurvey',
            icon: 'fa icon-puzzle'
        },
        {
            name: 'Clientes',
            url: '/clients',
            icon: 'fa icon-call-out'
        },
        {
            name: 'Configuración de encuestas',
            url: '/configSurveys',
            icon: 'fa icon-call-out'
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