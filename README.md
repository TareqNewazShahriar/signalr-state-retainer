#### SignalR Notification State Manager
This plugin helps you to retain all the notification or chat data on client sessionStorage and render those information after a page redirection or form post. Developers don't need to return it from the server on action executing or page redirection etc. The sample application have been hosted in appharbor - http://signalrstatemgr.apphb.com

Here are the quick steps (for nerds) of How to use the plugin-

###### Server-side Steps
* **Step 1:** In your SignalR hub, add a method which will call the client method when a new notification will be available.
Let's name the Hub name as 'NotificationHub' and the client method as 'getNotified'. We will provide that name to the plugin to create a JS method with that name. This method will return the Json of the notification data. For example

```cs
public static void BroadcastFromServer(Log log)
{
	var jsonObj = new JavaScriptSerializer().Serialize(new { log.Id, log.Summary, log.User, log.CreationDate });

	var signalrHub = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
	signalrHub.Clients.All.getNotified(jsonObj);
}
````

* **Step 2 [optional]:** Also in your SignalR hub, add a method to return a list of notification list which wiil be called once by plugin at the beginning of the session. This method is optional. This will also return the list converting to a Json array.

```cs
public dynamic notificationList(List<Log> logs)
{	
	return new JavaScriptSerializer().Serialize(logs.OrderByDescending(x=>x.Id).Take(10));
}
````


###### JS, Html Steps
* **Steps 3**: Add an Html container to your desired place to render the data using the properties of the data.
Suppose our record has those fields: Id, NotficationName, CreationDate. So write your HTML like this way:

```html
<div class="record-container">
	<span>[[NotficationName]]</span>
	<span>[[CreationDate]]</span>
	<a href="/Notification/Details/[[Id]]">See Detail<a/>
</div>
```

* **Step 4:** Call the plugin with necessary parameter options. A sample call can be like this:

```javascript
$(function()
{
	notificationStateManager({
		signalrHubName: 'NotificationHub',
		getListMethodName: 'notificationList',
		getRecordMethodName: 'getNotified',
		dateTimeFieldName: 'CreationDate',
		recordContentSelector: '.record',
		counterSelector: '#countNotification',
		signOutButtonSelector: '#signout',
		notificationOpenerSelector: '#countNotification',
		/* optinoal */
		//addAt: 'top', // add new notification at: 'top'/'bottom'
		notificationPanelSelector: '.record-container',
		onGetList: function(list) { console.log('Total: ' + list.length) },
		onRecordArrival: function(obj) { console.log('Log ID: ' + obj.Id) }
	});
});
```


##### Plugin Parameter Description

The parameter contains 10 options and 3 events.

**Options:**

* signalrHubName *(string)*: Pass the name of your C#/VB class that implemented the SignalR Hub class. For example:
```js
signalrHubName: 'NotificationHub'
```
* getListMethodName *(string) / optional*: Name of the SignalR server-side method which will be called at the beginning of the application session to get a list of notification/chat data you want the user to see when they will be signed-in. For example: 
```js
getListMethodName: 'notificationList'
```

* getRecordMethodName *(string)*: Name of the client-side js method you want the plugin to define so that you can call from SignalR code, when a new notification is available.

* dateTimeFieldName *(string) / optional*: Tell the plugin your date-time property name. The value of this field will be shown in a certain format. For example: the object you're passing have those properties: Id, NotficationName, CreationDate. Then pass 'CreationDate' to that parameter option: 
```js
dateTimeFieldName: 'CreationDate'.
```

* recordContentSelector *(string)*: Now this option is about the HTML. This option is just about a DOM selector, but here I shall describe what this option is about; this option is about where to render the notification data of your HTML page. Design your HTML and tell the plugin where to render the property values. If you're familiar with AngularJS then you're familiar with this part too. Let's recall your object has properties of - Id, NotficationName, CreationDate. So write your HTML like this way:

```html
<div class="record-container">
	<span>[[NotficationName]]</span>
	<span>[[CreationDate]]</span>
	<a href="/Notification/Details/[[Id]]">See Detail<a/>
</div>
```

So now just pass the the CSS class name:
```js
recordContentSelector:'record-container'.
```

* counterSelector *(string) / optional*: Pass the selector of the DOM where you want to show the notification counter to inform the user that how many notifications are available. 
```js
counterSelector: '#countNotification'
```

* signOutButtonSelector *(string) / optional*: Selector of the sign-out button or link. The time when user will click on the sign-out button all locally saved data will be deleted for safely. '#signout',
```js
notificationOpenerSelector: '#countNotification'
```

* addAt *(string) / optional*: Default value for this optino is *top*. If you want that new notification will be shown at bottom then pass 'bottom'.

* notificationPanelSelector *(string) / optional*: If you want that the notification panel will be opened on click at notification counter DOM then pass the selector of the notification panel container.
```js
 notificationPanelSelector: '.record-container'
```

**3 Events:**
* onSignalrInitialisation *(function) / optional*: Pass a function to execute at the time when the SignalR is ready. Develolper's can use this callback to make any hidden or disabled DOM visible/enable that needs SignalR.
```js
onSignalrInitialisation: function()
						 {
							$('#sendMsg').removeAttr('disabled');
						 }
```

* onGetList *(function) / optional*: Pass a function to execute after rendering the notification list at session start. This callback will be called with notification list so that you can leverage.
```js
onGetList: function(list)
	{
		console.log('Total: ' + list.length);
	}
```

* onRecordArrival *(function) / optional*: Pass a callback to execute when a new notification will arrive. This callback will pass the newly arrived notification data parameter.
```js
 onRecordArrival: function(obj)
	{
		console.log('Log ID: ' + obj.Id);
	}
```

**Feel free to create issues for any bug or additional useful feature.**
