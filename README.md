# Bootstrapify 4

Bootstrapify 4 ~~is~~ _was_ going to be a complete rebuild of the popular Shopify theme framework ready for Bootstrap 4.
However while in development we realised two things:

1. Shopify's version of sass would mean that we can't use Bootstrap 4, unless we compiled locally.
2. Bootstrap is not always the right tool for the job.

But we wanted to release this anyway.
Don't despair because it is stable-ish and has successfully been used [in](http://www.liannbellis.co.nz/) [the](http://www.laineehermsen.co.nz/) [wild](http://www.phd.co.nz/).

So if it is the right _tool_ for your job then you are more than welcome to use it, and if you do then let us know because we'd like to see what you've done.

## Setup

1. Clone the bsify4 repo

        git clone https://github.com/luciddesign/Bootstrapify-4.git

2. Install dependencies

        bundle && npm install && bower install

3. Profit!

## Workflow

Run `gulp`. That is all.

Want a zipped file of just the theme to upload to shopify? Run `gulp build`.









******

Class names and Id's use dashes: my-class
Liquid variables and includes use underscores: my_snippet
