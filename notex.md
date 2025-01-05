1. amra prothome backend setup korbo, 
2. backend setup korar jonno 'npm init -y' run korte hobe 
3. tarpor amra packeges install korbo --- npm i express, mongoose, jsonwebtoken, bcrypt, cookie-parsor, cors.

[
--- Express
Express is a lightweight and fast web framework for Node.js used to create servers and develop APIs. It simplifies handling HTTP requests like GET, POST, PUT, and DELETE and supports routing and middleware integration for request processing.

--- Mongoose
Mongoose is an ODM (Object Data Modeling) library for MongoDB. It facilitates database management by providing a schema-based approach, making it easier to define models and perform CRUD operations in MongoDB.

--- jsonwebtoken
jsonwebtoken is used to generate and verify JSON Web Tokens (JWT). It is widely used for implementing secure authentication and authorization systems in web applications by encoding user data into tokens.

--- bcryptjs
bcryptjs is a library for hashing and verifying passwords securely. It ensures sensitive data like passwords are stored as hashes, making it difficult for attackers to retrieve the original password.

--- cookie-parser
cookie-parser is a middleware that parses cookies in incoming HTTP requests. It helps in managing cookies, which are often used for storing session data or small amounts of user information.

--- cors
cors (Cross-Origin Resource Sharing) is used to enable or configure cross-origin requests. It allows servers to handle requests from different domains, which is essential for frontend-backend communication.

]




4. tarpor amra package.json a "type": "module", add korbo er madhome amra react er moto import use korte parbo. jokhon amra kno file k import korbo last a '.js' use korte hobe noyto error asbe. 

//// index.js ////

5. tarpor amra express, cors, cookieParser import kore nilam.

 import express, { urlencoded } from 'express'
 import cors from 'cors'
 import cookieParser from 'cookie-parser'


6. tarpor amra ei line gulo likhlam 
   app.use(express.json());
   app.use(cookieParser());
   app.use(urlencoded({extended: true}))

   --- app.use(express.json());

    --Purpose: This line configures the Express application to parse JSON data. When the client sends JSON data, it makes that data available in req.body.
    --Why it's necessary: It allows the API to properly receive and process JSON data sent by the client.


   ---app.use(cookieParser());

    --Purpose: This parses the cookies from incoming HTTP requests and stores them in req.cookies.
    --Why it's necessary: Cookies are used to store small pieces of data, such as login information. This middleware helps access and work   with cookies in requests.


   ---app.use(urlencoded({ extended: true }));

    --Purpose: This line configures Express to parse URL-encoded data (typically coming from HTML forms). Setting extended: true allows parsing of complex data structures like JavaScript objects.
    --Why it's necessary: It is used to handle form data sent via application/x-www-form-urlencoded, which is common in HTML forms.


7. const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOption));

  ---const corsOption = { origin: 'http://localhost:5173', credentials: true }
    --Purpose: This line defines the CORS (Cross-Origin Resource Sharing) options. It specifies which origin (domain) is allowed to access the resources of the server.
    --origin: 'http://localhost:5173': This indicates that only requests coming from http://localhost:5173 are allowed to access the server’s resources.
    --credentials: true: This allows cookies, HTTP authentication, and client-side certificates to be sent with requests from the allowed origin.

   ---app.use(cors(corsOption));
    --Purpose: This line uses the CORS middleware with the options defined earlier. It tells Express to apply the CORS settings to incoming requests.

  * Why it's necessary:
     * CORS is essential for security: By default, browsers block cross-origin requests for security reasons. This configuration allows your server to specify which origins (domains) are allowed to interact with the server’s resources.
     * In a development environment, the frontend might run on one port (e.g., localhost:5173), while the backend runs on another (e.g., localhost:4000). This configuration ensures that the frontend can make API requests to the backend without running into CORS-related errors.

8. app.get('/', (req, res) => {
    return res.status(200).json({
        message: "I'm coming from backend.",
        success: true
    })
})

---return res.status(200).json({ message: "I'm coming from backend.", success: true })
  --Purpose: Sends a JSON response back to the client with the following:
  --status(200): Sets the HTTP status code to 200, indicating a successful request.

---.json(): Sends a JSON response with two fields:
  --message: A string that contains a message "I'm coming from backend.".
  --success: A boolean true, indicating that the request was successful.
  
  


9. amader packege.json code a script change korte hobe...
     "scripts": {
    "dev": "nodemon index.js"
  }, 
     eta korle amra 'npm run dev' run kore server start korte pari, eta react use korar somoy kaje lage



10. tarpor amra mongodb atlus a database create korbo 

11. tarpor npm i dotenv ' dotenv install korbo ' dotenv index.ja(main) file a require korar jonno ' dotenv.config({}); ' ei line ta likhte hobe.
dotenv.config({});

12. tarpor acta utils folder banabo tar vetore db.js folder banabo, ei file a detabase connect korbo 

   database connect korar jonno prothome db.js file a mongoose import korbo, async function create kore try catch block use korbo, tarpor
        await mongoose.connect('mongodb://127.0.0.1:27017/instagram_clone') 
        tarpor ei line ta likhbo 

tarpor index.js file a app.listen er vetore ' connectDB(); ' call korbo connect korar jonno, tar age amader index.js file a db.js file import korte hobe, r db.js file er modhe must .js lagate hobe noyto error debe

13. tarpor amra model create korbo, tai backend folder a models  name er acta folder create korlam, tar vetore user_models.js  namer acta file 

14. tarpor file tar modhe mongoose import korlam, tarpor schema create korlam, 

15. tarpor post schema banabo 
16. tarpor sob schema gula banabo

17. tarpor controllers folder banabo, setate user_controllers.js file banabo


20. tarpor post_controller banabo





