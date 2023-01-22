const asyncHandler = require("express-async-handler");

const Goal = require("../model/goalModel");

const User = require("../model/userModel");

// @desc Get goals
//@route GET api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
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
    user: req.user.id,
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

  const user = await User.findById(req.user.id);

  if (!user) {
    // check for user
    res.status(401);
    throw new Error("User not found");
  }

  // make sure only the logged user matches the goaluser
  if (goals.user.toString() !== user.id) {
    res.status(401);
    throw new Error("user not authorised");
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

  if (!goals) {
    res.status(400);
    throw new Error("goal not removed");
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    // check for user
    res.status(401);
    throw new Error("User not found");
  }

  // make sure only the logged user matches the goaluser
  if (goals.user.toString() !== user.id) {
    res.status(401);
    throw new Error("user not authorised");
  }
  await goals.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
