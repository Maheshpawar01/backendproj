const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


const dataFilePath = path.join(__dirname, '../UserDataBase.json');

function readDataFromFile(){
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

function writeDataToFile(data){
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}
router.get('/users', (req, res)=>{
    const users = readDataFromFile();
    res.send(users)
});

router.get('/users/:id', (req, res)=>{
    const users = readDataFromFile();
    const userId = req.params.id;
    
    const user = users.find(user => user.id === parseInt(userId));
    if(user){
        res.send(user);
    }else{
        res.status(404).send({
            error:'User not found'
        })
    }
});

router.post('/users', (req, res)=>{
    const user = req.body;
    // console.log('user', user)

    const users = readDataFromFile();
    user.id = new Date().getTime();

    // console.log('user', user)

    users.push(user);
    writeDataToFile(users)
    

    res.send(user)
})
router.put('/users/:id', (req, res)=>{
    const users = readDataFromFile();
    const userId = req.params.id;
    const updateUser = req.body;
    
    const userIndex = users.findIndex(user => user.id === parseInt(userId) )
    if(userIndex != -1){
        users[userIndex] = {
            ...users[userIndex],
             ...updateUser,

        }
        writeDataToFile(users)
        res.send(users[userIndex])
    }else{
        res.status(404).send({
            error:'User not found'
        })
    }
});

router.delete('/users/:id', (req, res)=>{
    const users = readDataFromFile();
    const userId = req.params.id;
    
    const userIndex = users.findIndex(user => user.id === parseInt(userId) )
    if(userIndex != -1){
      users.splice(userIndex, 1);
      writeDataToFile(users);
      res.send({
        message: `user id ${userId} deleted`
      });
    }else{
       return res.status(404).send({
            error:'User not found'
        })
    }
});



router.get('/test', (rerq, res)=> res.send({
    message: 'test is working',
    path: dataFilePath
}))

module.exports = router;