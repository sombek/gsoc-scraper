#!/bin/bash

# to fix the permission issue
# WARNING: The directory '/home/vscode/.cache/pip' or its parent directory is not owned or is not writable by the current user. The cache has been disabled. Check the permissions and owner of that directory. If executing pip with sudo, you should use sudo's -H flag.
sudo chown -R vscode /home/vscode
sudo chown -R vscode /workspace

# pip install -r requirements/development.txt

# playwright
pip install playwright
sudo playwright install-deps
playwright install