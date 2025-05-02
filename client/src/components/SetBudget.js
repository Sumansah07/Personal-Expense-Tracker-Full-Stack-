import React, { useState } from "react";
import ReactLoading from "react-loading";

export default function SetBudget(props) {
  const [monthlyBudget, setMonthlyBudget] = useState({
    budget: "",
  });
  const [error, setError] = useState({
    budget: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const HandleSetBudget = async (e) => {
    setIsLoading(true);

    setError({
      budget: "",
    });

    const res = await fetch("/expense/setbudget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(monthlyBudget),
    });
    const data = await res.json();
    console.log(data);

    if (data.errors) {
      setIsLoading(false);
      setError(data.errors);
    } else {
      setIsLoading(false);
      props.closeModalBudget();
      window.location.reload();
    }
  };

  const handleGetAiRecommendation = async () => {
    setAiLoading(true);
    setAiRecommendation("");
    try {
      const res = await fetch("/expense/ai/budget-recommendation");
      const data = await res.json();
      if (data.recommendation) {
        const formattedRecommendation = data.recommendation
          .replace(/\*/g, '')
          .replace(/\$([0-9,]+(\.\d{1,2})?)/g, 'Rs.$1') // Replace $ with Rs.
          .replace(/\$\s*([0-9,]+(\.\d{1,2})?)/g, 'Rs.$1') // Replace $ with space with Rs.
          .replace(/([0-9,]+(\.\d{1,2})?)\s*dollars/gi, 'Rs.$1') // Replace X dollars with Rs.X
          // .replace(/\*\*/g, '')
          // .replace(/\n/g, ' ')
          // .replace(/\s+/g, ' ')
          // .trim();
        setAiRecommendation(formattedRecommendation);
      }else {
        setAiRecommendation("No recommendation available.");
      }
    } catch (err) {
      setAiRecommendation("Failed to get AI recommendation.");
    }
    setAiLoading(false);
  };

  return (
    <div className="grid grid-cols-5 text-jp-white h-3/4 font-lexend custom-scrollbar" >
      <div className="col-span-3 bg-rp-black p-8 py-14 rounded-md">
        <h1 className="font-bold text-xl mt-3">Set Budget</h1>
        <div className="mt-4">
          <label className="w-fit">what's your budget amount</label>
        </div>

        <div className="flex bg-jp-black w-fit mt-4 p-2 rounded">
          <h1 className="font-bold text-xl">Rs.</h1>
          <input
            value={monthlyBudget.budget}
            onChange={(e) => {
              const tempBudget = { ...monthlyBudget };
              tempBudget.budget = e.target.value;
              setMonthlyBudget(tempBudget);
            }}
            type="number"
            placeholder=""
            className="setbuget-input bg-jp-black ml-4 outline-none"
          ></input>
        </div>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleGetAiRecommendation}
          type="button"
          disabled={aiLoading}
        >
          {aiLoading ? "Getting Recommendation..." : "Get AI Budget Recommendation"}
        </button>
        {aiRecommendation && (
          <div className="mt-4 p-3 bg-gray-800 text-white rounded custom-scrollbar" style={{ maxHeight: "500px", overflowY: "auto", marginLeft: "-16px", marginRight: "-330px", whiteSpace: "pre-line" }}>
            <strong>AI Recommendation:</strong>
            <div style={{ whiteSpace: "pre-line" }}>{aiRecommendation}</div>
          </div>
        )}
        <span className="text-sm text-red-500">{error.msg}</span>

        <div className="mt-20 border-rp-yellow border-2 w-fit rounded-md">
          {isLoading ? (
            <ReactLoading
              type="bubbles"
              color="#F5A302"
              height={50}
              width={50}
            />
          ) : (
            <button
              onClick={HandleSetBudget}
              className="p-2 px-3 rounded-lg font-bold text-rp-yellow"
            >
              Save Buget
            </button>
          )}
        </div>
      </div>
    </div>
  );
}