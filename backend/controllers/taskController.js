const Task = require("../models/taskModel");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  const task = new Task({
    title: req.body.title,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title || task.title;
    task.completed = req.body.completed || task.completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reorderTasks = async (req, res) => {
  const { order } = req.body;

  try {
    const tasks = await Task.find();
    const taskMap = tasks.reduce((map, task) => {
      map[task._id] = task;
      return map;
    }, {});

    order.forEach((id, index) => {
      taskMap[id].order = index;
    });

    await Promise.all(Object.values(taskMap).map((task) => task.save()));

    const updatedTasks = await Task.find().sort({ order: 1 });
    res.json(updatedTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
