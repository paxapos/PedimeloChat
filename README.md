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

getMessages(firebase_id) // Gets you a list with the last 10 messages from an specific user ordered last to first
getMessages(firebase_id, 100) // Gets you a list with the last 100 messages from an specific user ordered last to first
getMessages(firebase_id, 0) // Gets you a list with all the messages from an specific user ordered last to first

```
