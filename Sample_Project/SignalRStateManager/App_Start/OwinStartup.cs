using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(SignalRStateManager.App_Start.OwinStartup))]
namespace SignalRStateManager.App_Start
{
	public class OwinStartup
	{
		public void Configuration(IAppBuilder app)
		{
			// Any connection or hub wire up and configuration should go here
			app.MapSignalR();
		}
	}
}