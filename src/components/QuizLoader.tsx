import React, { useState } from "react";
import { Quiz } from "../types/Quiz";

export const QuizLoader: React.FC<{ onQuizLoad: (quiz: Quiz) => void }> = ({ onQuizLoad }) => {
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const quiz = JSON.parse(content) as Quiz;

        // Basic validation
        if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
          throw new Error('Invalid quiz format');
        }

        onQuizLoad(quiz);
      } catch (err) {
        setError('Error loading quiz file. Please check the JSON format.');
        console.error(err);
      }
    };

    reader.onerror = () => {
      setError('Error reading file.');
    };

    reader.readAsText(file);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '100px auto',
      padding: '40px',
      textAlign: 'center',
      border: '2px dashed #ddd',
      borderRadius: '12px',
      backgroundColor: '#fafafa'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Quiz Application</h1>
      <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
        Load a quiz from a JSON file to get started
      </p>

      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{
          padding: '12px',
          fontSize: '16px',
          border: '2px solid #1976d2',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      />

      {error && (
        <p style={{
          marginTop: '20px',
          color: '#f44336',
          fontSize: '14px',
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '6px'
        }}>
          {error}
        </p>
      )}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        textAlign: 'left'
      }}>
        <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>Sample JSON Format:</h3>
        <pre style={{
          backgroundColor: '#fff',
          padding: '15px',
          borderRadius: '6px',
          overflow: 'auto',
          fontSize: '12px',
          color: '#333'
        }}>
{`{
  "title": "English Test: Present Simple",
  "description": "Mini test",
  "questions": [
    {
      "id": 1,
      "question": "She ___ to school.",
      "options": ["go", "goes", "went", "going"],
      "correctIndex": 1,
      "explanation": "He/She/It → goes"
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};
