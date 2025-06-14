self.addEventListener('push',function(event){
    const data=event.data.json();
    const options = {
    body: data.body,
    data: data.data,
    vibrate:[300, 100, 300],
    }
    event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});