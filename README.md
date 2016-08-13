### SignalR State Manager
This plugin helps you to retain all the notifications or chat data on client side and render those information after page redirection, form submission etc. Developers don't need to send those data from the server every time.
Get a go with the <a target="_blank" href="http://signalrstatemgr.apphb.com">Demo</a>, the sample application has been hosted in appharbor.

Here are quick steps (for the nerds) of How to use the plugin-

#### Server-side Steps
* **Step 1:** In your SignalR hub, add a method which will call the client method when a new notification will be available.
Let's name the Hub name as 'NotificationHub' and the client method as 'getNotified'. We will provide that name to the plugin to create a JS method with the same name. The server-side method will return the Json of the notification data. For example

```cs
using System.Web.Script.Serialization;

public static void BroadcastFromServer(Log log)
{
	var jsonObj = new JavaScriptSerializer().Serialize(new { log.Id, log.Summary, log.User, log.CreationDate });

	var signalrHub = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
	signalrHub.Clients.All.getNotified(jsonObj);
}

// the 'Log' model
public class Log
{
	public int Id { get; set; }
	public string Summary { get; set; }
	public string User { get; set; }
	public DateTime CreationDate { get; set; }
}
````

* **Step 2 [optional]:** Also in your SignalR hub, add a method to return a list of notification which will be called once by the plugin at the beginning of the session. This method is optional. This method will also return the list converting to a Json array.

```cs
public string notificationList(List<Log> logs)
{
	var shortList = logs.OrderByDescending(x=>x.Id).Take(5);
	return new JavaScriptSerializer().Serialize(shortList);
}
````


#### JS, Html Steps
* **Steps 3**: Add the plugin after SignalR scripts-
```html
<script src="~/Scripts/jquery.signalR-2.1.1.min.js"></script>
<script src="~/signalr/hubs"></script>
<script src="~/Scripts/signalRsignalrStateManager.min.v.x.x.js"></script>
```

* **Steps 4**: Add an Html container to your desired place to render the data using the properties of the notification data. For example, notification model has those fields: Id, NotficationName, CreationDate. So write your HTML like this:

```html
<div class="record-template">
	<span>[[NotficationName]]</span>
	<span>[[CreationDate]]</span>
	<a href="/Notification/Details/[[Id]]">See Detail<a/>
</div>
```

* **Step 5:** Call the plugin with necessary parameter options. A sample call was shown below. Parameter options have been explained next to it.

```javascript
$(function()
{
	signalrStateManager({
			signalrHubName: 'NotificationHub',
			getListMethodName: 'notificationList',
			getNotifiedMethodName: 'getNotified',
			recordTemplateSelector: '.record-template',
			dateTimeFieldName: 'CreationDate',
			counterSelector: '#countNotification',
			panelSelector: '.record-container',
			panelOpenerSelector: '#countNotification',
			signOutButtonSelector: '#signout',
			// addAt: 'bottom',
			/* events */
			onSignalrInit: function() /* calls after signalr initialisation */
			{
				$('#notify').removeAttr('disabled');
			},
			onGetList: function(list)
			{
				console.log('Total ' + list.length + ' records have been returned from the server.');
			},
			onGetNotified: function(obj)
			{
				console.log('New data have come.');
			}
		});
});
```


#### Plugin Parameter Description

The parameter contains 11 options and 6 events.

#### Options:

* signalrHubName *(string)*: Pass the name of your C#/VB class that implemented the SignalR Hub class. For example:
```js
signalrHubName: 'NotificationHub'
```
* getListMethodName *(string) / optional*: Name of the SignalR server-side method which will be called at the beginning of the application session to get a list of notification/chat data you want the user to see when they will be signed-in. For example:
```js
getListMethodName: 'notificationList'
```

* getNotifiedMethodName *(string)*: Name of the client-side js method you want the plugin to define so that you can call from SignalR code, when a new notification is available.

