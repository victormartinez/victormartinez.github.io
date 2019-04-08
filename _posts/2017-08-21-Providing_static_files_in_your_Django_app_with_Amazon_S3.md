---
layout: post
title: "Providing static files in your Django app with Amazon S3"
categories: [Web Development]
tags: [aws, django, python, s3, storage]
image: /assets/images/highlights/django_s3.png
---

It is well-known that Django does not provide static files. Using a WSGI Middleware to address the issue is not the right way to provide static files and, thus, this post show how you can do it using Amazon S3.


### Django backend storages

Django uses an architecture of backend storages to store data (e.g. the [FileSystemStorage](https://docs.djangoproject.com/en/1.11/ref/files/storage/) is responsible for saving files in the current file system). However, you might want to adopt a different approach and, thus, by following the [Storage Interface](https://docs.djangoproject.com/en/1.11/howto/custom-file-storage/) it is possible to implement your own way to handle storage. A project called [django-storages](https://github.com/jschneier/django-storages) has already thought about common problems and implemented for us a storage that send files to Amazon S3 with almost no effort required. Let's use it!

### Creating an Amazon S3 bucket
Go to Amazon S3, create a bucket with two folders inside: *static* and *media*. In this example it is assumed there is a public access for listing your S3 objects.

**Note:** In this post we talk about folders but it is just an abstraction. The [S3 documentation](http://docs.aws.amazon.com/AmazonS3/latest/UG/FolderOperations.html) explains that buckets and objects are the primary resources and there is no such hierarchy like a typical file system.

### Install the requirements
You will need to install the [boto](https://github.com/boto/boto3) and [django-storages](https://github.com/jschneier/django-storages) packages.

As explained before django-storages will help us to send files to Amazon S3. However, we need to install boto because it will provide the connection to amazon services.

**Note:** This post uses [python-decouple](https://github.com/henriquebastos/python-decouple) to manage local environments. If you do not know how to use it check this [post](/django/2017/08/15/Prepare_your_Django_app_to_be_deployed_at_Heroku.html).

### Creating our custom backends
In our configuration directory we will create the backends responsible to dealing with Amazon S3. Create a file called *s3util.py* and add the content below:

```python
from django.conf import settings
from storages.backends.s3boto import S3BotoStorage


class StaticStorage(S3BotoStorage):
    location = settings.STATICFILES_LOCATION


class MediaStorage(S3BotoStorage):
    location = settings.MEDIAFILES_LOCATION
```

* Lines 1-2: Import the modules.
* Lines 5-10: Represent our storages. The location attribute is set with the location of static and media files defined in the *settings.py* file.

### Configuring Amazon S3 variables
Assuming you already have an Amazon S3 bucket available, lets add some variables to *settings.py* file.

```python
from decouple import config

# AWS
AWS_S3_SECURE_URLS = True
AWS_QUERYSTRING_AUTH = False
AWS_PRELOAD_METADATA = True
AWS_STORAGE_BUCKET_NAME = '<YOUR-BUCKET-NAME>'
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID', default='')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY', default='')

STATICFILES_STORAGE = config('STATICFILES_STORAGE', default='django.contrib.staticfiles.storage.StaticFilesStorage')
DEFAULT_FILE_STORAGE = config('DEFAULT_FILE_STORAGE', default='django.core.files.storage.FileSystemStorage')

STATIC_URL = config('STATIC_URL', default='/static/')
MEDIA_URL = config('MEDIA_URL', default='/media/')

AWS_HEADERS = {
    'x-amz-acl': 'public-read',
    'Cache-Control': 'public, max-age=31556926'
}

STATICFILES_LOCATION = 'static'
MEDIAFILES_LOCATION = 'media'
```

* Line 1: Make sure you have imported the config module. It will look for the respective env variable and, in case of absence, it looks for an .env file (check this post).
* Line 4: Use secure SSL urls for serving objects from S3.
* Line 5: We don't want to generate S3 auth querystring.
* Line 6: We want to preload the S3 metadata.
* Line 7:  It is necessary to provide the bucket name you created at Amazon S3.
* Lines 8-9: Config will look for env vars or an .env file with those variables. In a local environment they will be blank because we will not send files to S3 in development mode. However, in production we will set those variables.
* Lines 11-12: Those variables will explicit define which storage our project will use to store the static files. In local environment the default value will the ordinary backend (StaticFilesStorage and FileSystemStorage). However, in production, we will set the backends responsible for sending the file to S3.
* Lines 14-15: Point to the static and media urls. In production they store the amazon s3 url that correspond to each type (static or media).
* Lines 17-20: AWS Headers that explicit our cache policy.
* Lines 22-23: Those variables tell our backend where are our media and static files. They are used in our s3util.py file.

### Local Variables
In a nutshell, our local variables will end up being:

```bash
AWS_S3_SECURE_URLS = True
AWS_QUERYSTRING_AUTH = False
AWS_PRELOAD_METADATA = True
AWS_STORAGE_BUCKET_NAME = 'BUCKET-NAME'
AWS_ACCESS_KEY_ID = ''
AWS_SECRET_ACCESS_KEY = ''

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

AWS_HEADERS = {
    'x-amz-acl': 'public-read',
    'Cache-Control': 'public, max-age=31556926'
}

STATICFILES_LOCATION = 'static'
MEDIAFILES_LOCATION = 'media'
```

### Production Variables
It is necessary to set the production variables.

```bash
heroku config:set AWS_ACCESS_KEY_ID='<YOUR-ACCESS-KEY>' -a <YOUR_APP>
heroku config:set AWS_SECRET_ACCESS_KEY='<YOUR-SECRET-KEY>' -a <YOUR_APP>
heroku config:set DEFAULT_FILE_STORAGE='config.s3util.MediaStorage' -a <YOUR_APP>
heroku config:set STATICFILES_STORAGE='config.s3util.StaticStorage' -a <YOUR_APP>
heroku config:set MEDIA_URL='https://s3.amazonaws.com/<YOUR-BUCKET-NAME>/media/' -a <YOUR_APP>
heroku config:set STATIC_URL='https://s3.amazonaws.com/<YOUR-BUCKET-NAME>/static/' -a <YOUR_APP>
```

**Note:** You can pass multiple variables in one declaration:

```bash
heroku config:set AWS_ACCESS_KEY_ID='<YOUR-ACCESS-KEY>' AWS_SECRET_ACCESS_KEY='<YOUR-SECRET-KEY>' ... -a <YOUR_APP>
```

### Sending files to S3
From now on every time you push your project to Heroku it will send the files to Amazon S3. That will happen because Heroku executes `$ python manage.py collectstatic` during the deploy pipeline and that command will collect the static files and save it. Once our production backend saves into S3 all files will be sent to the remote server.

If you are not using Heroku make sure you run `python manage.py collectstatic` in production.

**Note:** A test can be done locally by setting the production variables in the local environment. That way, if you run the collectstatic command it will send the files to S3. Just make sure to unset them after that.
