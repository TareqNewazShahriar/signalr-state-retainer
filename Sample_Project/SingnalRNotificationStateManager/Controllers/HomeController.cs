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
			if(Request.Cookies.Get(".ASPXAUTH") == null)
				return RedirectToAction("SignIn");

			return View();
		}

		public ActionResult About()
		{
			if(Request.Cookies.Get(".ASPXAUTH") == null)
				return RedirectToAction("SignIn");

			return View();
		}

		public ActionResult Contact()
		{
			if(Request.Cookies.Get(".ASPXAUTH") == null)
				return RedirectToAction("SignIn");

			return View();
		}

		public ActionResult LogDetails(int id)
		{
			return View(LogList.Logs.FirstOrDefault(x=>x.Id==id));
		}

		public void NotifyClients(string pageName)
		{
			if(Request.Cookies.Get(".ASPXAUTH") == null)
				return;

			var log = new Log()
			{
				Id = LogList.Logs.Count + 1,
				Summary = "Click from " + pageName,
				User = Request.Browser.Type,
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
			if(string.IsNullOrWhiteSpace(username))
			{
				ModelState.AddModelError("", "So you want to signin without a username! keep up!");
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
			FormsAuthentication.SignOut();
			return RedirectToAction("SignIn");
		}

		#endregion
	}
}
