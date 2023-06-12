import time
import requests
from datetime import datetime, timedelta
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from faker import Faker


class Automator:
    def __init__(self, entry_url):
        self.entry_url = entry_url
        self.driver = webdriver.Chrome(ChromeDriverManager().install())
        self.driver.implicitly_wait(10)
        self.fake = Faker()
        self.created_group_id = None
        self.created_event_id = None
        self.created_venue_id = None

    def get_group_or_event_id(self):
        return self.driver.current_url.split("/")[-1]

    def prep_login(self):
        self.driver.get(self.entry_url)

        # Open profile dropdown
        self.driver.find_element(By.CLASS_NAME, "main-dropdown-button").click()
        time.sleep(0.4)

        # Click login button
        self.driver.find_element(By.ID, "login-button").click()
        time.sleep(0.2)

    def login_as_demo(self):
        self.prep_login()

        # Click demo user button
        self.driver.find_element(By.CLASS_NAME, "login-alt-color").click()

    def invalid_login(self):
        self.prep_login()
        self.driver.find_element(By.ID, "credential").send_keys("asdasdasd123123")
        self.driver.find_element(By.ID, "password").send_keys("123sdasdasd")
        self.driver.find_element(By.ID, "login-submit").submit()

    def make_a_group(self, private=False, online=False):
        self.driver.get(f"{self.entry_url}/groups/new")

        # Set location
        location = f"{self.fake.city()}, {self.fake.country_code()}"
        self.driver.find_element(By.ID, "group-location-input").send_keys(location)

        # Set name
        name = f"{self.fake.catch_phrase()}"
        self.driver.find_element(By.ID, "group-name-input").send_keys(name)

        # Set description
        description = f"{self.fake.sentence(nb_words=15)}"
        self.driver.find_element(By.ID, "create-group-about").send_keys(description)

        # Set group type
        group_type = "online" if online else "in-person"
        self.driver.find_element(By.ID, f"{group_type}-group-select").click()

        # Set group privacy
        privacy = "private" if private else "public"
        self.driver.find_element(By.ID, f"{privacy}-group-select").click()

        # Get and set a group image
        dog_image = requests.get("https://dog.ceo/api/breeds/image/random").json()["message"]
        self.driver.find_element(By.ID, "group-picture-input").send_keys(dog_image)

        # Submit
        self.driver.find_element(By.ID, "submit").submit()

        # On successful creation, this button will exist
        self.driver.find_element(By.ID, "create-event-group-page")

        # Set our instance variable
        self.created_group_id = self.get_group_or_event_id()

    def make_an_event(self, group_id=None, online=False):
        # Allows us to control which group we are doing this for: defaults to the previously created group otherwise.
        if group_id is None:
            group_id = self.created_group_id

        self.driver.get(f"{self.entry_url}/groups/{group_id}")
        self.driver.find_element(By.ID, "create-event-group-page").click()

        # Set name
        name = f"{self.fake.catch_phrase()}"
        self.driver.find_element(By.ID, "event-name-input").send_keys(name)

        # Set event type
        event_type = "online" if online else "in-person"
        self.driver.find_element(By.ID, f"{event_type}-event-select").click()

        # TODO: Set venue

        # Set price
        event_price_input = self.driver.find_element(By.ID, "event-price-input")
        event_price_input.clear()
        event_price_input.send_keys("10")

        # Set start/end dates
        current_date = datetime.now()
        two_days = timedelta(days=2)
        start_date = current_date + two_days
        end_date = start_date + two_days
        formatted_start = start_date.strftime("%m-%d-%Y")
        formatted_end = end_date.strftime("%m-%d-%Y")
        start_input = self.driver.find_element(By.ID, "event-start-input")
        end_input = self.driver.find_element(By.ID, "event-end-input")
        start_input.send_keys(formatted_start)
        start_input.send_keys(Keys.TAB)
        start_input.send_keys("420P")
        end_input.send_keys(formatted_end)
        end_input.send_keys(Keys.TAB)
        end_input.send_keys("420P")

        # Get and set an event image
        dog_image = requests.get("https://dog.ceo/api/breeds/image/random").json()["message"]
        self.driver.find_element(By.ID, "event-picture-input").send_keys(dog_image)

        # Set event description
        description = f"{self.fake.sentence(nb_words=15)}"
        self.driver.find_element(By.ID, "create-event-about").send_keys(description)

        # Submit
        self.driver.find_element(By.ID, "submit").submit()

        # Button will exist on successful creation
        self.driver.find_element(By.ID, "edit-event-button")

        # Set our instance variable
        self.created_event_id = self.get_group_or_event_id()

    def create_venue_for_group(self, group_id=None):
        # Allows us to control which group we are doing this for: defaults to the previously created group otherwise.
        if group_id is None:
            group_id = self.created_group_id

        self.driver.get(f"{self.entry_url}/groups/{group_id}")
        self.driver.find_element(By.ID, "manage-venue-button").click()

        street_address = self.fake.street_address()
        self.driver.find_element(By.ID, "venue-address").send_keys(street_address)

        city = self.fake.city()
        self.driver.find_element(By.ID, "venue-city").send_keys(city)

        state = self.fake.country_code()
        self.driver.find_element(By.ID, "venue-state").send_keys(state)

        self.driver.find_element(By.ID, "submit-venue-button").submit()

        all_venues = self.driver.find_element(By.CLASS_NAME, "venue-list")
        latest_venue = all_venues.find_elements(By.CSS_SELECTOR, "li")[0]
        self.created_venue_id = latest_venue.get_attribute("id").split("-")[1]

    def quit(self, delay=None):
        if delay is None:
            delay = 0
        time.sleep(delay)
        self.driver.quit()
