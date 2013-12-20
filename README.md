Never Again! // WRAL version
============

[Check out a demo here.](http://wral-tables.herokuapp.com)

Thanks to Ryan Murphy at the [The Texas Tribune](http://www.texastribune.org), we've modified his awesome, open-source Web app called **Never Again!** to make it easy for WRAL Web editors to add basic add-ons for stories.

To-do
------------
* Figure out how to get tablesorter.js integrated with require.js so we can embed sortable tables in our CMS
* Add Q&A dropdown feature
* Add selectable map feature
* Add timeline.js code generator

Installation (courtesy of [Ryan Murphy](http://www.github.com/rdmurphy))
------------

Pretty easy. Clone the repository, then:

`pip install -r requirements.txt`

If you are running it locally, you can just use `python app.py`. If you have [Heroku](http://www.heroku.com) good to go on your machine, there is a prepared `Procfile` for when you shove it up to an instance.
