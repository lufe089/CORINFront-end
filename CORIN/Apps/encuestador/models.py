from django.db import models
from django.utils import timezone
from enum import Enum

##########################  ENUMS ##########################

class ClassificationChoice(Enum): # A subclass of Enum
    COMPONENT = 1
    DIMENSION = 2
    CATEGORY = 3

class LanguageChoice(Enum): # A subclass of Enum
    ES = "ESP"
    EN = "ENG"

class ResponseFormatType(Enum): # A subclass of Enum
    BOOL = "Yes/No"
    LIKERT_NINE = "Likert 9 points"
    LIKERT_SIX = "Likert 6 points"



#######################  CLASES ################################

class Parametric_master (models.Model):
    name = models.CharField(max_length = 50)
    description = models.TextField()
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(default=None, null=True, blank=True)
    #option_group_id = models.IntegerField()

    def __str__(self):  # __unicode__ on Python 2
        return self.name


class Trans_parametric_table(models.Model):
    parametric_master = models.ForeignKey(Parametric_master, on_delete=models.CASCADE)
    option_label = models.CharField(max_length=50)
    i18n_code = models.CharField(max_length=2)
    numeric_value = models.IntegerField()
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(default=None, null=True, blank=True)

    def __str__(self):  # __unicode__ on Python 2
        return self.option_label


class Response_format (models.Model):
    parametric_table = models.ForeignKey(Parametric_master, on_delete=models.CASCADE)
    name = models.CharField(max_length = 50)
    type = models.CharField ( choices=[(tag, tag.value) for tag in ResponseFormatType],max_length = 15 ) # Choices is a list of Tuple)


    def __str__(self):  # __unicode__ on Python 2
        return self.name


#class item_hierarchy(models.Model):
    #ancestor = models.IntegerField()
    #descendant = models.IntegerField()
    #length = models.IntegerField()
    #length = models.IntegerField()



class ItemClassification(models.Model):
    name = models.CharField(max_length=50)
    type = models.IntegerField(
        choices=[(tag, tag.value) for tag in ClassificationChoice]  # Choices is a list of Tuple
    )
    i18n_code = models.CharField(max_length=40)

    def __str__(self):  # __unicode__ on Python 2
        return self.name + " -- type" + str(self.type)


class Item (models.Model):
    response_format = models.ForeignKey(Response_format, on_delete=models.CASCADE)
    item_order = models.IntegerField()
    dimension = models.ForeignKey(ItemClassification, related_name="itemsByDimension", on_delete=models.CASCADE,default=None)
    category = models.ForeignKey(ItemClassification,related_name="itemsByCategory", on_delete=models.CASCADE,default=None)
    #component1 = models.ForeignKey(ItemClassification,related_name="item_component1", on_delete=models.CASCADE,default=None)
    component = models.ForeignKey(ItemClassification,related_name="itemsByComponent", on_delete=models.CASCADE,default=None,null=True,blank=True)
    #component = models.IntegerField(default=None)

class Trans_item(models.Model):
    item = models.ForeignKey(Item, related_name='translations',on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField(default=None,null=True,blank=True)
    i18n_code = models.CharField(max_length=40)

    def __str__(self):  # __unicode__ on Python 2
        return self.name


class Instrument_header(models.Model):
    version_name = models.CharField(max_length=50)
    is_active = models.BooleanField()
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(default=None, null=True, blank=True)


class Trans_instrument_header(models.Model):
    instrument_header = models.ForeignKey(Instrument_header, on_delete=models.CASCADE)
    general_description = models.TextField()
    feature_description = models.TextField()
    disclaimer = models.TextField()
    user_instructions = models.TextField()
    i18n_code = models.CharField(max_length=2)


class Instrument_structure_history(models.Model):
    instrument_header = models.ForeignKey(Instrument_header, on_delete=models.CASCADE)
    original_item = models.ForeignKey(Item,related_name="item_originalItem", on_delete=models.CASCADE,default=None)
    item_minor_version = models.CharField(max_length=20)
    new_item = models.ForeignKey(Item, related_name="item_newItem", on_delete=models.CASCADE, default=None)
    previous_item = models.ForeignKey(Item, related_name="item_previousItem", on_delete=models.CASCADE, default=None)
    change_reason = models.TextField()
    is_active = models.BooleanField()
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(default=None, null=True, blank=True)

class Company(models.Model):
    company_contact_name = models.CharField(max_length=50)
    company_email = models.EmailField()

class Client(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    max_surveys = models.IntegerField()
    client_logo = models.CharField(max_length=100)
    contact = models.CharField(max_length=50)
    has_iso = models.BooleanField()

class Customized_instrument(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    num_completed_responses = models.IntegerField()
    num_partial_responses = models.IntegerField()
    ##framework_version = models.FloatField()
    resulting_URL = models.URLField()
    total_of_instrument = models.IntegerField()
    JSON_instrument_file = models.BinaryField()
    Customized_description = models.TextField()

class Participant_response_header(models.Model):
    customized_instrument = models.ForeignKey(Customized_instrument, on_delete=models.CASCADE)
    participant_name = models.CharField(max_length=50)
    email = models.EmailField()
    last_update = models.DateTimeField()
    is_complete = models.BooleanField()
    ##framework_version = models.FloatField()
    comments = models.TextField()
    is_admin_response = models.BooleanField()
    acces_code = models.CharField(max_length=50)

class Items_respon_by_participants(models.Model):
    participant_response_header = models.ForeignKey(Participant_response_header, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    answer_numeric = models.IntegerField()
    answer_text = models.TextField()

class User (models.Model):
    username = models.CharField(max_length=50)
    password_hashed = models.CharField(max_length=30)
    organization = models.CharField(max_length=50)
    organization_department = models.CharField(max_length=50)
    email = models.EmailField()
    website = models.URLField()
    last_login = models.DateTimeField()
    active_account = models.BooleanField()
    registration_date = models.DateTimeField()
    prefered_language = models.CharField(max_length=30)

class Roles_by_user(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)
