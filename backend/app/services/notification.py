from datetime import datetime, timedelta
import json
import os

class NotificationService:
    def __init__(self, notification_file='notifications.json'):
        self.notification_file = notification_file
        self.load_notifications()

    def load_notifications(self):
        if os.path.exists(self.notification_file):
            with open(self.notification_file, 'r') as file:
                self.notifications = json.load(file)
        else:
            self.notifications = []

    def save_notifications(self):
        with open(self.notification_file, 'w') as file:
            json.dump(self.notifications, file)

    def add_notification(self, message, notify_date):
        notification = {
            'message': message,
            'notify_date': notify_date.isoformat(),
            'is_sent': False
        }
        self.notifications.append(notification)
        self.save_notifications()

    def get_due_notifications(self):
        current_time = datetime.now()
        due_notifications = [
            notification for notification in self.notifications
            if datetime.fromisoformat(notification['notify_date']) <= current_time and not notification['is_sent']
        ]
        return due_notifications

    def mark_as_sent(self, notification):
        notification['is_sent'] = True
        self.save_notifications()

    def send_notifications(self):
        due_notifications = self.get_due_notifications()
        for notification in due_notifications:
            # Logic to send notification (e.g., email, SMS, etc.)
            print(f"Sending notification: {notification['message']}")
            self.mark_as_sent(notification)

    def schedule_notification(self, message, days_from_now):
        notify_date = datetime.now() + timedelta(days=days_from_now)
        self.add_notification(message, notify_date)