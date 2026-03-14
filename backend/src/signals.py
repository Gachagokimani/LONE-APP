from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import LoanApplication, LoanEvent
from .webhook_utils import trigger_n8n_workflow

@receiver(post_save, sender=LoanApplication)
def loan_saved_handler(sender, instance, created, **kwargs):
    if created:
        trigger_n8n_workflow('loan_created', {'loan_id': str(instance.id)})
    else:
        # You might want to detect status changes separately
        pass