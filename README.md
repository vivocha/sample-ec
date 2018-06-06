# Sample Embedded Console Application

The **Sample Embedded Console Application** is a simple example of how to use the Vivocha API to build an integration with a 3rd party CTI platform using the [Embedded Console](http://docs.vivocha.com/display/VVCJ/Embedded+console) feature, and leaving to the CTI environment the managing of the contact queue.

### Installation

```sh
$ git clone [git-repo-url] sample-ec
$ cd sample-ec
$ npm run build:all
```

And then replace [accountid] in the Vivocha script url with your Vivocha account id.

```html
<script src="https://www.vivocha.com/a/[accountid]/js/vivocha_ec.js"></script>
```

### Usage:
```sh
./vvc-ec -t <token> -a <agent> -h <host> [-p <port>] [-k <key file>] [-c <cert file>]
```

### More:
For a list of all available options run `vvc-ec --help`:
```sh
$ ./vvc-ec --help

  Usage: vvc-ec [options]

  Options:

    -V, --version        output the version number
    -t, --token <token>  Vivocha secret token
    -a, --agent <agent>  Vivocha agent id for which the token is created
    -p, --port [port]    Webhook port (default: 80, 443 if https is enabled)
    -k, --key <key>      HTTPS key file (if key and certificate are provided the server will listen in HTTPS mode)
    -c, --cert <cert>    HTTPS certificate file (if key and certificate are provided the server will listen in HTTPS mode)
    -h, --help           output usage information
```
