import pytest
from selenium.webdriver.common.by import By
from Automator import Automator
from config import ENTRY_URL


@pytest.fixture(scope="class")
def automator():
    # Set up the driver before running the tests
    automator = Automator(entry_url=ENTRY_URL)
    yield automator
    # Close the driver after running the tests
    automator.quit()


class TestExample:
    def test_invalid_login(self, automator):
        automator.invalid_login()
        errors = automator.driver.find_elements(By.CLASS_NAME, "errors")
        assert len(errors) > 0
        assert errors[0].text == "The provided credentials were invalid."

    def test_demo_login(self, automator):
        """Testing logging in as a demo user"""
        automator.login_as_demo()
        create_group_button = automator.driver.find_element(By.CLASS_NAME, "start-new-group-nav")
        assert create_group_button is not None

    def test_create_group(self, automator):
        """Test creation of a group"""
        automator.make_a_group(private=False, online=False)
        create_event_button = automator.driver.find_element(By.ID, "create-event-group-page")
        assert create_event_button is not None

    def test_create_event(self, automator):
        """Test creation of an event"""
        automator.make_an_event(online=False)
        edit_event_button = automator.driver.find_element(By.ID, "edit-event-button")
        assert edit_event_button is not None

    def test_create_venue(self, automator):
        """Test creation of a venue"""
        automator.create_venue_for_group()
        venue_container = automator.driver.find_element(By.CLASS_NAME, "venue-list")
        all_venues = venue_container.find_elements(By.CSS_SELECTOR, "li")
        assert len(all_venues) > 0
