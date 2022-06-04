# BeamMP admin
Web interface for [BeamMP server](https://github.com/BeamMP/BeamMP-Server)

[![.github/workflows/main.yml](https://github.com/levg34/beammp-admin/actions/workflows/main.yml/badge.svg)](https://github.com/levg34/beammp-admin/actions/workflows/main.yml)

Now complete with log rotate, saving users from rotated logs to database, uploading and deleting mods, config switching and much more!
Feature flipping comming soon.

![Screenshot](doc/beammp%20admin%20screenshot.PNG "Screenshot")

![Screenshot](doc/beammp%20admin%20screenshot%203.PNG "Screenshot")

![Screenshot](doc/beammp%20admin%20screenshot%202.PNG "Screenshot")

![Screenshot](doc/beammp%20admin%20screenshot%204.PNG "Screenshot")

![Screenshot](doc/beammp%20admin%20screenshot%205.PNG "Screenshot")

## Installation

### Requirements

You need one or two linux server / VPS / Raspberrypi (Debian 10+, Ubuntu 18+, Raspbian)

- One server to run [BeamMP-Server](https://github.com/BeamMP/BeamMP-Server/releases)

- One server to run this admin app (can be the same server, with another user)

You can also deploy this admin app on Vercel.

You need nodejs version 12 or greater.

### Install BeamMP server on a linux server

You can find the procedure [here](https://wiki.beammp.com/en/home).

The recommended way if you have an ubuntu server is to download the latest binary for ubuntu on [BeamMP-Server GitHub release page](https://github.com/BeamMP/BeamMP-Server/releases)

You must set it up in a `beammp-server` folder at the root of the folder of the user which will launch BeamMP server.

### Install the admin app on the same server or another linux server

- Clone this repository: 

```bash
git clone https://github.com/levg34/beammp-admin.git
```

- Install node libraries: 

```bash
cd beammp-admin
npm install
```

- Build the project

```bash
npm run build
```

- Create your config:

Create a  .env.local file in `beammp-admin` folder root with the following content:

```bash
HOST=193.201.31.49                       # replace with your beamMP server IP adress
USERNAME=youruser                        # replace with the username which runs BeamMP server on your remote server
PRIVATE_KEY=/home/localuser/.ssh/id_rsa  # replace with the path to your private key
```

If you want to change from the default locale (en-uk), add this like in your .env.local file:

```bash
NEXT_PUBLIC_LOCALE=fr                    # replace with your locale
```

- Add your key to authorized ssh keys

Copy the public key from where you run this server to the remote server (where you run beammp server) in `~/.ssh/authorized_keys`

```bash
cat /home/localuser/.ssh/id_rsa.pub | ssh youruser@beammpserver: -T "cat >> ~/.ssh/authorized_keys"
```

- Create a directory for log rotation (feature flipping comming soon)

```bash
mkdir ~/logs
```

- Start the server

```bash
npm start
```

:warning: To run the server in the background indefinitely, run this command instead:

```bash
nohup npx next start &
```

## Advanced use

### Supabase (feature flipping comming soon)

If you want to use [supabase](https://supabase.com/) to save the users between server restart, save configs, etc, you need to add the following lines in your .env.local file:

```bash
SUPABASE_URL=https://yoursupabaseurl.supabase.co  # replace with your supabase URL
SUPABASE_KEY=yoursupabasekey                      # replace with your supabase key
```

You need to create the following tables:

- config: represents a ServerCOnfig.toml content, here is mine but you should be ready to adapt yours:

![Table config](doc/beammp%20admin%20table%20config.PNG "Table config")

- logfiles:

![Table logfiles](doc/beammp%20admin%20table%20logfiles.PNG "Table logfiles")

- users

![Table user](doc/beammp%20admin%20table%20user.PNG "Table user")

### OAuth (feature flipping comming soon)

To be able to authenticate users, you need to create an OAuth app in GitHub and/or Google, and add the following to your .env.local file:

```bash
NEXTAUTH_SECRET=createasupercomplicatedsecretlocally

GITHUB_ID=githubappid
GITHUB_SECRET=githubsecret

GOOGLE_CLIENT_ID=googleclientid
GOOGLE_CLIENT_SECRET=googleclientsecret
```

Then define which users can use your app by creating `config/usersConfig.json` based on `config/usersConfig.example.json`:

```json
{
    "admins": [
        "luc@example.com",
        "sophie@example.com"
    ]
}
```

:warning: For security reasons, you need to rebuild the project after changing this file.

## More

I will try to keep this readme up to date, but I add so much new features, that it may not be up to date.

## License

This project is under the GNU v3 licence (see LICENCE file)
