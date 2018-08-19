from django.db import models
from django.utils import timezone


class Parametric_master (models.Model):
    name = models.CharField(max_length = 50)
    description = models.TextField()
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(auto_now=True)


class Trans_parametric_table(models.Model):
    id_parametric_master = models.ForeignKey(Parametric_master, on_delete=models.CASCADE)
    option_label = models.CharField(max_length=50)
    option_group = models.CharField(max_length=50)
    i18n_code = models.CharField(max_length=2)
    numeric_value = models.IntegerField()
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(auto_now=True)


class Response_format (models.Model):
    id_parametric_table = models.ForeignKey(Parametric_master, on_delete=models.CASCADE)
    name = models.CharField(max_length = 50)
    type = models.CharField (max_length = 50)


class item_hierarchy(models.Model):
    ancestor = models.IntegerField()
    descendant = models.IntegerField()
    length = models.IntegerField()


class Item (models.Model):
    id_response_format = models.ForeignKey(Response_format, on_delete=models.CASCADE)
    hierarchicalLevel = models.IntegerField()
    item_order = models.IntegerField()


class Trans_item(models.Model):
    id_item = models.ForeignKey(Item, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField()
    i18n_code = models.CharField(max_length=2)


class Instrument_header(models.Model):
    version_name = models.CharField(max_length=50)
    is_active = models.BooleanField()
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(auto_now=True)


class Trans_instrument_header(models.Model):
    id_instrument_header = models.ForeignKey(Instrument_header, on_delete=models.CASCADE)
    general_description = models.TextField()
    feature_description = models.TextField()
    disclaimer = models.TextField()
    user_instructions = models.TextField()
    i18n_code = models.CharField(max_length=2)


class Instrument_structure_history(models.Model):
    id_instrument_header = models.ForeignKey(Instrument_header, on_delete=models.CASCADE)
    id_orignal_item = models.ForeignKey(Item, on_delete=models.CASCADE)
    item_minor_version = models.CharField(max_length=20)
    id_new_item = models.IntegerField()
    id_previous_item = models.IntegerField()
    change_reason = models.TextField()
    is_active = models.BooleanField()
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(auto_now=True)

class Company(models.Model):
    company_contact_name = models.CharField(max_length=50)
    company_email = models.EmailField()

class Client(models.Model):
    id_company = models.ForeignKey(Company, on_delete=models.CASCADE)
    max_surveys = models.IntegerField()
    client_logo = models.CharField(max_length=100)
    contact = models.CharField(max_length=50)
    has_iso = models.BooleanField()

class Customized_instrument(models.Model):
    id_company = models.ForeignKey(Company, on_delete=models.CASCADE)
    id_client = models.ForeignKey(Client, on_delete=models.CASCADE)
    num_completed_responses = models.IntegerField()
    num_partial_responses = models.IntegerField()
    ##framework_version = models.FloatField()
    resulting_URL = models.URLField()
    total_of_instrument = models.IntegerField()
    JSON_instrument_file = models.BinaryField()
    Customized_description = models.TextField()

class Participant_response_header(models.Model):
    id_customized_instrument = models.ForeignKey(Customized_instrument, on_delete=models.CASCADE)
    participant_name = models.CharField(max_length=50)
    email = models.EmailField()
    last_update = models.DateTimeField()
    is_complete = models.BooleanField()
    ##framework_version = models.FloatField()
    comments = models.TextField()
    is_admin_response = models.BooleanField()
    acces_code = models.CharField(max_length=50)

class Items_respon_by_participants(models.Model):
    id_participant_response_header = models.ForeignKey(Participant_response_header, on_delete=models.CASCADE)
    id_item = models.ForeignKey(Item, on_delete=models.CASCADE)
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
    id_company = models.ForeignKey(Company, on_delete=models.CASCADE)
    id_user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)
