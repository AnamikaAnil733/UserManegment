export const isAdmin = (req,res,next)=>{
    if(req.usser?.role!=='admin'){
        return res.status(403).json({message:"Its Admin only"})
    }
    next()
}