using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Linq;
using System.Web.Script.Serialization;
using SignalRStateManager.Models;

namespace SignalRStateManager.SignalRHub
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
			return new JavaScriptSerializer().Serialize(LogList.Logs.OrderByDescending(x => x.Id).Take(5));
		}
	}
}
