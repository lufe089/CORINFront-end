/* eslint-disable */
export default {

    // apiURL: 'http://localhost:8000/',
    apiURL: 'http://zalonore.pythonanywhere.com/',
    parameters: {
        directivePositions: [
            { value: undefined, text: '--' },
            { value: 1, text: 'Alta Gerencia' },
            { value: 2, text: 'Gerencia media' },
            { value: 3, text: 'Gerencia baja' }
        ],
        area: [
            { value: undefined, text: '--' },
            { value: 1, text: 'Área de Producción/operaciones' },
            { value: 1, text: 'Área comercial' },
            { value: 1, text: 'Área de tecnología' },
            { value: 1, text: 'Área de gestión humana' },
            { value: 1, text: 'Área de investigación y desarrollo' }
        ],
        position: [{
                value: true,
                text: 'Directivo'
            },
            {
                value: false,
                text: 'No directivo'
            }

        ]
    },
    appliesLikertOptions: [
        { text: '1', value: 1 },
        { text: '2', value: 2 },
        { text: '3', value: 3 },
        { text: '4', value: 4 },
        { text: '5', value: 5 },
        { text: '6', value: 6 },
        { text: '7', value: 7 },
        { text: '8', value: 8 },
        { text: '9', value: 9 },
    ],
    participantResponse: {
        position: undefined,
        area: undefined,
        email: '',
        last_update: '',
        comments: '',
        is_directive: undefined,
        is_complete: false,
        responsesList: [],
        customized_instrument_id: 1
    }
}