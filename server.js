const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT =3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const MONGO_URI = 'mongodb+srv://sabithasri:sansabi@cluster0.2mqyvhk.mongodb.net/Expense?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(' Connected to MongoDB');
  } catch (err) {
    console.error(' MongoDB connection error:', err);
    process.exit(1); 
  }
};


const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const Expense = mongoose.model('Expense', expenseSchema);


app.post('/expenses', async (req, res) => {
  try {
    const { title, amount } = req.body;
    const expense = new Expense({ title, amount });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error(' Error saving expense:', error);
    res.status(500).json({ error: 'Failed to save expense' });
  }
});

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    console.error(' Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});
// app.put('/expenses/:id',async(req,res)=>{
//   try{
//     const updateexpenses=await Expense.findByIdAndUpdate(req.params.id,req.body,{new:true})
//     if(!updateexpenses){
//     return res.status(404).json({error:"Expenses not found"})
//   }
//   res.json(updateexpenses);
//   }catch(error){
//       console.log("Error updating expenses:",error)
//       res.status(500).json({error:'Failed to update expenses'})
//   }
// })
app.put('/expenses/:id', async (req, res) => {
  const { id } = req.params;

  console.log("PUT ID received:", id); // Debugging

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(updatedExpense);
  } catch (error) {
    console.log("Error updating expense:", error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});


app.delete('/expenses/:id',async(req,res)=>{
  try{
      const deleteexpenses=await Expense.findByIdAndDelete(req.params.id)
      if(!deleteexpenses){
        return res.status(404).json({error:"Expenses not found"})
      }
      res.json({message:"Deleted successfully"})
  }catch(error){
    console.log("Error deleting expenses:",error)
    res.status(500).json({error:'Failed to delete expenses'})
  }
})

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
  });
});
