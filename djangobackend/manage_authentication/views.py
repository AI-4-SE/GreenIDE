import json
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status



@api_view(['POST'])
def logout(request):
    user = request.user
    user.auth_token.delete()
    return Response(
        status=status.HTTP_200_OK,
        data={"details": "logout successful."})


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login(request):
    username = request.data["username"]
    password = request.data["password"]
    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data={"details": "User does not exist or credentials are invalid."}
        )
    try:
        token = Token.objects.get(user=user)
    except Token.DoesNotExist:
        token = Token.objects.create(user=user)
    return Response(status=status.HTTP_200_OK, data={"token": token.key})