* recordTemplateSelector *(string)*: This option is about where to render the notification data of your HTML page. Design your HTML and tell the plugin where to render the property values. If you're familiar with AngularJS then you're familiar with this part too. Let's recall your object has properties of - Id, NotificationName, CreationDate. So write your HTML like this way:

```html
<div class="record-template">
	<span>[[NotficationName]]</span>
	<span>[[CreationDate]]</span>
	<a href="/Notification/Details/[[Id]]">See Detail<a/>
</div>
```

So now just pass the the CSS class name:
```js
recordTemplateSelector:'.record-template'
```

* dateTimeFieldName *(string) / optional*: Tell the plugin your date-time property name. The value of this field will be shown in a certain format. For example: the object you're passing have those properties: Id, NotficationName, CreationDate. Then pass 'CreationDate' to that parameter option: 
```js
dateTimeFieldName: 'CreationDate'
```

* counterSelector *(string) / optional*: Pass the selector of the DOM where you want to show the notification counter to inform the user that how many notifications are available. 
```js
counterSelector: '#countNotification'
```

* panelOpenerSelector *(string) / optional*: Selector of the DOM element that will be used to open the notification panel on onclick. Generally the notification counter DOM can be used for that.
```js
panelOpenerSelector: '#countNotification'
```

* panelSelector *(string) / optional*: If you want that the notification panel will be opened on click at notification counter DOM then pass the selector of the notification panel container.
```js
 panelSelector: '.record-container'
```

* signOutButtonSelector *(string) / optional*: Selector of the sign-out button or link. The time when user will click on the sign-out button all locally saved data will be deleted for safely. '#signout',
```js
signOutButtonSelector: '#signout'
```

* itemRemoverSelector *(string)/optional*: If you have remove or clear button for each notification, then pass the selector to that parameter.
```js
itemRemoverSelector: '.remove-btn'
```

* addAt *(string) / optional*: Default value for this optino is *top*. If you want that new notification will be shown at bottom then pass 'bottom'.

#### 6 Events:
* onSignalrInit *(function) / optional*: Pass a function to execute at the time when the SignalR is ready. Develolper's can use this callback to make any hidden or disabled DOM visible/enable that needs SignalR.
```js
onSignalrInit: function()
{
	$('#sendMsg').removeAttr('disabled');
}
```

* onGetList *(function) / optional*: Pass a function to execute after rendering the notification list at session start. This callback will be called with notification list so that you can leverage it.
```js
onGetList: function(list)
{
	console.log('Total ' + list.length + ' records have returned from the server.');
}
```

* onGetNotified *(function) / optional*: Pass a callback to execute when a new notification will arrive. This callback will pass the newly arrived notification data through parameter.
```js
onGetNotified: function(obj)
{
	console.log('New data have come.');
}
```

* onItemRemoval *(function) / optional*: The callback function, to execute when the user will remove an item.
```js
onItemRemoval: function(removedItem)
{
	console.log('Flag the removed item (ID-' + removedItem.Id + ') as read/removed on Server. You\'ve got my idea, right!');
}
```

* onLoad *(function) / optional*: This callback will be fired at the beginning of getting list and on every page load after resotore whole state.

Let me explain it, at the begining of a session you may want to load a list of most recent notifications or chats history. Again, after every page load the plugin reloads the whole state. On these both occasions, this event will be fired. Run the sample application and test it.
```js
onLoad: function()
{
	console.log('all data loaded.');
}
```

* onChange *(function) / optional*: After arrival of each new notification or after delettion each item, this event will be executed.
```js
onChange: function()
{
	console.log('Either new notifcation came or you deleted a item.');
}
```

onDataRender
* onDataRender *(function) / optional*: Afte getting the list from server or restoring the state or after getting a new notification, this event will be executed.
```js
onDataRender: function()
{
	console.log('Data render complete.');
}
```


**Feel free to create issues for any bug or additional feature.**
