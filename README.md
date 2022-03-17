# pedimeloChat
 
This is a library that includes a couple of functions that simplify the work with firestore. Its designed to implement with Pedimelo Online, an other product of [@Paxapos](https://github.com/paxapos).

If you consider that it needs to have an others functions you can add an Issue.

### How to install

1. En Firebase console, abre Configuración > Cuentas de servicio.
2. Haz clic en Generar nueva clave privada y luego en Generar clave para confirmar.
3. Almacena de forma segura el archivo JSON que contiene la clave.
4. Configura la variable de entorno `GOOGLE_APPLICATION_CREDENTIALS` con la ruta del archivo JSON que contiene la clave de tu cuenta de servicio
	```
		Windows: 
			$env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\username\Downloads\service-account-file.json"

		Linux/macOS:
			export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"

	```		
5. En la pagina de GCP (Google Cloud Plataform [Click Aca](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)) de tu proyecto, anda arriba a la izquierda en la barra de busqueda de la pagina, y busca Firestore.
6. Despues activalo.

### Functions

```js
// msg is an object, origen is a string
sendMessage(msg, origen);


/* msg Format

	{
   		type: “chat”
   		firebase_id: number
  
   		event: string
   		payload: {
        		id: string
			field: string
			old_value: any
			new_value: any
     		}
	}

*/

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
addUser(user_id, pedido_id) // It adds a new user to the database
```
