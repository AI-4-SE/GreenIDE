from django.urls import path

from . import views

urlpatterns = [
    path('kanzi/default/', views.KanziDefaultConfigView.as_view(), name='config'),
    path('kanzi/one/', views.KanziConfigView.as_view(), name='config'),
    path('kanzi/many/', views.KanziMultipleConfigView.as_view(), name='configs'),
    path('kanzi/all/', views.KanziAllConfigView.as_view(), name='configs'),
    path('density/default/', views.DensityDefaultConfigView.as_view(), name='config'),
    path('density/one/', views.DensityConfigView.as_view(), name='config'),
    path('density/many/', views.DensityMultipleConfigView.as_view(), name='configs'),
    path('density/all/', views.DensityAllConfigView.as_view(), name='configs'),
]