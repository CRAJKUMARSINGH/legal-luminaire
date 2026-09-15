import { useState, useCallback } from "react";

export type BilingualGenerationStage = "idle" | "analyzing" | "generating" | "complete" | "error";

interface BilingualGenerationState {
  stage: BilingualGenerationStage;
  message?: string;
  content: string;
  isGenerating: boolean;
  error?: string;
}

interface BilingualGenerationOptions {
  documentType: string;
  inputLanguage: "hindi" | "english";
  formData: Record<string, string>;
}

export function useBilingualGenerator() {
  const [state, setState] = useState<BilingualGenerationState>({
    stage: "idle",
    content: "",
    isGenerating: false,
  });

  const generateBilingualDocument = useCallback(async (options: BilingualGenerationOptions) => {
    setState({ 
      stage: "analyzing", 
      content: "", 
      isGenerating: true, 
      message: `Analyzing ${options.inputLanguage} input...` 
    });

    try {
      // Try to use the existing backend API first
      const response = await fetch("/api/legal/bilingual-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (response.ok) {
        const data = await response.json();
        
        setState({
          stage: "complete",
          content: data.content || generateFallbackContent(options),
          isGenerating: false,
          message: "Document generated successfully",
        });
        
        return data.content;
      } else {
        // Fallback to client-side generation if backend fails
        console.warn("Backend generation failed, using fallback");
        const fallbackContent = generateFallbackContent(options);
        
        setState({
          stage: "complete",
          content: fallbackContent,
          isGenerating: false,
          message: "Document generated (fallback mode)",
        });
        
        return fallbackContent;
      }
    } catch (error) {
      console.error("Bilingual generation error:", error);
      
      // Fallback to client-side generation
      const fallbackContent = generateFallbackContent(options);
      
      setState({
        stage: "complete",
        content: fallbackContent,
        isGenerating: false,
        message: "Document generated (offline mode)",
      });
      
      return fallbackContent;
    }
  }, []);

  const generateFallbackContent = (options: BilingualGenerationOptions): string => {
    const { documentType, inputLanguage, formData } = options;
    const outputLanguage = inputLanguage === "hindi" ? "English" : "Hindi";
    
    // Get document type info
    const docTypeMap: Record<string, { name: string; nameHindi: string }> = {
      "discharge-building-collapse": { name: "Discharge Application - Building Collapse", nameHindi: "डिस्चार्ज आवेदन - भवन ढहना" },
      "discharge-ni-act": { name: "Discharge Application - NI Act §138", nameHindi: "डिस्चार्ज आवेदन - NI Act §138" },
      "discharge-medical-negligence": { name: "Discharge Application - Medical Negligence", nameHindi: "डिस्चार्ज आवेदन - चिकित्सा लापरवाही" },
      "bail-ndps": { name: "Bail Application - NDPS", nameHindi: "जमानत आवेदन - NDPS" },
      "bail-domestic-violence": { name: "Bail Application - Domestic Violence", nameHindi: "जमानत आवेदन - घरेलू हिंसा" },
      "bail-murder": { name: "Bail Application - Murder (IPC §302)", nameHindi: "जमानत आवेदन - हत्या (IPC §302)" },
    };
    
    const docInfo = docTypeMap[documentType] || { name: "Legal Document", nameHindi: "कानूनी दस्तावेज़" };
    const docName = outputLanguage === "Hindi" ? docInfo.nameHindi : docInfo.name;
    
    // Build content from form data
    let content = `${docName}\n\n`;
    
    if (outputLanguage === "Hindi") {
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          // Simple translation mapping for common fields
          const fieldLabels: Record<string, string> = {
            caseNumber: "केस नंबर",
            courtName: "न्यायालय",
            firNumber: "FIR नंबर",
            incidentDate: "घटना की तारीख",
            petitioner: "वादी",
            respondent: "प्रतिवादी",
            charges: "आरोप",
            facts: "तथ्य",
            legalGrounds: "कानूनी आधार",
            prayer: "प्रार्थना",
            accusedName: "अभियुक्त का नाम",
            age: "आयु",
            complainant: "शिकायतकर्ता",
            hospitalName: "अस्पताल का नाम",
            patientName: "रोगी का नाम",
            doctorName: "डॉक्टर का नाम",
            victimName: "पीड़ित का नाम",
          };
          
          const label = fieldLabels[key] || key;
          content += `${label}: ${value}\n\n`;
        }
      });
      
      content += `[यह एक स्वचालित रूप से उत्पन्न दस्तावेज़ है। कृपया समीक्षा करें और आवश्यकतानुसार संपादित करें।]`;
    } else {
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          // Simple field name capitalization
          const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
          content += `${label}: ${value}\n\n`;
        }
      });
      
      content += `[This is an auto-generated document. Please review and edit as necessary.]`;
    }
    
    return content;
  };

  const reset = useCallback(() => {
    setState({ stage: "idle", content: "", isGenerating: false });
  }, []);

  return { state, generateBilingualDocument, reset };
}