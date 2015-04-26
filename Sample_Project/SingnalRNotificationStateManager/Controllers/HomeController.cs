using SingnalRNotificationStateManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SingnalRNotificationStateManager.Controllers
{
	public class HomeController : Controller
	{	
		public ActionResult Index()
		{
			NotifyClients();
			return View();
		}

		public ActionResult About()
		{
			NotifyClients();
			return View();
		}

		public ActionResult Contact()
		{
			NotifyClients();
			return View();
		}

		public ActionResult LogDetails(int id)
		{
			return View(LogList.Logs.FirstOrDefault(x=>x.Id==id));
		}

		private void NotifyClients()
		{
			string action = RouteData.Values["action"].ToString();
			var log = new Log() 
			{	
				Id = LogList.Logs.Count+1,
				Summary = (action == "SingIn" ? User.Identity.Name + " logged-in"
					: "Someone have hit the " + action),
				User = User.Identity.Name,
				CreationDate = DateTime.UtcNow
			};
			
			LogList.Logs.Add(log);
			SignalRHub.NotificationHub.BroadcastFromServer(log);
		}
		
		#region Mock Signin-signout actions

		public ActionResult SignIn()
		{
			if(Request.Cookies.Get(".ASPXAUTH") != null)
				return RedirectToAction("Index");
			return View();
		}

		[HttpPost]
		public ActionResult SignIn(string username, string password)
		{
			NotifyClients();
			if(string.IsNullOrWhiteSpace(username))
			{
				ModelState.AddModelError("", "No username!!! Pleeez type one.");
				ViewBag.uername = username;
				ViewBag.password = password;
				return View();
			}
			else
			{
				FormsAuthentication.SetAuthCookie(username, false); // we're just mocking the authentication
				return RedirectToAction("Index");
			}
		}

		public ActionResult SignOut()
		{
			NotifyClients();
			FormsAuthentication.SignOut();
			return RedirectToAction("SignIn");
		}

		#endregion
	}
}
