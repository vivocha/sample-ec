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

And then modify the [accountid] in the vivocha script inside the index.html with your vivocha account

\<script src="https://www.vivocha.com/a/[accountid]/js/vivocha_ec.js">\</script>

### Usage:
```sh
./server -a <accountid> -u <userid> -p <password> -r <agentid> -H <host> [-P <port>]
```

###
http://host:port/