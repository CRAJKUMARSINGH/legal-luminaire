import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";

export default function DraftVariantsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Pleading Chain has been retired</h1>
      <p lang="hi">अभिवचन श्रृंखला सुविधा बंद कर दी गई है।</p>
      <p className="text-sm text-muted-foreground">
        Open Safe Draft to continue drafting and review citations before exporting.
      </p>
      <Button asChild>
        <Link href={`/case/${encodeURIComponent(id)}/safe-draft`}>Open Safe Draft · सुरक्षित मसौदा खोलें</Link>
      </Button>
    </div>
  );
}
