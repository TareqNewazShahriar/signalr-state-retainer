notificationStateManager({
			recordContentSelector: '.record-container table tbody tr',
			counterSelector: '#countNotification',
			getListMethodName: 'notificationList', /* signalr server method to get notification list at session start; list must be json array (or stringify json array) and in ascending order of ID (or CreationDate) */
			getRecordMethodName: 'getNotified', /* client Method Name To Call From Server when a new notification comes; */
			dateTimeFieldName: 'time', /* UTC date and JS valid format */
			signOutButtonSelector: 'input[value="Sign Out"]',
			/* optinoal */
			showNotificationsOnCounterClick: true,
			notificationPanelSelector: '.record-container',
			onGetList: function(list) { console.log(list.length) },
			onRecordArrival: function(obj) { console.log(obj.length) }
		})
