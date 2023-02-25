# LumineGuilded.js
Lumine.js (Guilded) To Interact With the Discord API 

**Note : This module is a development stage module. If there is a problem we are not responsible**

## How To Login?

• Method 1

```js
const { Client } = require('lumineg.js')
const client = new Client({
   token:"YOUR BOT TOKEN"
})

client.login()
```

• Method 2 

```js
const { Client } = require('lumineg.js')
const client = new Client()

client.login("YOUR BOT TOKEN")
```