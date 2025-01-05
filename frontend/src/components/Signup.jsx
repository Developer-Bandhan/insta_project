import React, { useEffect, useState } from 'react'
import instaimg from '../assets/Instagram-Wordmark-White-Logo.wine.png';
import { Label } from './ui/label';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';



const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store => store.auth);
    const navigate = useNavigate();


    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:5000/api/v2/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate('/login')
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
            if(user){
               navigate('/home')
            }
        },[])


    return (
        <div className='flex bg-zinc-950 items-center justify-center w-screen h-screen pt-5 sm:pt-0'>
            <form onSubmit={signupHandler} className='w-full sm:w-[23rem] sm:h-[28rem] px-3 sm:px-0 mb-20 text-white' >
                <div className='w-full h-[95%] sm:w-full sm:h-full border-0 sm:border sm:border-zinc-800'>
                    <div className='w-full flex items-center justify-center flex-col'>
                        <img className='w-[12rem]' src={instaimg} alt="" />
                    </div>
                    <div className='mx-7 flex flex-col'>
                        <Label>Username</Label>
                        <input
                            type="text"
                            name='username'
                            value={input.username}
                            onChange={changeEventHandler}
                            className='bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-zinc-500 mt-3 rounded-sm p-[7px]'
                        />
                    </div>
                    <div className='mx-7 mt-5 flex flex-col'>
                        <Label>Email</Label>
                        <input
                            type="email"
                            name='email'
                            value={input.email}
                            onChange={changeEventHandler}
                            className='bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-zinc-500 mt-3 rounded-sm p-[7px]'
                        />
                    </div>
                    <div className='mx-7 mt-5 flex flex-col'>
                        <Label>Password</Label>
                        <input
                            type="password"
                            name='password'
                            value={input.password}
                            onChange={changeEventHandler}
                            className='bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-zinc-500 mt-3 rounded-sm p-[7px]'
                        />
                    </div>
                    {
                        loading ? (
                            <div className=' mx-7 mt-16 sm:mt-5 flex justify-center '>
                                <Button className='bg-[#4d97f8] w-full hover:bg-[#1877F2]'>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </Button>
                            </div>
                        ) : (
                            <div className=' mx-7 mt-16 sm:mt-5 flex justify-center '>
                                <Button type="submit" className='bg-[#4d97f8] w-full hover:bg-[#1877F2]'>Sign up</Button>
                            </div>
                        )
                    }

                </div>
                <div className="bottom w-full h-[4rem] bg-zinc-950 border-0 sm:border sm:border-zinc-800 mt-3 flex items-center justify-center">
                    <p>Have an account? <Link to="/login" className='text-blue-500'>Login</Link></p>
                </div>

            </form>
        </div>
    )
}

export default Signup


