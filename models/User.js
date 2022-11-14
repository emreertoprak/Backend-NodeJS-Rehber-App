module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
      
        name: {
            type: DataTypes.STRING
        },
        surname: {
            type: DataTypes.STRING
        },
        status : {
            type: DataTypes.BOOLEAN,
            defaultValue : true
        },
        company: {
            type: DataTypes.STRING
        },
        password : {
            type : DataTypes.STRING
        }
     
    
    })

    return User

}