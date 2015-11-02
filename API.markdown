Zotago REST API
===============

All API endpoints live under the `/api` route, so if an endpoint is listed as
`/accounts`, then the query should be made to `/api/accounts`.

Collections
===========

Accounts
--------

### `GET /accounts`

List all accounts.

Sell posts
----------

### `GET /sellposts`

List all sell posts.

### `POST /sellposts`

Create a new sell post.

#### Request body

```json
{
    "post": {
        "imageUrl": <string>,
        "description": <string>,
        "creatorId": <int>
    },
    "tags": [
        <name of a tag>,
        ...
    ]
}
```

The `imageUrl` attribute can be a base64-encoded data URI. If so, then the URI
is parsed, and the image is saved to an uploads folder with a unique ID. The
given URL is then overwritten with the URL for the uploaded image. The response
will include the generated URL.

Because an accounts system hasn't been built yet, simply use `"creatorId": 1`,
which will have been initialized to a dummy user by the seeder script.

#### Response body

Same as `GET /sellposts/:id` for the newly created id.

### `GET /sellposts/:id`

Give a detailed description of a sell post.

Tags
----

### `GET /tags`

List all tags.

#### Response body

```json
[
    {
        "id": <tag id>,
        "name": <tag name>,
        "metatags": [
            {
                "id": <metatag id>,
                "name": <metatag name>
            },
            ...
        ],
        "subtags": [
            {
                "id": <subtag id>,
                "name": <subtag name>
            },
            ...
        ]
    },
    ...
]
```

### `POST /tags`

Create a new tag.

#### Request body

```json
{
    "name": <tag name>,
    "tags": [
        <metatag name>,
        ...
    ]
}
```

#### Response body

```json
{
    "id": <tag id>,
    "name": <tag name>,
    "metatags": [
        {
            "id": <metatag id>,
            "name": <metatag name>
        },
        ...
    ],
    "subtags": [
        {
            "id": <subtag id>,
            "name": <subtag name>
        },
        ...
    ]
}
```

Want posts
----------

### `GET /wantposts`

List all want posts.

#### Query parameters

* `tags`: comma separated list of quoted strings which name tags that are used
to filter the want posts; each post must have all the given tags.

### `POST /wantposts`

Create a new want post.

#### Request body

Same as for `POST /sellposts`.

#### Response body

Same as `GET /wantposts/:id` for the newly created post id.

### `GET /wantposts/:id`

Give a detailed description of a want post.
