from django.forms import ModelForm
from website.models import Moment

class MomentForm(ModelForm):
    class Meta:
        model = Moment
        fields = '__all__'