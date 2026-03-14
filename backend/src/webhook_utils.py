import requests
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def trigger_n8n_workflow(event_name, payload):
    """
    Send an event to n8n webhook.
    Configure N8N_WEBHOOK_BASE_URL in settings, e.g. https://n8n.example.com/webhook/
    """
    webhook_url = f"{settings.N8N_WEBHOOK_BASE_URL}{event_name}"
    try:
        response = requests.post(webhook_url, json=payload, timeout=5)
        response.raise_for_status()
    except Exception as e:
        logger.error(f"Failed to trigger n8n workflow {event_name}: {e}")