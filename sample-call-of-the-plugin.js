realtimeNotification({
	domSelector: '.record-container table tbody tr',
	notificationCounterSelector: '#countNotification',
	showNotificationOnCounterClick: true,
	getListMethodName: 'notificationList', /* signalr server method to get notification list at session start */
	getRecordMethodName: 'getNotified', /* client Method Name To Call From Server */
	dateTimeFieldName: 'time',
	signOutButtonSelector: 'input[value="Sign Out"]'
});
