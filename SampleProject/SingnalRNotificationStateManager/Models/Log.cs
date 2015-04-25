using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SingnalRNotificationStateManager.Models
{
	public class Log
	{
		public int Id { get; set; }
		public string Summary { get; set; }
		public string User { get; set; }
		public DateTime CreationDate { get; set; }
	}
}