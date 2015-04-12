function realtimeNotification(options)
{
	/* globals */
	var cons = {
		dataDomClass: 'signalNotificationDom',
		storeKey: 'signalrNotify'
	}

	/* at dom ready */
	$(function()
	{
		pluginInitialisation();
		notificationInitialisation();
	});

	/* calls at initialisation */
	function pluginInitialisation()
	{	
		var dom = $(options.domSelector);
		$(dom).hide();
		$(dom).addClass(cons.dataDomClass);
		// removed stored data if signed out
		if(options.signOutButtonSelector)
		{
			$(options.signOutButtonSelector).click(function()
			{
				sessionStorage.removeItem(cons.storeKey);
			});
		}
		// show/hide notification panel
		if(options.showNotificationOnCounterClick)
		{
			$(options.notificationCounterSelector).click(function()
			{
				$('.record-container').slideToggle("fast");
			});
		}
	}
	
	function notificationInitialisation()
	{
		$.connection.NotificationHub.client[options.getRecordMethodName] = function(strJson)
		{
			var record = JSON.parse(strJson);
			/* append that notification */
			var html = createHtml(record);
			$(html).prependTo($('.' + cons.dataDomClass).parent());
			addItemToStoredData(record);

			if(options.notificationCounterSelector)
				increamentNotificationCounter(1);
		}
		$.connection.hub.start().done(function()
		{
			if(!sessionStorage.getItem(cons.storeKey))
				getList();
			else
				getStateAtPageLoad();
		})
	}

	function increamentNotificationCounter(i)
	{
		// increment the notification counter
		var counter = $(options.notificationCounterSelector);
		if(counter[0].tagName.toUpperCase() == 'INPUT')
		{
			var val = parseInt($(counter).val());
			if(!val) val = 0;
			$(counter).val(val+i);
		}
		else
		{
			var val = parseInt($(counter).html());
			if(!val) val = 0;
			$(counter).html(val+i);
		}
	}

	function addItemToStoredData(record)
	{	
		var storedData = sessionStorage.getItem(cons.storeKey);
		if(storedData)
		{
			var jsonList = JSON.parse(storedData);
			jsonList.push(record);
		}
		sessionStorage.setItem(cons.storeKey, JSON.stringify(jsonList));
	}

	function getList()
	{
		$.connection.NotificationHub.server[options.getListMethodName]().then(function(strJsonList)
		{
			sessionStorage.setItem(cons.storeKey, strJsonList);
			getStateAtPageLoad();
		});
	}

	function createHtml(record)
	{
		/* clone the record render dom */
		var dom = $('.'+cons.dataDomClass).clone();
		dom.removeClass(cons.dataDomClass);
		dom.show();

		/* render values in html */
		for(key in record)
		{
			if(options.dateTimeFieldName == key)
				record[key] = formatDateTime(record[key], true)
			$(dom).html($(dom).html().replace('[[' + key + ']]', record[key])); /* html replace removes all event bindings. since we're cloning so no problem */
		}
		return dom;
	}

	/* check cookie and retrieve notification data */
	function getStateAtPageLoad()
	{
		var storedData = sessionStorage.getItem(cons.storeKey);
		if(!storedData) return; /* no previously stored data */

		var records = JSON.parse(storedData);
		var dom;
		for(var i = records.length - 1; i >= 0; i--)
		{
			dom = createHtml(records[i]);
			$(dom).prependTo($('.'+cons.dataDomClass).parent());
		}

		if(options.notificationCounterSelector)
			increamentNotificationCounter(records.length);
	}
	
	function formatDateTime(time, timeDateIn2Lines)
	{
		var date = new Date(time + ' GMT+0000');
		var now = new Date();
		time = (date.getHours() % 12 || 12) +				/* 12 hour format */
			':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +	/* min with zero padding */
			' ' + (date.getHours() < 12 ? 'AM' : 'PM');	/* AM / PM */
		time += date.toDateString() == now.toDateString() ? '' : (timeDateIn2Lines ? '<br/>' : ' ') + date.toLocaleDateString();
		return time;

	}
}
