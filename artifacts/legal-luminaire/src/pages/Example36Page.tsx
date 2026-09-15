import React from "react";
import data from "@/fixtures/week04/example36_gift_deed.json";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";

export default function Example36Page() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-lg backdrop-blur-sm bg-white/70 border border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">{data.id} – {data.domain}</CardTitle>
          </div>
          <Badge variant="outline" className="mt-2">{data.complexity}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Approach:</strong> {data.approachStatus}</p>
          <p><strong>Documents:</strong> {data.documents.join(", ")}</p>
          <p><strong>Action Plan:</strong> {data.actionPlan}</p>
          <p><strong>Draft Status:</strong> {data.draftStatus}</p>
        </CardContent>
      </Card>
    </div>
  );
}
