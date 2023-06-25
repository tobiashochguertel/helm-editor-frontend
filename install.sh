#!/bin/bash

mkdir -p ~/bin
if [ -f "$HOME/bin/edit-chart" ]; then
  rm "$HOME/bin/edit-chart"
fi

if [ -f "$HOME/bin/edit-chart.docker-compose.yml" ]; then
  rm "$HOME/bin/edit-chart.docker-compose.yml"
fi

curl -sSLf https://raw.githubusercontent.com/tobiashochguertel/helm-editor-frontend/main/edit-chart > "$HOME/bin/edit-chart" && chmod +x "$HOME/bin/edit-chart"
curl -sSLf https://raw.githubusercontent.com/tobiashochguertel/helm-editor-frontend/main/docker-compose.yml > "$HOME/bin/edit-chart.docker-compose.yml"

# Dasel
if [[ $OSTYPE == 'darwin'* ]]; then
  curl -sSLf "$(curl -sSLf https://api.github.com/repos/tomwright/dasel/releases/latest | grep browser_download_url | grep -v .gz | grep darwin_amd64 | cut -d\" -f 4)" -L -o dasel && chmod +x dasel
  mv ./dasel "$HOME/bin/edit-chart.dasel"
fi
if [[ $OSTYPE == 'linux-gnu'* ]]; then
  curl -sSLf "$(curl -sSLf https://api.github.com/repos/tomwright/dasel/releases/latest | grep browser_download_url | grep linux_amd64 | grep -v .gz | cut -d\" -f 4)" -L -o dasel && chmod +x dasel
  mv ./dasel "$HOME/bin/edit-chart.dasel"
fi

echo "Add the following line to your .bashrc or .bash_profile or .zshrc, ..."
echo ""
echo 'export PATH=$PATH:$HOME/bin'
echo ""
echo "and restart your shell."

echo "Usage example:"
echo ""
echo "cd path-to-my-chart && edit-chart && open http://localhost:4173"
echo ""