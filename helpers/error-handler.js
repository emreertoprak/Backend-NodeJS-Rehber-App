function errorHandler(err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        return res.status(401).json({message: "Geçersiz Token. (Unauthorized)"})
    }

    if(err.name === 'ValidationError'){
        return res.status(422).json({message: err})
    }

    return res.status(500).json(err);
}

module.exports = errorHandler;