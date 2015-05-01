using System;
using System.Collections.Generic;
using SignalRStateManager.Models;

namespace SignalRStateManager
{
	public static class LogList
	{	
		private static List<Log> logs=new List<Log>();
		public static List<Log> Logs
		{
			get
			{
				if(logs.Count == 0)
					PopulateLogs();
				return logs; 
			}
			set { logs = value; }
		}

		private static void PopulateLogs()
		{
			int tot = 6;
			for(int i = 1; i < tot; i++)
			{
				logs.Add(new Log() { Id = (tot - i), Summary = "Something happened " + (tot - i), User = "user" + (tot - i), CreationDate = DateTime.UtcNow.AddHours(i * -5) });
			}
		}
	}
}