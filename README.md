**_ProductHunt_**

Product Hunt is an online community platform where makers come to launch their products, and where consumers come to find the latest and greatest in tech. According to Product Hunt, the site "surfaces the best new products every day", and well, that's true.

**_Installation_**

- To install it first of all clone this repo by running the following command in terminal `git clone https://github.com/parteekdcrust/productHuntMongoDB.git`
  After cloning run the following command to install all the packages included in the project:-
  `npm i`
- After installing node packages create a file named
  `.env`
- In the .env file you should write the following code:
  `PORT= port no.`
- If u don't specify the port no. by default ur port no will be `5000`.

**_Connecting database_**

- If you are facing problem while connecting to the database with the following code `mongoose.connect("mongodb://localhost:27017/productHuntDB");`
  replace the localhost with `0.0.0.0` as done in the following line:
  `mongoose.connect("mongodb://0.0.0.0:27017/productHuntDB");`
