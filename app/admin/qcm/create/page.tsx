'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createQuestion } from '@/actions/qcmActions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'Création...' : 'Créer la question'}</Button>;
}

export default function CreateQcmPage() {
  const [answers, setAnswers] = useState([{ text: '' }, { text: '' }]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  const addAnswer = () => setAnswers([...answers, { text: '' }]);
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = value;
    setAnswers(newAnswers);
  };

  const [state, formAction] = useActionState(createQuestion, { message: '' });

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader><CardTitle>Créer une nouvelle question</CardTitle></CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="questionText">Texte de la question</Label>
              <Input id="questionText" name="questionText" required />
            </div>

            <div>
              <Label>Réponses</Label>
              <div className="space-y-2">
                {answers.map((answer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswerIndex"
                      value={index}
                      checked={correctAnswerIndex === index}
                      onChange={() => setCorrectAnswerIndex(index)}
                      className="h-4 w-4"
                    />
                    <Input
                      name={`answer_${index}`}
                      placeholder={`Réponse ${index + 1}`}
                      value={answer.text}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addAnswer} className="mt-2">
                Ajouter une réponse
              </Button>
            </div>
            <input type="hidden" name="answersCount" value={answers.length} />

            {state?.message && <p className="text-[var(--color-destructive)]">{state.message}</p>}

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


