import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Languages, Loader2, Sparkles, ArrowRight, Download, Edit, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBilingualGenerator } from "@/hooks/use-bilingual-generator";
import { getAllDocumentTypes, getFormTemplate, type FormField } from "@/lib/bilingual-form-templates";

interface BilingualGeneratorProps {
  sessionId?: number;
}

export function BilingualGenerator({ sessionId }: BilingualGeneratorProps) {
  const [inputLanguage, setInputLanguage] = useState<"hindi" | "english">("hindi");
  const [documentType, setDocumentType] = useState("discharge-building-collapse");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { state, generateBilingualDocument, reset } = useBilingualGenerator();

  // Get document types and form template
  const documentTypes = getAllDocumentTypes();
  const formTemplate = getFormTemplate(documentType);

  // Form state for input data - dynamic based on template
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Initialize form data when document type changes
  useEffect(() => {
    if (formTemplate) {
      const initialData: Record<string, string> = {};
      formTemplate.fields.forEach(field => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
    }
  }, [documentType, formTemplate]);

  const handleGenerate = async () => {
    // Check if required fields are filled
    if (formTemplate) {
      const requiredFields = formTemplate.fields.filter(f => f.required);
      const missingFields = requiredFields.filter(f => !formData[f.name]?.trim());
      
      if (missingFields.length > 0) {
        toast({
          title: "Required fields missing",
          description: `Please fill in: ${missingFields.map(f => f.label).join(", ")}`,
          variant: "destructive"
        });
        return;
      }
    }

    try {
      const outputLanguage = inputLanguage === "hindi" ? "English" : "Hindi";
      await generateBilingualDocument({
        documentType,
        inputLanguage,
        formData,
      });
      
      toast({
        title: "Document Generated",
        description: `Your ${outputLanguage} document has been generated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Document is being prepared for download.",
    });
    // Implement export functionality
  };

  const outputLanguage = inputLanguage === "hindi" ? "English" : "Hindi";
  const selectedDoc = documentTypes.find(d => d.value === documentType);

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Languages className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-serif font-semibold text-foreground">
                Bilingual Document Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Input in {inputLanguage === "hindi" ? "Hindi" : "English"} → Generate in {outputLanguage}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </Badge>
        </div>

        {/* Controls */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-xs">
            <Label className="text-xs mb-1">Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType} disabled={state.isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((doc) => (
                  <SelectItem key={doc.value} value={doc.value}>
                    <div className="flex items-center gap-2">
                      <span>{inputLanguage === "hindi" ? doc.labelHindi : doc.label}</span>
                      <Badge variant="secondary" className="text-xs">{doc.category}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 max-w-xs">
            <Label className="text-xs mb-1">Input Language</Label>
            <Select value={inputLanguage} onValueChange={(value: "hindi" | "english") => setInputLanguage(value)} disabled={state.isGenerating}>
              <SelectTrigger>
                <SelectValue placeholder="Select input language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hindi">🇮🇳 Hindi (हिंदी)</SelectItem>
                <SelectItem value="english">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className="gap-2"
          >
            {state.isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate {outputLanguage} Document
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Input */}
        <div className="w-1/2 border-r border-border flex flex-col bg-muted/20">
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">
                Input Data ({inputLanguage === "hindi" ? "हिंदी" : "English"})
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedDoc ? (inputLanguage === "hindi" ? selectedDoc.labelHindi : selectedDoc.label) : "Select document type"} - Enter case details
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {formTemplate ? (
              formTemplate.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label className={field.required ? "text-red-500" : ""}>
                    {inputLanguage === "hindi" ? field.labelHindi : field.label}
                    {field.required && " *"}
                  </Label>
                  
                  {field.type === "textarea" ? (
                    <Textarea
                      placeholder={inputLanguage === "hindi" ? field.placeholderHindi : field.placeholder}
                      className={`min-h-[${field.name === "facts" ? "150px" : "100px"}] ${field.required ? "border-red-200 focus:border-red-400" : ""}`}
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      disabled={state.isGenerating}
                    />
                  ) : field.type === "select" ? (
                    <Select
                      value={formData[field.name] || ""}
                      onValueChange={(value) => setFormData({...formData, [field.name]: value})}
                      disabled={state.isGenerating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={inputLanguage === "hindi" ? field.placeholderHindi : field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {inputLanguage === "hindi" ? option.labelHindi : option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "date" ? (
                    <Input
                      type="date"
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      disabled={state.isGenerating}
                    />
                  ) : field.type === "number" ? (
                    <Input
                      type="number"
                      placeholder={inputLanguage === "hindi" ? field.placeholderHindi : field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      disabled={state.isGenerating}
                    />
                  ) : (
                    <Input
                      placeholder={inputLanguage === "hindi" ? field.placeholderHindi : field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      disabled={state.isGenerating}
                    />
                  )}
                  
                  {field.required && (
                    <p className="text-xs text-muted-foreground">* Required field</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select a document type to see the input form
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="w-1/2 flex flex-col bg-background">
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                <h2 className="font-semibold text-foreground">
                  Generated Output ({outputLanguage})
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={!state.content || state.isGenerating}
                  className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? "View" : "Edit"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={!state.content}
                  className="gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {state.isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">
                  Generating {outputLanguage} document...
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  This may take a few moments
                </p>
              </div>
            ) : !state.content ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ArrowRight className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Fill in the form on the left and click "Generate" to create your {outputLanguage} document
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  The document will appear here
                </p>
              </div>
            ) : (
              <div className="h-full">
                {isEditing ? (
                  <Textarea
                    value={state.content}
                    onChange={(e) => {
                      // In a real implementation, this would update a separate edited content state
                      // For now, we'll just allow direct editing of the generated content
                    }}
                    className="h-full min-h-[500px] font-serif text-sm resize-none"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none font-serif">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {state.content}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}