# Twitter Clone

#### Running with docker

Steps to run with docker:

`
docker-compose up
`

Run test with docker:

`
docker-compose run web npm run test
`

#### Running without docker
* Make sure postgresql is installed.

* Install packages
`
npm install
`

* Add .env file with all enviroment variable. For reference see `env.example` file

* Run migrations
`
npm run migrate
`
* Start the server
`
npm run start
`

To run tests run `npm run test`

#### Postman Collection

Link: [https://www.getpostman.com/collections/ff6ec3aa0a40e5ecd640](https://www.getpostman.com/collections/ff6ec3aa0a40e5ecd640)

Variables are added to the collection itself without any environment set.

For authorization add authorization in collection and all the request will inherit it.
