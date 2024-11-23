const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');


// Set up web-push with your VAPID keys
webpush.setVapidDetails(
  'mailto:farhan786bugati@gmail.com', // Replace with your email
  "BPWMHbrkYka74HGPFmAKBKkMWtGE9cuCLF1EgdhST_Z5Fc_EU33RC8w122U39jTv3y4k9vKi4f1TKgkQgRz07gg", // VAPID Public Key (should be stored in env)
  "JYxDdyMDv8HefXC3A1gWGAjQE5ohjyMr3UZLxWz9nJo" // VAPID Private Key (should be stored in env)
);

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: ['https://localhost:443','http://localhost:3000','https://localhost','https://pwatestingfrontend.vercel.app/','https://pwatestingfrontend.vercel.app','https://192.168.29.48:3000'] })); // Allow your frontend's origin
// Store subscriptions in memory for simplicity
let subscriptions = [];

// Route to subscribe to push notifications
app.post('/api/subscribe', (req, res) => {
  const { subscription } = req.body;

  // Store the subscription in memory or your database
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription added.' });
});

// Route to unsubscribe from push notifications
app.post('/api/unsubscribe', (req, res) => {
  const { subscription } = req.body;

  // Remove the subscription from memory or your database
  subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
  res.status(200).json({ message: 'Unsubscribed.' });
});

// Route to send a push notification
app.post('/api/send-notification', (req, res) => {
  const { message } = req.body;

  if (subscriptions.length > 0) {
    subscriptions.forEach(sub => {
      webpush.sendNotification(sub, JSON.stringify({
        title: 'New Notification',
        body: message,
        icon: '/web-app-manifest-192x192.png'
      })).catch(error => console.error('Error sending notification', error));
    });
    res.status(200).json({ message: 'Notification sent.' });
  } else {
    res.status(404).json({ error: 'No subscribers found' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
