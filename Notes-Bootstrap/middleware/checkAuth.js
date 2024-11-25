exports.isLoggedIn = ((req,res,next)=>{
    if(req.user){
        res.locals.user = true;
        next();
    }else{
        return res.status(401).send('Login to View');
    }
})