/* eslint-disable */
export default {

    apiURL: 'http://localhost:8000/api/',
    // apiURL: 'http://zalonore.pythonanywhere.com/api/',
    parameters: {
        position: [{
                value: true,
                text: 'Directivo'
            },
            {
                value: false,
                text: 'No directivo'
            }

        ],
        yes_no: [{
                value: true,
                text: 'Si'
            },
            {
                value: false,
                text: 'No'
            }

        ],
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
        area_id: undefined,
        email: '',
        last_update: '',
        comments: '',
        is_directive: undefined,
        is_complete: false,
        responsesList: [],
        customized_instrument_id: undefined
    },
    pageOptions: [5, 10, 15, 40],
    validation_attr_dictionnary: {
        // Contiene el nombre de los atributos de los campos que se muestran cuando hay mensajes de error
        en: {
            attributes: {
                constitutionYear: 'Constitution year'
            }
        },
        es: {
            attributes: {
                constitutionYear: 'Año de constitución',
                numberEmployees: 'Número de empleados',
                constitutionYear: 'Año de constitución',
                corporativeGroup: '¿Grupo empresarial?',
                familyCompany: '¿Empresa familiar?',
                company: 'Compañía',
                access_code: 'Código de acceso',
                maxSurveys: 'Máximo de encuestas'
            }
        }
    },
    exportFileNames: { 'items': 'Preguntas.xls', 'responses': 'RespuestasTodas.xls', 'clients': 'Clientes.xls' }
}