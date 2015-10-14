Zotago REST API
===============

All API endpoints live under the `/api` route, so if an endpoint is listed as
`/accounts`, then the query should be made to `/api/accounts`.

Collections
===========

Accounts
--------

### `/accounts`

List all accounts.

Sell posts
----------

### `/sellposts`

List all sell posts.

### `/sellposts/:id`

Give a detailed description of a sell post.

Tags
----

### `/tags`

List all tags.

Want posts
----------

### `/wantposts`

List all want posts.

#### Query parameters

* `tags`: comma separated list of quoted strings which name tags that are used
to filter the want posts; each post must have all the given tags.

### `/wantposts/:id`

Give a detailed description of a want post.
