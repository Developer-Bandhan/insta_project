import jwt from 'jsonwebtoken'



const isAuthenticated = async (req, res, next) => {
try {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: 'User not authenticated',
            success: false
        })
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if(!decode){
        return res.status(401).json({
            message: 'Invalid',
            success: false
        })
    }
    req.id = decode.userId;
    next()

} catch (error) {
    console.log(error); 
}

}
 
export default isAuthenticated;







/*  --- isAuthenticated ---

  1. prothome amra token niye asbo, token 'req.cookies.token' er modhe token thake, tarpor amra check korbo jdi token
     ache kina, jdi token na thake tahole user authenticated noy. 
     
  2. token peye gelei j logedin user seta nao hote pare, cookie te token change o kore dite pare, tai amader SECRET_KEY er 
     sathe verify kori, amra etar jonno jwt.verify() method use kori, r ei method a token r SECRET_KEY pass kori, 
     
     tarpor jdi decode na thake tahole res.status a invalid token send korbo.
   
  3. tarpor amra req.id variable a token value te store kora userId store korbo, jeta decode er modhe thakbe tai decode.userId likhlam,
     
      tarpor next() k call korbo
      
*/