Zotago REST API
===============

All API endpoints live under the `/api` route, so if an endpoint is listed as
`/accounts`, then the query should be made to `/api/accounts`.

Authorization
=============

Certain verbs of endpoints require authorization. Auth is provided by Zotago
tokens, which are obtained by using the login and register endpoints.

Once a token has been obtained, endpoints requiring authorization can be
accessed by adding an appropriate HTTP Authorization header.

```
Authorization: Zotago TOKEN
```

Special endpoints
=================

### `GET /image`

Fetch images from an image search backend.

#### Query parameters

* `q`: the query string to give to the image search backend.

### `GET /me`

Fetches the information of the account that is authenticated by the provided
token.

Authentication
==============

### `POST /auth/login`

Logs in to an account.

#### Request body

The format of the request body varies from one authorization scheme to the
next. What all of them have in common is a field named `method` whose value is
the name of the authorization scheme to use.

Here is the format for each supported authorization scheme.

##### Facebook

```json
{
    "method": "facebook",
    "shortToken": <short-lived Facebook token>
}
```

#### Response body

```json
{
    "accessToken": <a Zotago access token to use in privileged API calls>
}
```

### `POST /auth/register`

Creates a new account.

#### Request body

The format of the request body varies as in the request body for the `POST
/auth/login` endpoint.

Here is the format for each supported authorization scheme.

##### Facebook

```json
{
    "method": "facebook",
    "shortToken": <short-lived Facebook token>,
    "username": <the username associated with the new account>
}
```

Collections
===========

The following endpoints concern the actual data that is used in the
application.

Accounts
--------

### `GET /accounts`

List all accounts.

### `GET /accounts/:id`

Gets detailed account information for a user.

Sell posts
----------

### `GET /sellposts`

List all sell posts.

#### Query parameters

* `tags`: comma separated list of quoted strings which name tags that are used
to filter the want posts; each post must have all the given tags.

* `creator`: a number giving the ID of the account that created the post.

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

#### Response body

```json
{
    "post": {
        "id": <post id>,
        "imageUrl": <image URL>,
        "description": <post description>,
        "creatorId": <id of post creator>
    },
    "tags": [
        {
            "id": <tag id>,
            "name": <tag name>
        },
        ...
    ],
    "offers": [
        <post object of opposite type>,
        ...
    ],
    "followers": [
        <account object>,
        ...
    ],
    "creator": <account object>
}
```

### `PUT /sellposts/:postId/followers/:accountId`

Makes an account follow a post.

### `DELETE /sellposts/:postId/followers/:accountId`

Makes an account unfollow a post.

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

List all want posts in short form.

#### Query parameters

* `tags`: comma separated list of quoted strings which name tags that are used
to filter the want posts; each post must have all the given tags.

* `creator`: a number giving the ID of the account that created the post.

#### Response body

```json
[
    {
        "id": <post id>,
        "imageUrl": <post image URL>,
        "description": <post description>,
        "creator": <post creator>,
        "tags": [
            <tag>,
            ...
        ]
    },
    ...
]
```

### `POST /wantposts`

Create a new want post.

#### Request body

Same as for `POST /sellposts`.

#### Response body

Same as `GET /wantposts/:id` for the newly created post id.

### `GET /wantposts/:id`

Give a detailed description of a want post.

### `GET /wantposts/:id/offers`

Get the offers associated with a want post.

#### Response body

Produces a list of basic sell posts.

```json
[
    {
        "id": <post id>,
        "imageUrl": <post image URL>,
        "description": <post description>,
        "externalUrl": <null or a URL to an external site>,
        "creator": <account object>,
        "tags": [
            <tag>,
            ...
        ]
    }
]
```

### `POST /wantposts/:id/offers`

Offers a sell post to a want post.

#### Request body

```json
{
    "postId": <id>
}
```

#### Response body

Same as `GET /wantposts/:id`.

### `PUT /wantposts/:postId/followers/:accountId`

Makes an account follow a post.

### `DELETE /wantposts/:postId/followers/:accountId`

Makes an account unfollow a post.
