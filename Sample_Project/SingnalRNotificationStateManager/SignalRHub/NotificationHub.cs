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

		public string notificationList()
		{
			//string jsonStr = new JavaScriptSerializer().Serialize(LogList.Logs.OrderByDescending(x => x.Id).Take(5));
			return "[{\"Id\":5,\"Summary\":\"Something happened 5\",\"User\":\"user5\",\"CreationDate\":\"\\/Date(1430222916489)\\/\"},{\"Id\":4,\"Summary\":\"Something happened 4\",\"User\":\"user4\",\"CreationDate\":\"\\/Date(1430204916489)\\/\"},{\"Id\":3,\"Summary\":\"Something happened 3\",\"User\":\"user3\",\"CreationDate\":\"\\/Date(1430186916489)\\/\"},{\"Id\":2,\"Summary\":\"Something happened 2\",\"User\":\"user2\",\"CreationDate\":\"\\/Date(1430168916489)\\/\"},{\"Id\":1,\"Summary\":\"Something happened 1\",\"User\":\"user1\",\"CreationDate\":\"\\/Date(1430150916489)\\/\"}]";
		}
	}
}
