import React from "react";

interface ScoreIndicatorProps {
  score: number;
  change?: number;
  maxScore?: number;
}

interface GradientColor {
  color: string;
  position: number;
}

const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ 
  score, 
  change = 0, 
  maxScore = 100 
}) => {
  // Determine score level based on percentage
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  const getScoreLevel = (scoreValue: number) => {
    const percentScore = (scoreValue / maxScore) * 100;
    if (percentScore < 25) return "Poor";
    if (percentScore < 50) return "Average";
    if (percentScore < 75) return "Good";
    return "Excellent";
  };

  const level = getScoreLevel(score);

  const gradientColors: GradientColor[] = [
    { color: "#ff4400", position: 0 },   // Red (Poor)
    { color: "#ffb700", position: 25 },  // Orange (Average)
    { color: "#92E3A9", position: 50 },  // Light Green (Good)
    { color: "#00ff95", position: 100 }, // Bright Green (Excellent)
  ];

  return (
    <div className=" rounded-xl p-6 max-w-md">
      <div className="flex items-center mb-4">
        <span className="text-gray-300  font-medium">Overall implementation</span>
        <div className="ml-2 w-3 h-3 rounded-full border border-gray-600 flex items-center justify-center">
          <span className="text-gray-400 text-xs">i</span>
        </div>
      </div>

      <div className="flex items-start mb-4">
        <span className="text-foreground text-6xl font-bold">{score}</span>
        {change > 0 && (
          <span className="text-emerald-400 text-xl ml-2">+{change}</span>
        )}
      </div>

      <div className="relative h-2  rounded-full mb-4">
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: "100%",
            background: `linear-gradient(to right, ${gradientColors
              .map((g) => `${g.color} ${g.position}%`)
              .join(", ")})`,
          }}
        />

        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
          style={{
            left: `${percentage}%`,
            transform: "translateX(-50%) translateY(-50%)",
          }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-400">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>

      <div className="mt-4">
        <span className="text-gray-400">score: </span>
        <span 
          className={`font-medium ${
            level === "Poor" ? "text-red-500" :
            level === "Average" ? "text-yellow-500" :
            level === "Good" ? "text-green-500" :
            "text-emerald-500"
          }`}
        >
          {level}
        </span>
      </div>
    </div>
  );
};

export default ScoreIndicator;