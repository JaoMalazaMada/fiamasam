'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

type Answer = { id: number; answerText: string };
type Question = { id: number; questionText: string; Answer: Answer[] };

export default function QuizClient({ questions }: { questions: Question[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  if (questions.length === 0) {
    return <p>Le quiz n'est pas encore disponible.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Quiz terminé !");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Question {currentQuestionIndex + 1} / {questions.length}</h2>
        <p className="mt-2">{currentQuestion.questionText}</p>
      </div>

      <div className="space-y-2">
        {currentQuestion.Answer.map((answer) => (
          <label key={answer.id} className="flex items-center gap-2">
            <input
              type="radio"
              name={`q_${currentQuestion.id}`}
              value={answer.id}
              checked={selectedAnswer === answer.id}
              onChange={() => setSelectedAnswer(answer.id)}
              className="h-4 w-4"
            />
            <Label htmlFor={`a_${answer.id}`}>{answer.answerText}</Label>
          </label>
        ))}
      </div>

      <Button onClick={handleNextQuestion} disabled={selectedAnswer === null}>
        {currentQuestionIndex === questions.length - 1 ? 'Terminer le quiz' : 'Question suivante'}
      </Button>
    </div>
  );
}


