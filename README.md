#### SignalR Notification State Manager
Javascript plugin to manage the state of the SignalR realtime notifications between page redirections. 

**Here are the quick steps (for nerds) of How to use the plugin**

Server-side C#/VB Steps:
* **Step 1**: In your SignalR hub, add a method which will call the client method when a new notification will be available.
Let's name the Hub name as 'NotificationHub' and the client method as 'getNotified'. We will provide that name to the plugin to create a JS method with that name. This method will return the Json of the notification data. For example

```cs
public static void BroadcastFromServer(Log log)
{
	var jsonObj = new JavaScriptSerializer().Serialize(new { log.Id, log.Summary, log.User, CreationDate = log.CreationDate });

	var signalrHub = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
	signalrHub.Clients.All.getNotified(jsonObj);
}
````

* **Step 2** [optional]: Also in your SignalR hub, add a method to return a list of notification list which wiil be called once by plugin at the beginning of the session. This method is optional. This will also return the the list converting to a Json array.

```cs
public dynamic notificationList(List<Log> logs)
{	
	return new JavaScriptSerializer().Serialize(logs.OrderByDescending(x=>x.CreationDate).Take(10));
}
````

JS, Html Steps:
* **Steps 3**: Add an Html container to your desired place to render the data using the properties of the data.
Suppose our record has these fields: Id, StudentName, RollNo, Address, CreationDate.
So the HTML will be something like that:

```html
div class="record-container">
	<a class="record" target="_blank" href="/home/LogDetails/[[Id]]">
		<div class="summary">[[Summary]]</div>
		<div class="first">[[User]]</div>
		<div class="second">[[CreationDate]]</div>
	</a>
</div>
```

* **Step 4**: Call the plugin with necessary parameters. A sample call can be like this:

```javascript
$(function()
{
	notificationStateManager({
		signalrHubName: 'NotificationHub',
		recordContentSelector: '.record',
		counterSelector: '#countNotification',
		getListMethodName: 'notificationList',
		getRecordMethodName: 'getNotified',
		dateTimeFieldName: 'CreationDate',
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
