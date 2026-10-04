

export const getCurrentUser = (req,res)=>{

    try {
        return res.status(200).json({success:true,message:"Current User",user:req.user})
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}