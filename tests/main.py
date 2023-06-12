from Automator import Automator
from config import ENTRY_URL

meetup_bot = Automator(entry_url=ENTRY_URL)

meetup_bot.login_as_demo()
for _ in range(10):
    meetup_bot.make_a_group()
    meetup_bot.create_venue_for_group()

    for _ in range(5):
        meetup_bot.make_an_event()


meetup_bot.quit(delay=50)
