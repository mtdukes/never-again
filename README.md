Never Again!
============

[Check out a demo here.](http://never-again.herokuapp.com)

**Never Again!** is a little web app that's meant to take some of the load off the data and tech teams of [The Texas Tribune](http://www.texastribune.org) and provide some basic capabilities to reporters. The hope is to make it easy for reporters to add basic forms of interactivity to their stories.

The easier it is == the more likely it will happen.

Currently attempting to adapt this app so we can do the same thing at [WRAL News](http://www.wral.com).

Caveats
-------

Currently, **Never Again!** is built to suit the Texas Tribune way of doing things. I plan to "de-Tribune" it in the near future so it's more generic, so others can pull it in and add their own customizations on top of the basic framework.

Installation
------------

Pretty easy. Clone the repository, then:

`pip install -r requirements.txt`

If you are running it locally, you can just use `python app.py`. If you have [Heroku](http://www.heroku.com) good to go on your machine, there is a prepared `Procfile` for when you shove it up to an instance.
