/* 
 * SignalR Notification State Manager v1.0.1
 * Released under Apache License
 * This plugin needs jQuery [http://www.jquery.com], just like SignalR's scripts.
 * Date: Thu Apr 16 2015 00:43:05 GMT+0600 (Bangladesh Standard Time)
 */

function notificationStateManager(options)
{
	'use strict';

	/* globals */
	var addAt = { top:'top', bottom: 'bottom' }
	var cons = {
		dataDomClass: 'signalNotificationDom',
		storeKey: 'signalNotificationData'
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
		var dom = $(options.recordContentSelector);
		$(dom).hide(); /* highest priority */
		$(dom).addClass(cons.dataDomClass);
		/* removed stored data if signed out */
		if(options.signOutButtonSelector)
		{
			$(options.signOutButtonSelector).click(function()
			{
				sessionStorage.removeItem(cons.storeKey);
			});
		}
		/* show/hide notification panel */
		if(options.notificationOpenerSelector && options.notificationPanelSelector)
		{	
			$(document).click(function(e)
			{
				var clickedDom = $(e.target);
				if(clickedDom[0] == $(options.notificationOpenerSelector)[0])
					$(options.notificationPanelSelector).slideToggle("fast");
				else if(clickedDom.parents(options.notificationPanelSelector).length == 0
					&& clickedDom[0] != $(options.notificationPanelSelector)[0]
					&& $(options.notificationPanelSelector).css('display') != 'none')
				{
					$(options.notificationPanelSelector).slideUp("fast");
				}
			});
		}
	}

	function notificationInitialisation()
	{
		$.connection[options.signalrHubName].client[options.getRecordMethodName] = function(jsonObj)
		{	
			var record = typeof jsonObj == 'string' ? JSON.parse(jsonObj) : jsonObj;
			addItemToStoredData(record, options.addAt);
			/* append that notification */
			var html = createHtml(record);
			if(options.addAt == addAt.bottom)
				$(html).appendTo($('.' + cons.dataDomClass).parent());
			else
				$(html).prependTo($('.' + cons.dataDomClass).parent());

			if(options.counterSelector)
				increamentNotificationCounter(1);

			if(typeof options.onRecordArrival == 'function')
				options.onRecordArrival(record);
		}
		$.connection.hub.start().done(function()
		{
			if(options.getListMethodName && !getStoredData(cons.storeKey)) /* if no data found */
				getList();
			else
				getStateAtPageLoad();
		})
	}

	function getList()
	{
		$.connection[options.signalrHubName].server[options.getListMethodName]().then(function(jsonData)
		{
			var jsonList;
			/* if more than max, then slice */
			jsonList = typeof jsonData == 'string' ? JSON.parse(jsonData) : jsonData;
			storeData(cons.storeKey, jsonData);
			getStateAtPageLoad(); /* render the jsonList */

			if(typeof options.onGetList == 'function') /* user's callback */
				options.onGetList(jsonList);
		});
	}

	/* check cookie and retrieve notification data */
	function getStateAtPageLoad()
	{
		var jsonList = getStoredData(cons.storeKey);
		if(!jsonList) return; /* nothing to render, return */

		var dom;
		for(var i=0; i<jsonList.length; i++)
		{
			dom = createHtml(jsonList[i]);
			$(dom).appendTo($('.' + cons.dataDomClass).parent());
		}

		if(options.counterSelector)
			increamentNotificationCounter(jsonList.length);
	}

	function increamentNotificationCounter(i)
	{
		/* increment the notification counter */
		var counter = $(options.counterSelector);
		if(counter[0].tagName.toUpperCase() == 'INPUT')
		{
			var val = parseInt($(counter).val());
			if(!val) val = 0;
			$(counter).val(val + i);
		}
		else
		{
			var val = parseInt($(counter).html());
			if(!val) val = 0;
			$(counter).html(val + i);
		}
	}

	function addItemToStoredData(jsonObj)
	{
		var jsonList = getStoredData(cons.storeKey);
		if(jsonList)
			options.addAt == addAt.bottom ? (jsonList.push(jsonObj)) : (jsonList.unshift(jsonObj));
		storeData(cons.storeKey, jsonList);
	}
	
	function createHtml(record)
	{
		/* clone the record render dom */
		var dom = $('.' + cons.dataDomClass).clone();
		dom.removeClass(cons.dataDomClass);
		dom.show();
		var html = dom[0].outerHTML; /* take html of the dom itself too */
		/* render values in html */
		for(var key in record)
		{
			var val = record[key];
			if(options.dateTimeFieldName == key)
				val = formatDateTime(record[key], false);
			var reg = new RegExp('\\[\\[' + key + '\\]\\]', 'gim');
			html = html.replace(reg, val); /* html replace removes all event bindings. since we're cloning so no problem */
		}
		return html;
	}

	function formatDateTime(time, timeDateIn2Lines)
	{
		var date = time.indexOf('Date(')>=0? new Date(parseInt(time.slice(6,-2))) : new Date(time + ' GMT+0000');
		var now = new Date();
		time = (date.getHours() % 12 || 12) +				/* 12 hour format */
			':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +	/* min with zero padding */
			' ' + (date.getHours() < 12 ? 'AM' : 'PM');	/* AM / PM */
		time += date.toDateString() == now.toDateString() ? '' : (timeDateIn2Lines ? '<br/>' : ' ') + date.toLocaleDateString();
		return time;
	}

	function storeData(key, jsonData)
	{
		if(!sessionStorage) return;

		var strJson = null;
		if(jsonData)
		{
			var strJson, jsonList;
			jsonList = typeof jsonData == 'string' ? jsonList = JSON.parse(jsonData) : jsonData;
			strJson = escape(JSON.stringify(jsonList));
		}
		sessionStorage.setItem(key, strJson);
	}

	function getStoredData(key)
	{
		if(!sessionStorage) return;

		var jsonList = null;
		var strJson = sessionStorage.getItem(key);
		if(strJson)
			jsonList = JSON.parse(unescape(strJson));
		
		return jsonList;
	}
}
