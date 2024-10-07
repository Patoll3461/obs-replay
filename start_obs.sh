#!/bin/bash

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$script_dir/settings.conf"

flatpak run com.obsproject.Studio &
sleep 5
node $user/start_replay.js