# Blog API

This is a simple Blog API that implements basic CRUD operations, user authentication and pagination. Only authenticated users can create, edit and delete blog posts and all users can create, edit and delete comments. This API was built using REST architecture.

## Link to Hosted API
- [https://myblogappapi.herokuapp.com/](https://myblogappapi.herokuapp.com)

## Link to published documentation
- [Postman API Docs](https://documenter.getpostman.com/view/15138887/UUxtDVom)

![Screenshot](BlogAPI.png?raw=true "Blog API")

## Technologies 

The following technologies were used in this project:

- [JavaScript](https://www.javascript.com/)
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/cloud/atlas)
- [JWT](https://jwt.io)
- [Heroku](http://heroku.com/)


## Requirements

Before starting, you need to have [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/) installed. Alternatively, you can download the code as a zip file.

You will also need to create a .env file at the root directory. Insert the following into the .env file:

    MONGO_URI=mongodb+srv://Admin:Test4321@cluster0.mv0lh.mongodb.net/myBlog?retryWrites=true&w=majority
    JWT_SECRET=mySecret

After creating the .env file, follow the steps below to run the server.


## Clone this project

    git clone https://github.com/benidevo/blog-api.git

## Install dependencies

    npm install

## Start server

    npm run server



# API DOCUMENTATION
The endpoints and responses are described below.

## Register User

### Request

`POST api/auth/register`

    curl -i -H 'Accept: application/json'

### Payload

    {
        "name": <string>,
        "email": <string>,
        "password": <string>
    }

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": {
            "userId": <string>,
            "name": <string>,
            "email": <string>,
            "token": <string>
        }
    }


## Login

### Request

`POST api/auth/login`

    curl -i -H 'Accept: application/json'

### Payload

    {
        "email": <string>,
        "password": <string>
    }

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": {
            "userId": <string>,
            "email": <string>,
            "token": <string>
        }
    }

## Change Password

### Request

`POST api/auth/change-password`

    curl -i -H 'Accept: application/json'

### Payload

    {
        "email": <string>,
        "oldPassword": <string>,
        "newPassword": <string>
    }

### Response

    {
        "message": <string>,
        "error": <boolean>,
    }


## Get all blog posts

### Request

`GET api/blog-posts`
`GET api/blog-posts?page={number}&?limit={number}`

    curl -i -H 'Accept: application/json'

    To take full advantage of the pagination functionality, use the following query params: page and limit.

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": {
            "totalPages": <number>,
            "currentPage": <number>,
            "posts": [
                {
                    "author": <string>,
                    "title": <string>,
                    "body": <string>,
                    "comments": <list>,
                    "createdAt": <string>,
                    "updatedAt": <string>,
                    "id": <string>"
                },
                {
                    "author": <string>,
                    "title": <string>,
                    "body": <string>,
                    "comments": <list>,
                    "createdAt": <string>,
                    "updatedAt": <string>,
                    "id": <string>,
                },
                ....
            ]
        }
    }


## Get post by ID

### Request

`GET api/blog-posts/:blogId`

    curl -i -H 'Accept: application/json'

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": {
            "author": <string>,
            "title": <string>,
            "body": <string>,
            "comments": <array>,
            "createdAt": <string>,
            "updatedAt": <string>,
            "id": <string>
        }
    }


## Create blog post

### Request

`POST api/blog-posts`

    curl -i -H 'Accept: application/json', 'Authorization: <token: string>'

### Payload

    {
        "title": <string>,
        "body": <string>
    }

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": {
            "title": <string>,
            "body": <string>,
            "comments": <array>,
            "createdAt": <string>,
            "updatedAt": <string>,
            "id": <string>
        }
    }


## Update blog post

### Request

`PUT api/blog-posts/{blogId}`

    curl -i -H 'Accept: application/json', 'Authorization: <token: string>'

### Payload

    {
        "title": <string>,
        "body": <string>
    }

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": {
            "title": <string>,
            "body": <string>,
            "comments": <array>,
            "createdAt": <string>,
            "updatedAt": <string>,
            "id": <string>
        }
    }


## Delete blog post

### Request

`DELETE api/blog-posts/{blogId}`

    curl -i -H 'Accept: application/json', 'Authorization: <token: string>'

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": <object>
    }


## Add comment to a blog post

### Request

`POST api/blog-posts/{blogId}/comments`

    curl -i -H 'Accept: application/json'

### Payload

    {
        "author": <string>,
        "comment": <string>
    }

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": {
            "author": <string>,
            "comment": <string>,
            "createdAt": <string>,
            "updatedAt": <string>,
            "post": <string>,
            "id": <string>
        }
    }


## Get single comment on a blog post

### Request

`GET api/blog-posts/{blogId}/comments/{commentId}`

    curl -i -H 'Accept: application/json'

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": {
            "author": <string>,
            "comment": <string>,
            "createdAt": <string>,
            "updatedAt": <string>,
            "id": <string>,
        }
    }


## Get all comments on a blog post

### Request

`GET api/blog-posts/{blogId}/comments`

    curl -i -H 'Accept: application/json'

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": [
            {
            "author": <string>,
            "comment": <string>,
            "createdAt": <string>,
            "updatedAt": <string>,
            "id": <string>
            },
            {
            "author": <string>,
            "comment": <string>,
            "createdAt": <string>,
            "updatedAt": <string>,
            "id": <string>
            }
            ...
        ]
    }


## Edit comment on a blog post using the comment ID

### Request

`PUT api/blog-posts/{blogId}/comments/{commentID}`

    curl -i -H 'Accept: application/json'

### Payload

    {
        "author": <string>,
        "comment": <string>
    }

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": {
            "author": <string>,
            "comment": <string>,
            "createdAt": <string>,
            "updatedAt": <string>,
            "post": <string>,
            "id": <string>
        }
    }
    
## Delete comment on a blog post using the comment ID

### Request

`DELETE api/blog-posts/{blogId}/comments/{commentId}`

    curl -i -H 'Accept: application/json'

### Response

    {
        "message": <string>,
        "error": <boolean>,
        "data": <object>
    }
