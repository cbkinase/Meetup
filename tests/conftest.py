import pytest


def pytest_addoption(parser):
    parser.addoption("--url", action="store")


@pytest.fixture(scope='class')
def url(request):
    return request.config.getoption("--url")
