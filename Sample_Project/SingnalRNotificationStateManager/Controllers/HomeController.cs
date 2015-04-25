using SingnalRNotificationStateManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SingnalRNotificationStateManager.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			NotifyClients("Index");
			return View();
		}

		public ActionResult About()
		{
			NotifyClients("About");
			return View();
		}

		public ActionResult Contact()
		{
			NotifyClients("Contact");
			return View();
		}

		public ActionResult LogDetails(int id)
		{
			return View(LogList.Logs.FirstOrDefault(x=>x.Id==id));
		}

		private void NotifyClients(string pageName)
		{
			var log = new Log() { Id = DateTime.UtcNow.Millisecond/*fake id*/, Summary = "Someone have hit the "+pageName+" page", User = Request.Browser.Id, CreationDate = DateTime.UtcNow };
			
			LogList.Logs.Add(log);

			SignalRHub.NotificationHub.BroadcastFromServer(log);
		}

		
	}
}