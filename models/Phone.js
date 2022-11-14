module.exports = (sequelize, DataTypes) => {

    const Phone = sequelize.define("phone", {
        number: {
            type: DataTypes.STRING
        }
        
    
    })

    return Phone

}