---
layout: post
title: "Prepare your Django app to be deployed at Heroku"
category: Web Development
date: "2017-08-15T00:00:00"
tags: [deploy, django, heroku, paas, python]
image: featured.png
language: en
---

It is really exciting to build our own projects and see it working on production environment, right? Some developers might think deploying a Django app to a server is a nightmare. In this post I will show how to prepare your application to have different configurations and deploy it to Heroku.

**Requirements:** You must install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and **GIT**.

## Heroku

[Heroku](http://www.heroku.com) is the PaaS that will host our project. Go to the dashboard and create your new app. Go to the [dashboard](https://dashboard.heroku.com/apps) and create your new app.

Once you have created you app, it is necessart to use the terminal to set up your credentials. We need the Heroku CLI to access the app settings (check the [docs](https://devcenter.heroku.com/articles/heroku-cli) to install it properly).

After installing you can login:

```bash
heroku login
heroku addons:create heroku-postgresql:<your-plan-name> -a <your-application-name>
```

Later on we will use a PostgreSQL. Heroku helps us to provide a pg database by running the command. It is quite easy and you can learn about that in the [docs](https://devcenter.heroku.com/articles/heroku-postgresql#provisioning-heroku-postgres).

**Hint:** The command `$ heroku apps` is very handy and allows us to see the apps we have.

## Preparing our application

When it comes to managing local and production environments I like to use [python decouple](https://github.com/henriquebastos/python-decouple) because it allows me to use env vars and, thus, to have different configurations. Plus, I use [dj_database_url](https://github.com/kennethreitz/dj-database-url) to make it easy to use different databases with a single configuration string.

1\. At first, create two files: _.env_ and _.env-sample_. The first will be used in our local environment and must be ignored by GIT. The second works as a template:

```bash
SECRET_KEY=YOUR_KEY_GOES_HERE
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost,.herokuapp.com
```

2\. Open your _settings.py_, import the modules we will use and use the configuration bellow:

```python
from decouple import config, Csv
from dj_database_url import parse as dburl

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default=[], cast=Csv())

DEFAULT_DBURL = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')
DATABASES = {
    'default': config('DATABASE_URL', default=DEFAULT_DBURL, cast=dburl)
}
```

The first two lines import the module while the other just load the values using python-decouple lib. The `cast` parameter is mandatory because Python will treat the .env file content as string and it is important to cast the value to the proper data type.

Pay attention to the `DEFAULT_DBURL` and `DATABASES` variables. The first uses an Sqlite in the local environment but in Heroku we will configure it to store the Postgres configuration url.

## Deploying to Heroku

We have created our app in Heroku, attached a Postgres database and configured the settings to accept different configuration strings. Now it is time to deploy our application!

###### Make sure your requirements.txt file contains all dependencies

It must have, at least: _dj-database-url_, _gunicorn_, _psycopg2_, _python-decouple_ and _pytz_. This file is extremely important because Heroku looks for the requirements file to install the dependencies.

###### Create a Procfile in the app root directory

```bash
web: gunicorn <app>.wsgi --log-file -
```

A Procfile (yes, without any extension) tells Heroku how to run your application. Pay attention that **<app>** must be replaced by the directory your **wsgi** file is placed. Run the command locally to make sure it is correct.

###### Create runtime.txt in the app root directory

```
python-3.6.1
```

The file will tell to Heroku which version of python our project uses.

###### Configure your production env vars

Do you remember that our **settings.py** looks for an **.env** file? Well, **python-decouple** respect the environment variables precedence over **config** files. Thus, if there is an env var set in production the config directive will not look for an .env file.

For each key in _.env_ file we will use the _Heroku CLI_ to set the env var in production. We need to setup four variables: **SECRET_KEY**, **DEBUG**, **ALLOWED_HOSTS** and **DATABASE_URL**. Open the terminal and execute:

```bash
heroku config:set SECRET_KEY='<YOUR_SECRE_KEY>' -a <YOUR_APP>
heroku config:set DEBUG=False -a <YOUR_APP>
heroku config:set ALLOWED_HOSTS=127.0.0.1,localhost,.herokuapp.com -a <YOUR_APP>
heroku config:set DATABASE_URL='<YOUR_DATABASE_URL>' -a <YOUR_APP>
```

**Notes:**

1. SECRET_KEY is surrounded by single quotes because we have to explicitly define it as a string to heroku;
1. replace <YOUR_APP> by your app name;
1. the string _.herokuapp.com_ must be in ALLOWED_HOSTS otherwise Django will not be executed in Heroku.

**How to find the DATABASE_URL?** Go to your app dashboard > Resources > Heroku Postgres Database. A new tab will open and allow you to check your DATABASE CREDENTIALS.

###### Deploy your app

In your Heroku app dashboard will contain instructions to deploy it. By using git you can deploy it easily:

```bash
heroku git:remote -a <YOUR_APP_NAME>
git push heroku master
```

## Troubleshooting

If you face any problems just check the terminal because Heroku shows expressive messages that can help you. For example, during the deploy I got the message below:

```
remote:        django.core.exceptions.ImproperlyConfigured: You're using the staticfiles app without having set the STATIC_ROOT setting to a filesystem path.
remote:
remote:  !     Error while running '$ python manage.py collectstatic --noinput'.
remote:        See traceback above for details.
remote:
```

By checking that I realized I forgot to set the STATIC*ROOT variable in \_settings.py* and install a WSGI middleware to provide the static files.

**Note:** Django is not meant to provide static files. Use AWS S3 to do that for production-ready projects.

That's all folks!
