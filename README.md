# Sample Embedded Console Application

The **Sample Embedded Console Application** is a simple example of how to use the Vivocha API to build an integration with a 3rd party CTI platform using the [Embedded Console](http://docs.vivocha.com/display/VVCJ/Embedded+console) feature, and leaving to the CTI environment the managing of the contact queue.
that controls the agents availability 

To use this application you need a Vivocha account enabled to use the REST API to subscribe to the Vivocha [CTI Events](http://docs.vivocha.com/display/VVCJ/Subscribe+to+CTI+Events).

### Installation

```sh
$ git clone [git-repo-url] sample-ec
$ cd sample-ec
$ npm install
```

And then replace [accountid] in the Vivocha script url with your Vivocha account id.

```html
<script src="https://www.vivocha.com/a/[accountid]/js/vivocha_ec.js"></script>
```

### Usage:
```sh
./server -a <accountid> -u <userid> -p <password> -r <agentid> -H <host> [-P <port>]
```

You can reach the sample agent console app in your browser from the following url: http\[s\]://\<host\>:\<port\>/

### More:
For a list of all available options run `server -h`:
```sh
$ ./server -h

  Usage: server [options]

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -a, --account <account>    Vivocha account
    -u, --user <user>          Vivocha user (must be an admin user)
    -p, --password <password>  Vivocha user password
    -r, --agent <agent>        Vivocha agent id to which the token is created
    -H, --host <host>          Webhook host (host must be reachable from the internet)
    -P, --port [port]          Webhook port (default: 80, 443 if https is enabled)
    -k, --key <key>            HTTPS key file (if key and certificate are provided the server will listen in HTTPS mode)
    -c, --cert <cert>          HTTPS certificate file (if key and certificate are provided the server will listen in HTTPS mode)
```
