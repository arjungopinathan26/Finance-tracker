import { useEffect, useState } from "react";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Navbar from "./Navbar";

const Insights = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [savings, setSavings] = useState([]);
    const [income, setIncome] = useState([]);
    const [finalData, setFinalData] = useState({});
    const [insight, setInsight] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchAllData = async () => {
        const token = localStorage.getItem('token');
        try {
            const [expensesRes, incomeRes, savingsRes, budgetRes] = await Promise.all([
                axios.get('http://localhost:5050/api/expense', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5050/api/income', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5050/api/savings', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5050/api/budget', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const combinedData = {
                expenses: expensesRes.data,
                income: incomeRes.data,
                savings: savingsRes.data,
                budgets: budgetRes.data
            };

            setBudgets(budgetRes.data);
            setExpenses(expensesRes.data);
            setIncome(incomeRes.data);
            setSavings(savingsRes.data);
            setFinalData(combinedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const formatPrompt = () => {
        const intro = `Analyze the user's financial data, including their expenses, savings, budget goals, and income trends. All data are in rupees. Generate 7-8 actionable insights covering major expense categories, savings evaluation, budgeting, and financial health.\n\nHere is the user's financial data:\n\n`;
        const formatted = JSON.stringify(finalData, null, 2);
        return `${intro}${formatted}`;
    };

    const getInsight = async () => {
        setLoading(true);
        const messages = [
            { role: "system", content: "You are a licensed financial advisor." },
            { role: "user", content: formatPrompt() }
        ];

        try {
            const res = await fetch(`http://127.0.0.1:1234/v1/chat/completions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "deepseek-r1-distill-qwen-7b",
                    messages: messages,
                    temperature: 0.7
                })
            });

            const data = await res.json();
            if (data.choices?.[0]?.message?.content) {
                const raw = data.choices[0].message.content;
                const cleanContent = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
                setInsight(cleanContent);
            } else {
                console.error("Unexpected response format:", data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Insights</h1>

                <div className="flex justify-center mb-8">
                    <button
                        onClick={getInsight}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Generating..." : "Get Insight"}
                    </button>
                </div>

                {insight && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg transition-all">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Generated Insights:</h2>
                        <ReactMarkdown>{insight}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insights;
