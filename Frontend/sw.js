self.addEventListener('push',function(event){
    const data=event.data.json();
    const options = {
    body: data.body,
    data: data.data,
    vibrate:[300, 100, 300],
     actions: [
      { action: 'view', title: 'Open Location' },
      { action: 'call', title: 'Call Now' }
    ],
    }
    event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }

  if (event.action === 'call') {
    event.waitUntil(clients.openWindow(`contact number:${event.notification.data.contact_number}`));
  }
});