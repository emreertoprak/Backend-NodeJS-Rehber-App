const db = require('../models')
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');
//require('dotenv').config();

// create main Model
const User = db.users
const Phone = db.phones

// 1. create user

const addUser = async (req, res) => {

    const infoUser = {
        name: req.body.name,
        surname: req.body.surname,
        company: req.body.company,
        password: bcrypt.hashSync(req.body.password,10)
    }
    const user = await User.create(infoUser)

    const numberArray = req.body.numbers

    numberArray.forEach(async element => {
        const infoPhone = {
            user_id : user.dataValues.id,
            number : element
        }
        const phone = await Phone.create(infoPhone)
    });
    res.status(200).send(user)
}

// 2. get all Users

const getAllUsers = async (req, res) => {

    const users = await User.findAll({  include: [{
        model: Phone,
        as: 'phone'
    }], 
    where  : {status : 1}})
    res.status(200).send(users)
}

// 3. update User

const updateUser = async (req, res) => {

    const id = req.params.id
    if (req.userId != id) {
        return res.status(403).send({
          message: "You Cant update this user"
        });
      }
      const checkUser = await User.findOne({where: { id: id }})
   if(!checkUser) { 
       return res.status(403).send({
        message: "User cant found"
        });
   }
    const name = req.body.name
    const surname = req.body.surname
    const company = req.body.company
    const numberArray = req.body.numbers

    const user = await User.update(
        {name : name , surname : surname , company : company},
         { where: { id: id },
        returning:true
        }).then(async res=>{
           return await User.findByPk(id)
        })

         numberArray.forEach(async element => {
            const phone = await Phone.update({number : element.number}, {where : {id : element.id}})
        })
    res.status(200).send(user)

}

// 4. delete user by id

const deleteUser = async (req, res) => {

    if (req.userId != req.params.id) {
        return res.status(403).send({
          message: "You Cant update this user"
        });
      }
    const id = req.params.id
    
    //await User.destroy({ where: { id: id }} )

   const user = await User.update({status: false} ,{ where: { id: id }})

    res.status(200).send(user)

}

//5. find user by name surname company phone
const findUser = async (req, res) => {

    const searchQuery = req.query.search
    const Op = Sequelize.Op;
    const user = await User.findAll({
    include: [{
        model: Phone,
        as: 'phone'
    }],
    where: {
        [Op.or]: [
     { name: { [Op.like]: '%' + searchQuery + '%' }},
     { surname: { [Op.like]: '%' + searchQuery + '%' }},,
     { company: { [Op.like]: '%' + searchQuery + '%' }},
     { '$phone.number$' : {[Op.like]: '%' + searchQuery + '%' }},
     Sequelize.where(Sequelize.fn('concat', Sequelize.literal('name'),' ',Sequelize.literal('surname')), {
        [Op.like]: '%' + searchQuery + '%'
      }),
    ]
    }
  });
    res.status(200).send(user)

}

const loginUser = async (req, res) => {

    const user = await User.findOne({where: { name: req.body.name }})
    const secret = process.env.secret
    if(!user) {
        return res.status(401).send('Kullanıcı Bulunamadı')
    }
    if(user && bcrypt.compareSync(req.body.password, user.password)){
       const token = jwt.sign(
        {
            userId: user.id
        },
        secret,
        {expiresIn: '1d'}
    )
        res.status(200).send({name: user.name, token: token, id: user.id, })
    } else {
        res.status(400).send('Kullanıcı Şifresi Hatalı')
    }
}

module.exports = {
    addUser,
    getAllUsers,
    updateUser,
    deleteUser,
    findUser,
    loginUser
}
