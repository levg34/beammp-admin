# Beammp admin
Web interface for [BeamMP server](https://github.com/BeamMP/BeamMP-Server)

![Screenshot](doc/beammp%20admin%20screenshot.PNG "Screenshot")

![Screenshot](doc/beammp%20admin%20screenshot%202.PNG "Screenshot")

## Installation

You need nodejs version 12 or greater.

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

- Add your key to authorized ssh keys

Copy the public key from where you run this server to the remote server (where you run beammp server) in `~/.ssh/authorized_keys`

```bash
cat /home/localuser/.ssh/id_rsa.pub | ssh youruser@beammpserver: -T "cat >> ~/.ssh/authorized_keys"
```

- Start the server

```bash
npm start
```

:warning: To run the server in the background indefinitely, run this command instead:

```bash
nohup npx next start &
```
