import zoneinfo
import django
import os

os.environ["DJANGO_SETTINGS_MODULE"] = "apiserver.settings"
django.setup()

from datetime import datetime

from apiserver.api import models

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
