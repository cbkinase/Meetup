test_deps_directory_directory="tests/.venv"

# Check if testing deps exists: install if not

if [ ! -d "$test_deps_directory" ]; then
    cd tests
    echo "Installing dependencies. This may take a few minutes."
    pipenv install -r requirements.txt
    cd ..
else
    echo "Here we go again..."
fi

cd tests
pipenv run pytest meetup_tests.py
