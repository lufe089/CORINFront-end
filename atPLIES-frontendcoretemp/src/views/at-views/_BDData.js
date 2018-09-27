/* eslint-disable */
export default {
    parameters: {
        profiles: [
            { value: 1, text: 'Consultant' },
            { value: 2, text: 'Graduate student' },
            { value: 3, text: 'Undergraduate student' },
            { value: 5, text: 'Project manager' },
            { value: 6, text: 'Product manager' },
            { value: 7, text: 'Software engineer' },
            { value: 8, text: 'Other' }
        ]
    },
    improvementOptions: [
        { text: '-- Please select an option --', value: null },
        { text: 'Redundant', value: 0 },
        { text: 'Useless', value: 1 },
        { text: 'Difficult to read it', value: 2 },
        { text: 'Unclear', value: 3 },
    ],
    appliesLikertOptions: [
        { text: 'Not at all', value: 0 },
        { text: 'Just a litte', value: 1 },
        { text: 'Somewhat', value: 2 },
        { text: 'Mostly', value: 3 },
        { text: 'Almost totally', value: 4 },
        { text: 'Totally', value: 5 },
        { text: 'Don\'t know', value: -1 },
    ],
    participantResponse: {
        name: '',
        profiles: [],
        email: '',
        last_update: '',
        frameworkVersion: '',
        idCustomizedInstrument: '',
        comments: '',
        isAdminResponse: false,
        isComplete: false,
        responsesList: [{
            idItem: 1,
            needReview: false,
            answerNumeric: 4,
            typeReview: 'redundant',
            reviewComments: 'string',
            answer_text: 'string'
        }]
    },
    customizedInstrument: {
        'generalDescription': 'instrument description',
        'featuresDescription': 'features description',
        'disclaimer': 'it something gets wrong is not my fault',
        'motivation': 'complete text about applies motivation',
        'preparation': 'description about applies preparation',
        'userInstructions': 'how people should use this instrument',
        'i18nCode': '',
        'frameworkVersion': 'V.1.0.a2',
        itemsHierarchy: {
            motivationHierarchy: [{
                hierarchicalItem: {
                    'itemData': {
                        'itemId': 1,
                        'suggestedImportance': {
                            'numericValue': 1,
                            'label': 'desirable'
                        },
                        'responseFormat': 'rating',
                        'name': 'Operational',
                        'description': 'This dimension evaluates company operational factors',
                        'justification': 'string',
                        'hierarchicalLevel': 1,
                        'feedback': [{
                            'feedbackType': 'positive',
                            'text': 'string',
                            'minScore': 0,
                            'maxScore': 0,
                            'references': [{
                                'name': 'Empirical evaluation of a decision support model for adopting software product line engineering',
                                'reference': '(Tüzün, Tekinerdogan, Kalender, & Bilgen, 2015)',
                                'cite': 'Tüzün, E., Tekinerdogan, B., Kalender, M. E., & Bilgen, S. (2015). Empirical evaluation of a decision support model for adopting software product line engineering. Information and Software Technology, 60, 77–101. https://doi.org/10.1016/j.infsof.2014.12.007'
                            }]
                        }]
                    },
                    subHierarchicalItems: [{
                        'itemData': {
                            'itemId': 1,
                            'suggestedImportance': {
                                'numericValue': 1,
                                'label': 'desirable'
                            },
                            'responseFormat': 'rating',
                            'name': 'Operational level 2',
                            'description': 'Criterion 2',
                            'justification': 'string',
                            'hierarchicalLevel': 1,
                            'feedback': [{
                                'feedbackType': 'positive',
                                'text': 'string',
                                'minScore': 0,
                                'maxScore': 0,
                                'references': [{
                                    'name': 'Empirical evaluation of a decision support model for adopting software product line engineering',
                                    'reference': '(Tüzün, Tekinerdogan, Kalender, & Bilgen, 2015)',
                                    'cite': 'Tüzün, E., Tekinerdogan, B., Kalender, M. E., & Bilgen, S. (2015). Empirical evaluation of a decision support model for adopting software product line engineering. Information and Software Technology, 60, 77–101. https://doi.org/10.1016/j.infsof.2014.12.007'
                                }]
                            }]
                        },
                        subItems: [{
                                'itemId': 1,
                                'suggestedImportance': {
                                    'numericValue': 1,
                                    'label': 'desirable'
                                },
                                'responseFormat': 'rating',
                                'name': 'sub criterion 1',
                                'description': 'sub criterion 1',
                                'justification': 'string',
                                'hierarchicalLevel': 1,
                                'feedback': [{
                                    'feedbackType': 'positive',
                                    'text': 'string',
                                    'minScore': 0,
                                    'maxScore': 0,
                                    'references': [{
                                        'name': 'Empirical evaluation of a decision support model for adopting software product line engineering',
                                        'reference': '(Tüzün, Tekinerdogan, Kalender, & Bilgen, 2015)',
                                        'cite': 'Tüzün, E., Tekinerdogan, B., Kalender, M. E., & Bilgen, S. (2015). Empirical evaluation of a decision support model for adopting software product line engineering. Information and Software Technology, 60, 77–101. https://doi.org/10.1016/j.infsof.2014.12.007'
                                    }]
                                }]
                            },
                            {
                                'itemId': 10,
                                'suggestedImportance': {
                                    'numericValue': 1,
                                    'label': 'desirable'
                                },
                                'responseFormat': 'rating',
                                'name': 'sub criterion 2',
                                'description': 'sub criterion 2',
                                'justification': 'string',
                                'hierarchicalLevel': 1,
                                'feedback': [{
                                    'feedbackType': 'positive',
                                    'text': 'string',
                                    'minScore': 0,
                                    'maxScore': 0,
                                    'references': [{
                                        'name': 'Empirical evaluation of a decision support model for adopting software product line engineering',
                                        'reference': '(Tüzün, Tekinerdogan, Kalender, & Bilgen, 2015)',
                                        'cite': 'Tüzün, E., Tekinerdogan, B., Kalender, M. E., & Bilgen, S. (2015). Empirical evaluation of a decision support model for adopting software product line engineering. Information and Software Technology, 60, 77–101. https://doi.org/10.1016/j.infsof.2014.12.007'
                                    }]
                                }]
                            }
                        ]
                    }]
                }
            }],
            'preparationHierarcy': [{
                'hierarchicalItem': {
                    'itemData': {
                        'itemId': 1,
                        'suggestedImportance': {
                            'numericValue': 1,
                            'label': 'desirable'
                        },
                        'responseFormat': 'rating',
                        'name': 'Operational',
                        'description': 'This dimension evaluates company operational factors',
                        'justification': 'string',
                        'hierarchicalLevel': 1,
                        'feedback': [{
                            'feedbackType': 'positive',
                            'text': 'string',
                            'minScore': 0,
                            'maxScore': 0,
                            'references': [{
                                'name': 'Empirical evaluation of a decision support model for adopting software product line engineering',
                                'reference': '(Tüzün, Tekinerdogan, Kalender, & Bilgen, 2015)',
                                'cite': 'Tüzün, E., Tekinerdogan, B., Kalender, M. E., & Bilgen, S. (2015). Empirical evaluation of a decision support model for adopting software product line engineering. Information and Software Technology, 60, 77–101. https://doi.org/10.1016/j.infsof.2014.12.007'
                            }]
                        }]
                    },
                    'subHierarchicalItems': [{
                        'itemData': {
                            'itemId': 1,
                            'suggestedImportance': {
                                'numericValue': 1,
                                'label': 'desirable'
                            },
                            'responseFormat': 'rating',
                            'name': 'Operational',
                            'description': 'This dimension evaluates company operational factors',
                            'justification': 'string',
                            'hierarchicalLevel': 1,
                            'feedback': [{
                                'feedbackType': 'positive',
                                'text': 'string',
                                'minScore': 0,
                                'maxScore': 0,
                                'references': [{
                                    'name': 'Empirical evaluation of a decision support model for adopting software product line engineering',
                                    'reference': '(Tüzün, Tekinerdogan, Kalender, & Bilgen, 2015)',
                                    'cite': 'Tüzün, E., Tekinerdogan, B., Kalender, M. E., & Bilgen, S. (2015). Empirical evaluation of a decision support model for adopting software product line engineering. Information and Software Technology, 60, 77–101. https://doi.org/10.1016/j.infsof.2014.12.007'
                                }]
                            }]
                        },
                        'subItems': [{
                            'itemId': 1,
                            'suggestedImportance': {
                                'numericValue': 1,
                                'label': 'desirable'
                            },
                            'responseFormat': 'rating',
                            'name': 'Operational',
                            'description': 'This dimension evaluates company operational factors',
                            'justification': 'string',
                            'hierarchicalLevel': 1,
                            'feedback': [{
                                'feedbackType': 'positive',
                                'text': 'string',
                                'minScore': 0,
                                'maxScore': 0,
                                'references': [{
                                    'name': 'Empirical evaluation of a decision support model for adopting software product line engineering',
                                    'reference': '(Tüzün, Tekinerdogan, Kalender, & Bilgen, 2015)',
                                    'cite': 'Tüzün, E., Tekinerdogan, B., Kalender, M. E., & Bilgen, S. (2015). Empirical evaluation of a decision support model for adopting software product line engineering. Information and Software Technology, 60, 77–101. https://doi.org/10.1016/j.infsof.2014.12.007'
                                }]
                            }]
                        }]
                    }]
                }
            }]
        }
    }
}