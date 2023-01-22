const asyncHandler = require("express-async-handler");

const Goal = require("../model/goalModel");

// @desc Get goals
//@route GET api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find();
  res.status(200).json(goals);
});

// @desc SET goals
//@route POST api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("please provide a text");
  }

  const goals = await Goal.create({
    text: req.body.text,
  });
  res.status(200).json(goals);
});

// @desc UPDATE goals
//@route PUT api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
  const goals = await Goal.findById(req.params.id);
  if (!goals) {
    res.status(400);
    throw new Error("goal not found");
  }
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

// @desc DELETE  goals
//@route delete api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
    const goals = await Goal.findById(req.params.id);

    if (!goals){
        res.status(404);
        throw new Error("goal not removed");
    }
   await goals.remove({id:req.params.id})

  res.status(200).json({ message: `Deleted goals by ${req.params.id}` });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
