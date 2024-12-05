exports.isLoggedIn = ((req,res,next)=>{
    if(req.user || req.session.user){
        res.locals.user =req.user || req.session.user;
        //res.locals.user = JSON.parse(JSON.stringify(res.locals.user));
        next();
    }else{
        return res.status(401).send('Login to View');
    }
})