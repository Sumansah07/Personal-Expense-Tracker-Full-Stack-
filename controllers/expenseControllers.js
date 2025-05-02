const Expense = require("../models/expense");
const User = require("../models/user");
var moment = require("moment");
const { sendToGemini } = require("../services/geminiService");

module.exports.add_expense = async (req, res) => {
  let { date, amount, desc, category } = req.body;
  if (!date) {
    date = new Date();
  }
  if (!category) {
    category = "General";
  }
  const id = req.user._id;
  if (date && amount && desc && category) {
    try {
      if (typeof date != "object") {
        date = new Date(date);
      }
      const expense = await Expense.create({
        id,
        date,
        amount,
        desc,
        category,
      });
      res.status(200).json({ expense });
    } catch (err) {
      console.log(err);
      res.status(404).json({ errors: { msg: "Something went wrong." } });
    }
  } else {
    res
      .status(404)
      .json({ errors: { msg: "Please Fill Amount and Description." } });
  }
};

module.exports.view_expense = async (req, res) => {
  const id = req.user._id;
  try {
    const expenses = await Expense.find({ id }).sort({ date: -1 });

    res.status(200).json({ expenses });
  } catch (err) {
    res.status(404).json({ errors: { msg: "Something went wrong." } });
  }
};

module.exports.get_today_expense = async (req, res) => {
  const id = req.user._id;
  try {
    let expenses = await Expense.find({ id }).sort({ date: -1 });
    let filterData = [];
    for (let i = 0; i < expenses.length; i++) {
      if (
        expenses[i].date.toString().substring(0, 15) ===
        moment().format("ddd MMM DD YYYY")
      ) {
        filterData.push(expenses[i]);
      }
    }
    Object.assign({}, filterData);
    res.status(200).json({ filterData });
  } catch (err) {
    res.status(404).json({ errors: { msg: "Something went wrong." } });
  }
};

module.exports.view_expense_by_catergory = async (req, res) => {
  const id = req.user._id;
  const category = req.params.category;
  try {
    const expenses = await Expense.find({ id, category }).sort({ date: -1 });
    res.status(200).json({ expenses });
  } catch (err) {
    res.status(404).json({ errors: { msg: "Something went wrong." } });
  }
};

module.exports.set_budget = async (req, res) => {
  const id = req.user._id;
  const { budget } = req.body;

  if (budget) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { budget },
        { upsert: true }
      );
      res.status(200).json({ user });
    } catch (err) {
      console.log(err);
      res.status(404).json({ errors: { msg: "Something went wrong." } });
    }
  } else {
    res.status(400).json({ errors: { msg: "Please enter budget." } });
  }
};

module.exports.view_expenses_in_range = async (req, res) => {
  const id = req.user._id;
  let { startdate, enddate } = req.body;
  startdate = new Date(startdate);
  enddate = new Date(enddate);
  try {
    const expense = await Expense.find({
      id,
      date: { $gte: startdate, $lte: enddate },
    }).sort({ date: -1 });
    res.status(200).json({ expense });
  } catch (err) {
    res.status(404).json({ errors: { msg: "Something went wrong." } });
  }
};

module.exports.get_budget = async (req, res) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id);
    res.status(200).json({ budget: user.budget });
  } catch (err) {
    res.status(404).json({ errors: { msg: "Something went wrong." } });
  }
};

module.exports.delete_expense = async (req, res) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findByIdAndDelete(id);
    res.status(200).json({ expense });
  } catch (err) {
    res.status(404).json({ errors: { msg: "Something went wrong." } });
  }
};

module.exports.get_expense_insight = async (req, res) => {
  const { desc, amount, category } = req.body;
  if (!desc || !amount) {
    return res.status(400).json({ errors: { msg: "Description and amount are required for AI insights." } });
  }
  try {
    let prompt = `Given the following expense description: "${desc}", amount: ${amount}, and category: "${category || 'Uncategorized'}", suggest a suitable category or provide a brief insight about this expense.`;
    const aiResponse = await sendToGemini(prompt);
    let suggestion = aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion available.";
    res.status(200).json({ suggestion });
  } catch (error) {
    res.status(500).json({ errors: { msg: "Failed to get AI insight." } });
  }
};

// AI-powered budget recommendation endpoint
module.exports.get_budget_recommendation = async (req, res) => {
  const id = req.user._id;
  try {
    // Fetch all user expenses
    const expenses = await Expense.find({ id }).sort({ date: -1 });
    if (!expenses || expenses.length === 0) {
      return res.status(200).json({ recommendation: "No expenses found. Add expenses to get recommendations." });
    }
    // Calculate total spent, average monthly, and detect patterns
    let totalSpent = 0;
    let monthlyTotals = {};
    expenses.forEach(exp => {
      const month = exp.date.getFullYear() + '-' + (exp.date.getMonth() + 1);
      monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(exp.amount);
      totalSpent += parseFloat(exp.amount);
    });
    const months = Object.keys(monthlyTotals).length;
    const avgMonthly = months > 0 ? (totalSpent / months) : totalSpent;
    // Prepare prompt for Gemini
    let prompt = `Analyze the following user spending data: Total spent: Rs.${totalSpent.toFixed(2)}, Average monthly: Rs.${avgMonthly.toFixed(2)}, Monthly breakdown: ${JSON.stringify(monthlyTotals)}, Detailed expenses: ${JSON.stringify(expenses)}. Address any unusual spending patterns, especially in April 2025, and provide a personalized budget recommendation. IMPORTANT: Always use 'Rs.' instead of '$' or any other currency symbol when referring to money amounts in your response.`;
    const aiResponse = await sendToGemini(prompt);
    let recommendation = aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "No recommendation available.";
    res.status(200).json({ recommendation });
  } catch (error) {
    res.status(500).json({ errors: { msg: "Failed to get AI budget recommendation." } });
  }
};
