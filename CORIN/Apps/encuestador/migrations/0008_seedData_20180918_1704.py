# Generatedd by Django 2.0.4 on 2018-09-18 22:03

from django.db import migrations
from Apps.encuestador.constants import APP_NAME
from Apps.encuestador.models import ClassificationChoice
from Apps.encuestador.models import LanguageChoice
from Apps.encuestador.models import ResponseFormatType


def insert_data(apps, schema_editor):
    ItemClassification = apps.get_model(APP_NAME, 'ItemClassification')
    Parametric_master = apps.get_model(APP_NAME, 'Parametric_master')
    Trans_parametric_table = apps.get_model(APP_NAME, 'Trans_parametric_table')
    Response_format = apps.get_model(APP_NAME, 'Response_format')
    Item = apps.get_model(APP_NAME, 'Item')
    Trans_item = apps.get_model(APP_NAME, 'Trans_item')

    ###  Clean the data from the tables in which we introduce data in this method
    Item.objects.all().delete()
    ItemClassification.objects.all().delete()
    Parametric_master.objects.all().delete()
    Trans_parametric_table.objects.all().delete()
    Response_format.objects.all().delete()
    Trans_item.objects.all().delete()


    itemClassification_list  = []

    ################### Dimensions
    dim_adaptabilidad= ItemClassification(name="Adaptabilidad", type=ClassificationChoice.DIMENSION.value,
                                              i18n_code=LanguageChoice.ES.name)
    dim_adaptabilidad.save()
    dim_ambidestreza = ItemClassification(name="Ambidestreza", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_ambidestreza.save()
    dim_aceptaDiv = ItemClassification(name="Aceptación de la diversidad", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_aceptaDiv.save()
    dim_asociacion = ItemClassification(name="Asociación", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_asociacion.save()
    dim_complOrga = ItemClassification(name="Complejidad organizacional", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_complOrga.save()
    dim_compromiso = ItemClassification(name="Compromiso", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_compromiso.save()
    dim_comunEffect = ItemClassification(name="Comunicación efectiva", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_comunEffect.save()
    dim_confianza = ItemClassification(name="Confianza", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_confianza.save()
    dim_confrontacion = ItemClassification(name="Confrontación", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_confrontacion.save()
    dim_controlBuroc = ItemClassification(name="Control burocrático", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_controlBuroc.save()
    dim_curiosidad = ItemClassification(name="Curiosidad", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_curiosidad.save()
    dim_ejecucion = ItemClassification(name="Ejecución", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_ejecucion.save()
    dim_entorno = ItemClassification(name="Entorno", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_entorno.save()
    dim_estrategia = ItemClassification(name="Estrategia", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_estrategia.save()
    dim_flexiMental = ItemClassification(name="Flexibilidad Mental", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_flexiMental.save()
    dim_geneIdeas = ItemClassification(name="Generación de ideas", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_geneIdeas.save()
    dim_impIdeas = ItemClassification(name="Implementación de ideas", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_impIdeas.save()
    dim_manConfli = ItemClassification(name="Manejo de conflictos", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_manConfli.save()
    dim_metri = ItemClassification(name="Métricas y retribución", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_metri.save()
    dim_orientClie = ItemClassification(name="Orientación al cliente y al mercado", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_orientClie.save()
    dim_orienRiesg = ItemClassification(name="Orientación al riesgo", type=ClassificationChoice.DIMENSION.value,
                                       i18n_code=LanguageChoice.ES.name)
    dim_orienRiesg.save()
    dim_orientEmpre = ItemClassification(name="Orientación emprendedora", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_orientEmpre.save()
    dim_orientRiesgo = ItemClassification(name="Orientación al riesgo", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_orientRiesgo.save()
    dim_prioriz = ItemClassification(name="Priorización", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_prioriz.save()
    dim_promIdeas = ItemClassification(name="Promoción de ideas", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_promIdeas.save()
    dim_recono_exig = ItemClassification(name="Reconocimiento y exigencia", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_recono_exig.save()
    dim_relacionam = ItemClassification(name="Relacionamiento", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_relacionam.save()
    dim_respeto = ItemClassification(name="Respeto", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_respeto.save()
    dim_simpli_agil = ItemClassification(name="Simplicidad y agilidad", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_simpli_agil.save()
    dim_tolError = ItemClassification(name="Tolerancia al error", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_tolError.save()
    dim_tom_decis = ItemClassification(name="Toma de decisiones", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_tom_decis.save()
    dim_trabaj_equ = ItemClassification(name="Trabajo en equipo", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_trabaj_equ.save()
    dim_veloc = ItemClassification(name="Velocidad", type=ClassificationChoice.DIMENSION.value,
                              i18n_code=LanguageChoice.ES.name)
    dim_veloc.save()

    ################### Categories
    cat_entorno_estrateg = ItemClassification(name="Entorno y estrategia", type=ClassificationChoice.CATEGORY.value,
                                              i18n_code=LanguageChoice.ES.name)
    cat_estructura = ItemClassification(name="Estructura", type=ClassificationChoice.CATEGORY.value,
                                              i18n_code=LanguageChoice.ES.name)
    cat_liderazgo = ItemClassification(name="Liderazgo y métricas", type=ClassificationChoice.CATEGORY.value,
                                              i18n_code=LanguageChoice.ES.name)
    cat_competOrganiz = ItemClassification(name="Competencias organizacionales", type=ClassificationChoice.CATEGORY.value,
                                       i18n_code=LanguageChoice.ES.name)
    cat_capacOrganiza = ItemClassification(name="Capacidades organizacionales",
                                           type=ClassificationChoice.CATEGORY.value,
                                           i18n_code=LanguageChoice.ES.name)
    cat_rasgos = ItemClassification(name="Rasgos culturales para la innovación",
                                           type=ClassificationChoice.CATEGORY.value,
                                           i18n_code=LanguageChoice.ES.name)
    cat_roles = ItemClassification(name="Roles comportamentales",
                                           type=ClassificationChoice.CATEGORY.value,i18n_code=LanguageChoice.ES.name)
    cat_entorno_estrateg.save()
    cat_estructura.save()
    cat_liderazgo.save()
    cat_competOrganiz.save()
    cat_capacOrganiza.save()
    cat_roles.save()
    cat_rasgos.save()

    ####################### Components
    comp_apropiacion= ItemClassification(name="Apropiación",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_apropiacion.save()
    comp_centralizacion= ItemClassification(name="Centralización",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_centralizacion.save()
    comp_considIndividualizada= ItemClassification(name="Consideración individualizada",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_considIndividualizada.save()
    comp_diferenFuncional= ItemClassification(name="Diferenciación funcional",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_diferenFuncional.save()
    comp_diferenVertical= ItemClassification(name="Diferenciación vertical",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_diferenVertical.save()
    comp_especializacion= ItemClassification(name="Especialización",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_especializacion.save()
    comp_estimuIntelec= ItemClassification(name="Estimulación intelectual",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_estimuIntelec.save()
    comp_formalizacion= ItemClassification(name="Formalización",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_formalizacion.save()
    comp_formulacion= ItemClassification(name="Formulación",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_formulacion.save()
    comp_influeIdealizada= ItemClassification(name="Influencia idealizada",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_influeIdealizada.save()
    comp_metricas= ItemClassification(name="Métricas",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_metricas.save()
    comp_motivacion= ItemClassification(name="Motivación inspiradora",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_motivacion.save()
    comp_profesionalismo= ItemClassification(name="Profesionalismo",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_profesionalismo.save()
    comp_retribucion= ItemClassification(name="Retribución",type=ClassificationChoice.COMPONENT.value,i18n_code=LanguageChoice.ES.name)
    comp_retribucion.save()

    # Parametric master
    likert_one_to_nine_master =Parametric_master(name="1-to-9 Likert",description="Escala likert del 1 al 9")
    likert_one_to_nine_master.save()

    likert_one_to_nine_1=Trans_parametric_table(parametric_master=likert_one_to_nine_master,option_label="Complementamente en desacuerdo",numeric_value=1, i18n_code=LanguageChoice.ES.name )
    likert_one_to_nine_2=Trans_parametric_table(parametric_master=likert_one_to_nine_master,option_label="",numeric_value=2, i18n_code=LanguageChoice.ES.name )
    likert_one_to_nine_3=Trans_parametric_table(parametric_master=likert_one_to_nine_master,option_label="",numeric_value=3, i18n_code=LanguageChoice.ES.name )
    likert_one_to_nine_4=Trans_parametric_table(parametric_master=likert_one_to_nine_master,option_label="",numeric_value=4, i18n_code=LanguageChoice.ES.name )
    likert_one_to_nine_5=Trans_parametric_table(parametric_master=likert_one_to_nine_master,option_label="",numeric_value=5, i18n_code=LanguageChoice.ES.name )
    likert_one_to_nine_6=Trans_parametric_table(parametric_master=likert_one_to_nine_master,option_label="",numeric_value=6, i18n_code=LanguageChoice.ES.name )
    likert_one_to_nine_7=Trans_parametric_table(parametric_master=likert_one_to_nine_master,option_label="",numeric_value=7, i18n_code=LanguageChoice.ES.name )
    likert_one_to_nine_8=Trans_parametric_table(parametric_master=likert_one_to_nine_master,option_label="",numeric_value=8, i18n_code=LanguageChoice.ES.name )
    likert_one_to_nine_9=Trans_parametric_table(parametric_master=likert_one_to_nine_master,option_label="Complementamente en deacuerdo",numeric_value=9, i18n_code=LanguageChoice.ES.name )

    #Save parametrics
    likert_one_to_nine_1.save()
    likert_one_to_nine_2.save()
    likert_one_to_nine_3.save()
    likert_one_to_nine_4.save()
    likert_one_to_nine_5.save()
    likert_one_to_nine_6.save()
    likert_one_to_nine_7.save()
    likert_one_to_nine_8.save()
    likert_one_to_nine_9.save()

    ######################### Response format
    one_to_nine_response= Response_format(parametric_table=likert_one_to_nine_master, name="1-to-9 Likert", type=ResponseFormatType.LIKERT_NINE)
    one_to_nine_response.save()

    # Items
    response_format_items_variable=one_to_nine_response

    # Capacidad organizativa subitems
    categoria=cat_capacOrganiza

    itemCapOrg1=Item(item_order=1, dimension=dim_ambidestreza,category=categoria, response_format=response_format_items_variable)
    itemCapOrg2=Item(item_order=2, dimension=dim_relacionam,category=categoria, response_format=response_format_items_variable)
    itemCapOrg3=Item(item_order=3, dimension=dim_orientClie,category=categoria, response_format=response_format_items_variable)
    itemCapOrg4=Item(item_order=4, dimension=dim_veloc,category=categoria, response_format=response_format_items_variable)
    itemCapOrg5=Item(item_order=5, dimension=dim_adaptabilidad,category=categoria, response_format=response_format_items_variable)
    itemCapOrg6=Item(item_order=6, dimension=dim_ejecucion,category=categoria, response_format=response_format_items_variable)
    itemCapOrg7=Item(item_order=7, dimension=dim_orientEmpre,category=categoria, response_format=response_format_items_variable)

    itemCapOrg1.save()
    itemCapOrg2.save()
    itemCapOrg3.save()
    itemCapOrg4.save()
    itemCapOrg5.save()
    itemCapOrg6.save()
    itemCapOrg7.save()

    transItemCapOrg1 = Trans_item(item=itemCapOrg1,
                           name="La compañía equilibra los esfuerzos en mantener y aprovechar sus habilidades, recursos y productos actuales con los esfuerzos en el desarrollo de nuevos conocimientos, habilidades y productos",
                           i18n_code=LanguageChoice.ES.name)
    transItemCapOrg2 = Trans_item(item=itemCapOrg2,
                          name="La compañía se caracteriza por establecer relaciones efectivas entre sus miembros y entre estos y el medio externo",
                          i18n_code=LanguageChoice.ES.name)
    transItemCapOrg3 = Trans_item(item=itemCapOrg3,
                       name="En términos generales, todos los colaboradores de la compañía trabajan en función el mercado y sus diferentes actores: clientes, competidores, proveedores, etc",
                       i18n_code=LanguageChoice.ES.name)
    transItemCapOrg4 = Trans_item(item=itemCapOrg4,
                       name="La compañía tiene la capacidad de desarrollar y lanzar nuevos productos más rápido que sus competidores",
                       i18n_code=LanguageChoice.ES.name)
    transItemCapOrg5 = Trans_item(item=itemCapOrg5,
                       name="La compañía aprende y se adapta de forma ágil a los entornos cambiantes siendo capaz de anticiparse a dichos cambios",
                       i18n_code=LanguageChoice.ES.name)
    transItemCapOrg6 = Trans_item(item=itemCapOrg6,
                       name="La compañía tiene la capacidad de pasar de una fase de iniciación, en la que se generan las ideas, a una fase de realización o implementación de las ideas",
                       i18n_code=LanguageChoice.ES.name)
    transItemCapOrg7 = Trans_item(item=itemCapOrg7,
                           name="En su cotidianidad la compañía integra la orientación a la innovación, la proactividad y la toma de riesgos",
                           i18n_code=LanguageChoice.ES.name)

    transItemCapOrg1.save()
    transItemCapOrg2.save()
    transItemCapOrg3.save()
    transItemCapOrg4.save()
    transItemCapOrg5.save()
    transItemCapOrg6.save()
    transItemCapOrg7.save()


    # Continuar con los siguientes items aqui


class Migration(migrations.Migration):

    dependencies = [
        ('encuestador', '0001_initial'),
    ]

    operations = [

        #Excecute the methods that will insert the data in the database
        migrations.RunPython(insert_data),
    ]


