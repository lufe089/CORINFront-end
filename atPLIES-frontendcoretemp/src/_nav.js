/* Contiene la información que se muestra en el menu de inicio , para internacionaliar la app, es posible
que se necesite un método que cambie el name de un idioma a otro */
/* eslint-disable */
export default {
    items: [{
            name: 'Disclaimer',
            url: '/dashboard',
            icon: 'icon-speedometer'
        },
        {
            title: true,
            name: 'APPLIES-tool',
            class: '',
            wrapper: {
                element: '',
                attributes: {}
            }
        },
        {
            name: 'Instructions',
            url: '/instructions',
            icon: 'icon-info'
        },
        {
            name: 'Assessment instrument',
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
            name: 'Results',
            url: '/base/forms',
            icon: 'fa fa-pie-chart'
        },
        {
            title: true,
            name: 'Satisfaction evaluation',
            class: '',
            wrapper: {
                element: '',
                attributes: {}
            }
        }
    ]
}