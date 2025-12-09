import zoneinfo
import django, sys, os

os.environ["DJANGO_SETTINGS_MODULE"] = "apiserver.settings"
django.setup()

from datetime import datetime
import json
import zoneinfo

from apiserver.api import models, utils

tz = zoneinfo.ZoneInfo("America/Edmonton")

cards = models.Card.objects.order_by("last_seen_at")

for card in cards:
    seen = card.last_seen_at
    if seen:
        t = datetime.combine(seen, datetime.min.time())
        card.last_seen = t.replace(tzinfo=tz)
        card.save()

        print("card", card.card_number, "date", seen, "-->", card.last_seen)

print("Done.")
