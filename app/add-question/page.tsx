// app/add-question/page.tsx
import QuestionForm from "@/components/forms/QuestionForm";

export default function AddQuestionPage() {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Add New Question</h1>
        <p className="text-sm text-slate-400">Log your attempt and add it to your Spaced Repetition queue.</p>
      </div>
      
      {/* Render the client component we just built */}
      <QuestionForm />
    </div>
  );
}