import requests
from django.conf import settings
from postmarker.core import PostmarkClient
from postmarker.models.emails import EmailManager, Email, EmailTemplate
from postmarker.models.base import Model
from postmarker.utils import chunks


class SMS(object):
    URL = 'http://smsc.ru/sys/send.php'
    LOGIN = settings.SMS_LOGIN
    PASSWORD = settings.SMS_PASSWORD

    def __init__(self):
        pass

    def send(self, msg, phones, time, tz):
        # phones has string values separated by ';' or ','
        # 'time': '0803210830' or '08.03.21 08:30'
        # 'tz': '0' or '2'
        try:
            msg = msg.encode('cp1251')
        except:
            pass
        params = {
            'login': self.LOGIN,
            'psw': self.PASSWORD,
            'sender': settings.SMS_SENDER,
            'phones': phones,
            'mes': msg,
            'time': time,
            'tz': tz,
        }
        resp = requests.post(url=self.URL, params=params)
        return resp


class EmailBatchWithTemplate(Model):
    """Gathers multiple emails in a single batch."""

    MAX_SIZE = 500

    def __init__(self, *emails, **kwargs):
        self.emails = emails
        super().__init__(**kwargs)

    def __len__(self):
        return len(self.emails)

    def as_dict(self, **extra):
        """Converts all available emails to dictionaries.

        :return: List of dictionaries.
        """
        return [self._construct_email(email, **extra) for email in self.emails]

    def _construct_email(self, email, **extra):
        """Converts incoming data to properly structured dictionary."""
        if isinstance(email, dict):
            email = Email(manager=self._manager, **email)
        elif not isinstance(email, EmailTemplate):
            print(type(email))
            raise ValueError
        email._update(extra)
        return email.as_dict()

    def send(self, **extra):
        """Sends email batch.

        :return: Information about sent emails.
        :rtype: `list`
        """
        emails = self.as_dict(**extra)
        responses = [self._manager._send_batch(*batch) for batch in chunks(emails, self.MAX_SIZE)]
        return sum(responses, [])


class PostmarkManager(EmailManager):

    def _send_batch(self, *emails):
        """Low-level batch send call."""
        print(emails)
        return self.call("POST", "/email/batchWithTemplates", data={'Messages': emails})


    def EmailBatch(self, *emails):
        """Constructs :py:class:`EmailBatch` instance.

        :return: :py:class:`EmailBatch`
        """
        return EmailBatchWithTemplate(*emails, manager=self)


postmark = PostmarkClient(server_token=settings.ANYMAIL["POSTMARK_SERVER_TOKEN"])
email_manager = PostmarkManager(client=postmark)
sms_manager = SMS()
