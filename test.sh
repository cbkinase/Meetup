test_deps_directory=".venv"

cd tests

# Check if testing deps exists: install if not

if [ ! -d "$test_deps_directory" ]; then
    pipenv install -r requirements.txt
else
    echo "Here we go again..."
fi

pipenv run pytest meetup_tests.py
