notificationStateManager({
	recordContentSelector: '.record-container table tbody tr',
	counterSelector: '#countNotification',
	showNotificationsOnCounterClick: true,
	getListMethodName: 'notificationList', /* signalr server method to get notification list at session start */
	getRecordMethodName: 'getNotified', /* client Method Name To Call From Server when a new notification comes */
	dateTimeFieldName: 'time',
	signOutButtonSelector: 'input[value="Sign Out"]',
	max: 10, // 15 default
	/* events */
	onGetList: null,
	onRecordArrival: null
});
