using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using SingnalRNotificationStateManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace SingnalRNotificationStateManager.SignalRHub
{
	// your hub name will be camel-cased in JS. To customise the JS hub name, use HubName attribute
	[HubName("NotificationHub")]
	public class NotificationHub : Hub 
	{
		public static void BroadcastFromServer(Log log)
		{
			var jsonObj = new JavaScriptSerializer().Serialize(new { log.Id, log.Summary, log.User, log.CreationDate });

			var signalrHub = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
			signalrHub.Clients.All.getNotified(jsonObj);
		}

		public dynamic notificationList()
		{	
			return new JavaScriptSerializer().Serialize(LogList.Logs.OrderByDescending(x=>x.Id).Take(5));
		}
	}
}
