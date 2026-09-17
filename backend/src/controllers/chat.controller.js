const { generateStreamToken } = require("../config/stream");

async function getStreamTokenController(req, res) {
    try{
        const token = generateStreamToken(req.user._id);
        return res.status(200).json({token});

    }catch(err){    
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {getStreamTokenController};