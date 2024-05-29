from django import forms
from app.models import *


class ItemForm(forms.ModelForm):
    class Meta:
        model = Items
        fields = ['Descriptions', 'Price', 'Weight', 'Size',]
