const TaskModel = require('../models/taskModel')
const mongoose = require('mongoose')

// get all tasks
const getAllTasks = async (req, res) => {
  const user_id = req.user._id

  const tasks = await TaskModel.find({ user_id }).sort({ createdAt: -1 })

  res.status(200).json(tasks)
}

// get a single task
const getTask = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Task' })
  }

  const task = await TaskModel.findById(id)

  if (!task) {
    return res.status(404).json({ error: 'No such Task' })
  }

  res.status(200).json(task)
}

// create new workout
const createTask = async (req, res) => {
  const user_id = req.user._id

  const { title, content } = req.body
  console.log(title, content, user_id)

  let emptyFields = []

  if (!title) {
    emptyFields.push('title')
  }
  if (!content) {
    emptyFields.push('content')
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const newTask = await TaskModel.create({ title, content, user_id })
    res.status(200).json(newTask)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' })
  }

  const task = await TaskModel.findOneAndDelete({ _id: id })

  if (!task) {
    return res.status(400).json({ error: 'No such task' })
  }

  res.status(200).json(task)
}

// update a task
const updateTask = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' })
  }

  const task = await TaskModel.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  )

  if (!task) {
    return res.status(400).json({ error: 'No such task' })
  }

  res.status(200).json(task)
}

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
}
