export default [
  {
    index: 1,
    title: 'User Register',
    subtitle: 'Your app is awesome, everybody want to get aboard!',
    inputLabel: 'Put your javascript code here',
    inputValue: "kuzzle.collection('slack', 'foo').fetchDocument('#ces', function(err, res) { })",
    solution: "kuzzle.collection('slack', 'foo').fetchDocument('#ces', function(err, res) { })",
    description: ""
  },
  {
    index: 2,
    title: 'User Login',
    subtitle: 'Welcome your new users to your fancy app!',
    inputLabel: 'Put your javascript code here',
    inputValue: 'Fake code kuzzle.security.fetchUser(\'samuel.bouic@gmail.com\', function(err, res) { })',
    solution: 'kuzzle.security.fetchUser(\'samuel.bouic@gmail.com\', function(err, res) { })',
    description: ""
  },
  {
    index: 3,
    title: 'Create an index & collection',
    subtitle: 'Let\'s try to keep things organized',
    inputLabel: 'Put your javascript code here',
    inputValue: 'kuzzle.createIndex("slack-index", function (err, res) {\n  kuzzle.collection("channel-collection", "slack-index").create()\n})',
    solution: 'kuzzle.createIndex("slack-index", function (err, res) {\n  kuzzle.collection("channel-collection", "slack-index").create()\n})',
    multipleCalls: true,
    description: ""
  },
  {
    index: 4,
    title: 'Create a channel',
    subtitle: 'Finally some action!',
    inputLabel: 'Put your javascript code here',
    inputValue: 'kuzzle.collection("channel-collection", "slack-index").createDocument("#kuzzle", { type: "public" }, function (err, res) {})',
    solution: 'kuzzle.collection("channel-collection", "slack-index").createDocument("#kuzzle", { type: "public" }, function (err, res) {})',
    multipleCalls: false,
    description: ""
  },
  {
    index: 5,
    title: 'Subscribe to channels',
    subtitle: 'Your app is now realtime-ready!',
    inputLabel: 'Put your javascript code here',
    inputValue: 'kuzzle.collection("channel-collection", "slack-index").subscribe({}, function (err, res) {})',
    solution: 'kuzzle.collection("channel-collection", "slack-index").subscribe({}, function (err, res) {})',
    multipleCalls: false,
    description: ""
  },
  {
    index: 6,
    title: 'Search messages',
    subtitle: 'A powerful and blazing-fast search engine at your fingertips',
    inputLabel: 'Put your javascript code here',
    inputValue: 'kuzzle.collection("channel-collection", "slack-index").search({}, function (err, res) {})',
    solution: 'kuzzle.collection("channel-collection", "slack-index").search({}, function (err, res) {})',
    multipleCalls: false,
    description: ""
  }
]