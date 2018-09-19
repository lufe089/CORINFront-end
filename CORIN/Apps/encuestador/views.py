from django.shortcuts import render

from Apps.encuestador.models import Item
from Apps.encuestador.models import ClassificationChoice
from Apps.encuestador.models import ItemClassification
from rest_framework import viewsets
from Apps.encuestador.serializers import ItemSerializer
from Apps.encuestador.serializers import ItemClassificationSerializer

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.decorators import action



# Create your views here.

"""Endpoint that allows the database objects to be viewed or edited."""

class ItemsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = ItemSerializer
    queryset = Item.objects.all()

    """
    @action(methods=['post'], detail=True)
    def items_by_category(self, request):
        user = self.get_object()
        serializer = PasswordSerializer(data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.data['password'])
            user.save()
            return Response({'status': 'password set'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
    """

""" Retorna el Json con los items y sus traducciones agrupados por categoria, el mismo serializar
se usa para agrupar por dimension y por componente"""
class CategoriesViewSet(viewsets.ModelViewSet):
    serializer_class = ItemClassificationSerializer
    queryset = ItemClassification.objects.filter(type=ClassificationChoice.CATEGORY.value)


class DimensionsViewSet(viewsets.ModelViewSet):
    serializer_class = ItemClassificationSerializer
    queryset = ItemClassification.objects.filter(type=ClassificationChoice.DIMENSION.value)

class ComponentsViewSet(viewsets.ModelViewSet):
    serializer_class = ItemClassificationSerializer
    queryset = ItemClassification.objects.filter(type=ClassificationChoice.COMPONENT.value)
