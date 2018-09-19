from Apps.encuestador.models import ItemClassification
from Apps.encuestador.models import Item
from rest_framework import serializers

class ItemSerializer(serializers.HyperlinkedModelSerializer):
    translations=serializers.StringRelatedField(many=True)
    #translations = Trans_item.objects.filter(item=self)
    dimension=serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    category = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    response_format = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    component=serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = Item
        #fields = ('name', 'description','i18n_code','translations')
        fields = ('id','response_format','item_order', 'dimension','category','component','translations')


# Serializar los items x categoria
class ItemClassificationSerializer(serializers.HyperlinkedModelSerializer):
    #itemsBycategory = serializers.StringRelatedField(many=True)
    # Se serializan los datos aprovechando las relaciones entre los atributos de llavesprimarias y foraneas
    itemsByCategory = ItemSerializer(many=True,read_only=True)
    itemsByDimension = ItemSerializer(many=True,read_only=True)
    itemsByComponent = ItemSerializer(many=True,read_only=True)


    class Meta:
        model = ItemClassification
        # fields = ('name', 'description','i18n_code','translations')
        fields = ('id','name', 'itemsByCategory','itemsByDimension','itemsByComponent')
