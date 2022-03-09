# pedimeloChat
 
This is a library that includes a couple of functions that simplify the work with firestore. Its designed to implement with Pedimelo Online, an other product of [@Paxapos](https://github.com/paxapos).

If you consider that it needs to have an others functions you can add an Issue.

### Functions

```js
sendMessage(msg);

/*
msg format:
{
firebase_id: number,
    data: {
        type: string,
        payload
    }
}
*/

getMessages(firebase_id) // It returns an object with all the messages sended to an user
```
