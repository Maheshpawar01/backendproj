const express = require('express');
const router = express.Router();

const Todo = require('../MODELS/Todo')


router.get('/test', (req,res)=>{
    res.json({
        message: 'The todo route API is working'
    })
});

//create todo by give title and description

router.post('/createtodo', async (req,res)=>{
    try{
        const {title, description} = req.body;
        const newTodo = new Todo({
            title,
            description
        })
        await newTodo.save();
        res.status(201).json({
            message:'Todo created successfully'
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
})

// get all todos
router.get('/getalltodos', async (req, res)=>{
    try{
        const todos = await Todo.find();
        res.status(200).json({
            todos, 
            message:'Todos fetched successfully'
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

//get by id api
router.get('/gettodo/:id', async (req, res)=>{
    try{
        const todo = await Todo.findById(req.params.id);

        if(!todo){
            res.status(404).json({
                message: 'Todo not found'
            })
        }
        res.status(200).json({
            todo, 
            message:'Todos fetched successfully'
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

//update todo by specific id api
router.put('/updatetodo/:id', async (req, res)=>{
    try{
        const {title, description, completed} = req.body;
        const todo = await Todo.findByIdAndUpdate(req.params.id, {
            title,
            description,
            completed
        }, {
            new: true
        });

        if(!todo){
            res.status(404).json({
                message: 'Todo not found'
            })
        }
        res.status(200).json({
            todo, 
            message:'Todos updated successfully'
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
})

//delete todo by specific id api

router.delete('/deletetodo/:id', async(req,res)=>{
    try{
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if(!todo){
            res.status(404).json({
                message: 'Todo not found'
            })
        }

        res.status(200).json({
            message: 'Todo deleted successfully'
        });

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
})

module.exports = router;
