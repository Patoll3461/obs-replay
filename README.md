
# OBS Replay Notifications

This utility allows OBS Replay Buffer to work with a global hotkey and also enables interactable notifications.


## Features

- Automatic start of Replay Buffer upon opening OBS
- Press preferred hotkey to Clip
- Get Notification if clip was succesfull or not
- Buttons on notification to open clip directory/play clip/delete clip


## Installation

1. Prerequesites:

You will need the following packages:
- git
- nodejs
- dunst
- flatpak
- a compatible notification daemon (e.g. dunst, mako or GNOME's built in daemon)
- The OBS flatpak version
- The OBS WebSocket Node Library
- A video player of your choice
- A file manager of your choice

```bash
    #Install needed packages (arch-based distributions)
    sudo pacman -S git nodejs dunst flatpak
    flatpak install com.obsproject.Studio
    npm install obs-websocket-js
```



2. Clone the git repository

```bash
    cd ~
    git clone https://github.com/Patoll3461/obs-replay.git
```



3. OBS settings

Open the OBS Flatpak installation from your application launcher or via the terminal.

```bash
    flatpak run com.obsproject.Studio
```
Go to File > Settings > Output

Set Output Mode to "Advanced"

Go into the tab "Recording" and set a path for the video output.

Recording Format MUST be set to "Matroska Video (.mkv)", otherwise it wont work (Might add an option in setting.conf to configure other formats).

Set your preferred Codec Settings.

Go to the tab "Replay Buffer" and tick "Enable Replay Buffer", you can also set your preferred length.

Click "Apply" and "OK".

Go to Tools > Websocket Server Settings and tick "Enable WebSocket Server", also set a Port and Password.

Click "Apply" and "OK".



4. Edit setting.conf

```bash
    cd obs-replay
    nano settings.conf
```
Here you can set the values needed.



5. Add Hotkeys

In the settings of your Desktop Environment add a Hotkey for saving the Replay, with the command to execute being 

```bash
    node /path/to/your/installation/save_replay.js
```

(Optional) Add a Hotkey for opening OBS, with the command to execute being

```bash
    sh /path/to/your/installation/start_obs.sh
```
This will open OBS and start the Replay Buffer. If you do not use this you will need to start the Replay Buffer manually each time you open OBS.

Example in Hyprland:

```bash
    $clip = sh /home/YOUR_USER/obs-replay/start_obs.sh
    bind = $mainMod, O, exec, $clip
    bind = , F8, exec, node /home/YOUR_USER/obs-replay/save_replay.js
```

You can now start OBS over the set Hotkey!

You can now press the Hotkey set for saving the Replay Buffer to save the Replay Buffer!