{/*  --- notes ---
    1. input field theke value get korar jonno useState use korbo, useState er vetore object er modhe
       username, email, password a empty string add korbo. sathe input field a value dite hobe, jeta input 
       state variable theke asbe, ex: value={input.username}
    
    2. tarpor input a onChange event lagabo, jar modhe acta function likhbo jeta opore define kora thakbe
     
        const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
       }
        
       The changeEventHandler function is designed to dynamically update the state of form input fields whenever 
       their values change. It uses the setInput function to modify the input state object. The { ...input } syntax 
       copies all the existing key-value pairs from the current state, ensuring no data is lost. The [e.target.name] 
       dynamically selects the key based on the name attribute of the input field, while e.target.value captures the 
       new value entered by the user. This way, the function efficiently updates the specific field's value in the 
       state without altering others, making it suitable for managing forms.

    3. tarpor from er action delete kore debo tarpor okhane onSubmit use korbo er vetor acta function likhbo, jeta amra opore
       define korbo, etake async banabo karon etar vetor API call korbo etar parameter a event (e) receive korbo, 
       
       tarpor er vetore e.preventDefault() function likhbo, eta na likhle from submit korar por refresh hoye jabe, amra data pabo 
       na, eta from er default bheavior stop kore day. 

       tarpor try catch block use korbo, karon etate backend a push korbo

       tarpor axios install korbo, Axios ekta JavaScript library, ja HTTP requests korar jonno use hoy. Eita mainly API theke data 
       fetch kora (GET request) ba server e data pathanor (POST request) moto kaj gulo efficiently manage kore. Axios promises-based 
       architecture use kore, mane asynchronous operations handle korte pare, ja API calls asynchronous rakhe.

       Eta user ke server theke JSON data nite ba pathate help kore, ebong headers set kora, query parameters add kora, and authentication 
       manage kora onek easy kore. Axios er aro ekta boro advantage holo cross-browser compatibility, mane modern ebong purono browser e 
       same behave kore. Eita error handling er shubidha o dei, karon response er success ba failure easily check kora jay.

       tarpor amra const res hisebe axios.post method pathabo api url ta likhbo
       
       
       tarpor toast er jonno shadcn/ui theke sonner install korbo, 

       const res = await axios.post('http://localhost:5000/api/v2/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
    
        Ei code snippet ekta HTTP POST request pathay http://localhost:5000/api/v2/user/register endpoint e, user er registration data server e pathanor 
        jonno. axios.post function ta use kore user er input object server e request body hisebe pathay. Server ke inform kora hoy je data JSON format e 
        (Content-Type: application/json), ebong cookies ba authentication credentials er sathe request send kora enable kora hoy (withCredentials: true). 
        Response ta res variable e store hoy, jeta user ke server theke response data access korte help kore.

        Request Initiate: axios.post ekta asynchronous POST request send kore. Second parameter hisebe input object use hoy, ja API endpoint e data pathay.
        Header Configuration: headers diye server ke bole je request body JSON format e ache, jate server parsing korte pare.
        Credentials Send: withCredentials: true cross-origin requests er sathe cookies ba tokens send kore authentication ensure kore.
        Await Use: await ensure kore je POST request complete howar por response ta res variable e assign hobe, mane synchronous bhabe response ta handle kora hoy.
        Server Response: Server theke je response ashe, seta res variable e store hoy, jeta pore use kora jay success ba error handling er jonno.

    4. if (res.data.success) {
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }

        Ei code snippet user ke success notification dekhay ebong input field reset kore, jokhon server theke response success hoy. Server theke je response ashe (res.data), 
        tar moddhe success property check kora hoy. Jodi eta true hoy, tahole user ke success message (res.data.message) toast.success diye show kora hoy. Tarpor setInput 
        function diye input fields gulo empty string diye reset kore, jate user form abar fill korte pare.
        res.success ta backend theke pathano hoche. 

    5. toast er jonnno shadcnUI theke sooer install korbo, tarpor main.jsx a App component er sathe <Toster/> add korbo, 
       tarpor amra (toast.success(res.data.message);) eokom vabe toast add korte parbo. r error show korar jonno 
       ei line ta likhbo, (toast.error(error.response.data.message);).

    6. loading show korar jonno amra prothome acta useState hook nebo (const [loading, setLoading] = useState(false);) 
       tarpor try catch er vetore try block er vetore setLoading true korbo tarpor catch block er pore acta finally{} block korbo
       tar vetore setLoding false korbo, finally sob khetre cholbe, try block cholleo cholbe r catch block cholleo finally cholbe
       tai amra finally te add korechi,

       tarpor loading show korar jonno condition lagabo, loding? mane true hole loding show korbe noyto onno kichu show korbe, 
       loading er icon ta shadch ui er lushid-react theke <Loder2/> component import korbo tarpor button component er vetore rakhbo <loader2/>.
       tarpor ota true hole define korbo... noyto baki time a normal button render hobe

    7. signup page theke login page a pathanor jonno Link tag use korbo, jeta react-router-dom theke asbe... 
       ex: <p>Have an account? <Link to="/login" className='text-blue-500'>Login</Link></p>
    
    8. login hoye jawar por home page a redirect korte useNavigate() hook use korbo, age eta require kore nebo
       const navigate = useNavigate() erokom vabe, tarpor jekhane use korte hobe sekhane 
       navigate('/home') erokom vabe likhbo. 





       tarpor alada alada page a jawar jonnno react-router dom install korbo... tarpor app.jsx a set korbo routes


    */ }