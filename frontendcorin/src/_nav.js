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
            name: 'Resultados',
            url: '/result',
            icon: 'fa fa-pie-chart'
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
        },
        {
            name: 'Personalizar encuesta',
            url: '/customSurvey',
            icon: 'fa icon-puzzle'
        },
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