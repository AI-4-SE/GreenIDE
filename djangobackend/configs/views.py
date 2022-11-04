from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from manage_authentication.authentication import BearerAuthentication

from rest_framework.views import APIView
from .csvReader import createDict, responseLogicOne, responseLogicMany, responseLogicAll



class KanziDefaultConfigView(APIView):

    permission_classes = (IsAuthenticated,) 
    authentication_classes = (BearerAuthentication, TokenAuthentication, )

    def get(self, request):
        config = {
            'method-name': request.GET.get('method-name'),
            'root': 1
        }
        return responseLogicOne(config, 'kanzi')


class KanziConfigView(APIView):

    permission_classes = (IsAuthenticated,) 
    authentication_classes = (BearerAuthentication, TokenAuthentication, )

    def get(self, request):
        config = createDict(request.GET, 'kanzi')
        return responseLogicOne(config, 'kanzi')
    

class KanziMultipleConfigView(APIView):

    permission_classes = (IsAuthenticated,) 
    authentication_classes = (BearerAuthentication, TokenAuthentication, )

    def get(self, request):
        config = createDict(request.GET, 'kanzi')
        return responseLogicMany(config, 'kanzi')


class KanziAllConfigView(APIView):

    permission_classes = (IsAuthenticated,) 
    authentication_classes = (BearerAuthentication, TokenAuthentication, )

    def get(self, request):
        config = createDict(request.GET, 'kanzi')
        return responseLogicAll(config, 'kanzi')


class DensityDefaultConfigView(APIView):

    permission_classes = (IsAuthenticated,) 
    authentication_classes = (BearerAuthentication, TokenAuthentication, )

    def get(self, request):
        config = {
            'method-name': request.GET.get('method-name'),
            'root': 1
        }
        return responseLogicOne(config, 'density')


class DensityConfigView(APIView):

    permission_classes = (IsAuthenticated,) 
    authentication_classes = (BearerAuthentication, TokenAuthentication, )

    def get(self, request):
        config = createDict(request.GET, 'density')
        return responseLogicOne(config, 'density')

    
class DensityMultipleConfigView(APIView):

    permission_classes = (IsAuthenticated,) 
    authentication_classes = (BearerAuthentication, TokenAuthentication, )

    def get(self, request):
        config = createDict(request.GET, 'density')
        return responseLogicMany(config, 'density')


class DensityAllConfigView(APIView):

    permission_classes = (IsAuthenticated,) 
    authentication_classes = (BearerAuthentication, TokenAuthentication, )

    def get(self, request):
        config = createDict(request.GET, 'density')
        return responseLogicAll(config, 'density')