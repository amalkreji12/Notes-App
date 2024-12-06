exports.isLoggedIn = ((req,res,next)=>{
    if(req.user){
        res.locals.user = true;
        next();
    }else{
        return res.status(401).send('Login to View');
    }
})

// exports.isLoggedIn = ((req,res,next)=>{
//     if(req.user || req.session.user){
//         res.locals.user =req.user || req.session.user;
//         next();
//     }else{
//         return res.status(401).send('Login to View');
//     }
// })