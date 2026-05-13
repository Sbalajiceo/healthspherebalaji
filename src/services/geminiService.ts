import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are the AI brain powering HealthSphere — India's first Gen-Z and millennial-focused healthcare superapp. You are a brilliant, warm, and direct health companion that feels like texting a doctor friend who actually gets you. Tone: warm doctor best friend — confident, clear, never clinical. Currency: always ₹ / Dates: DD Mon YYYY / Measurements: metric. NEVER say: "I am not a doctor", "As an AI language model", "Please consult a healthcare professional" (rephrase warmly instead).`;

export async function generateTriage(symptoms: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze these symptoms: "${symptoms}". Provide triage information.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            triage: {
              type: Type.OBJECT,
              properties: {
                symptoms_detected: { type: Type.ARRAY, items: { type: Type.STRING } },
                urgency: { type: Type.STRING, description: "low, moderate, high" },
                suggested_specialties: { type: Type.ARRAY, items: { type: Type.STRING } },
                plain_explanation: { type: Type.STRING, description: "Warm, plain-language explanation, no jargon" },
                see_doctor_within: { type: Type.STRING },
                emergency_flag: { type: Type.BOOLEAN }
              },
              required: ["symptoms_detected", "urgency", "suggested_specialties", "plain_explanation", "see_doctor_within", "emergency_flag"]
            }
          },
          required: ["triage"]
        }
      }
    });
    return JSON.parse(response.text || '{}').triage;
  } catch (error) {
    console.error("Triage error:", error);
    return null;
  }
}

export async function generateHealthSummary(records: any[], context?: string) {
  try {
    const prompt = context 
      ? `Generate a health summary for ${context} based on these timeline records: ${JSON.stringify(records)}`
      : `Generate a health summary based on these timeline records: ${JSON.stringify(records)}`;
      
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                paragraph: { type: Type.STRING, description: "Warm plain-language paragraph (no bullet points)" },
                key_patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
                positive_trends: { type: Type.ARRAY, items: { type: Type.STRING } },
                action_recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["paragraph", "key_patterns", "positive_trends", "action_recommendations"]
            }
          },
          required: ["summary"]
        }
      }
    });
    return JSON.parse(response.text || '{}').summary;
  } catch (error) {
    console.error("Summary error:", error);
    return null;
  }
}

export async function generateWellnessPlan(answers: any) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a wellness plan based on these user answers: ${JSON.stringify(answers)}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wellness_plan: {
              type: Type.OBJECT,
              properties: {
                plan_name: { type: Type.STRING },
                tagline: { type: Type.STRING },
                weekly_goals: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["plan_name", "tagline", "weekly_goals"]
            }
          },
          required: ["wellness_plan"]
        }
      }
    });
    return JSON.parse(response.text || '{}').wellness_plan;
  } catch (error) {
    console.error("Wellness plan error:", error);
    return null;
  }
}

export async function generateCategoryPlan(category: string, answers: any) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a highly personalized, Hims/Hers style healthcare plan for the category "${category}" based on these user answers: ${JSON.stringify(answers)}. Make it sound premium, science-backed, and tailored to their specific needs.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plan: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Catchy, personalized plan title" },
                subtitle: { type: Type.STRING, description: "Encouraging subtitle" },
                core_issue: { type: Type.STRING, description: "What the AI identified as the root cause based on answers" },
                recommended_routine: { 
                  type: Type.ARRAY, 
                  items: { 
                    type: Type.OBJECT,
                    properties: {
                      timeOfDay: { type: Type.STRING },
                      action: { type: Type.STRING },
                      reason: { type: Type.STRING }
                    },
                    required: ["timeOfDay", "action", "reason"]
                  }
                },
                suggested_supplements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      benefit: { type: Type.STRING }
                    },
                    required: ["name", "benefit"]
                  }
                },
                expected_results: { type: Type.STRING, description: "What they can expect in 4 weeks" }
              },
              required: ["title", "subtitle", "core_issue", "recommended_routine", "suggested_supplements", "expected_results"]
            }
          },
          required: ["plan"]
        }
      }
    });
    return JSON.parse(response.text || '{}').plan;
  } catch (error) {
    console.error("Category plan error:", error);
    return null;
  }
}

export async function findGenericAlternatives(medicineQuery: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find generic alternatives for: "${medicineQuery}". Use realistic Indian medicine names and ₹ prices.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            substitution: {
              type: Type.OBJECT,
              properties: {
                original_brand: { type: Type.STRING },
                salt: { type: Type.STRING },
                original_price_inr: { type: Type.NUMBER },
                alternatives: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      brand: { type: Type.STRING },
                      manufacturer: { type: Type.STRING },
                      price_inr: { type: Type.NUMBER },
                      savings_inr: { type: Type.NUMBER }
                    },
                    required: ["brand", "manufacturer", "price_inr", "savings_inr"]
                  }
                }
              },
              required: ["original_brand", "salt", "original_price_inr", "alternatives"]
            }
          },
          required: ["substitution"]
        }
      }
    });
    return JSON.parse(response.text || '{}').substitution;
  } catch (error) {
    console.error("Substitution error:", error);
    return null;
  }
}

export async function generateDoctorReply(
  userMessage: string,
  doctor: { name: string; spec: string },
  history: Array<{ role: string; text: string }>
) {
  try {
    const historyText = history.length > 0
      ? `Previous conversation:\n${history.map(m => `${m.role === 'user' ? 'Patient (Sandeep)' : doctor.name}: ${m.text}`).join('\n')}\n\n`
      : '';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${historyText}Patient (Sandeep) says: "${userMessage}"`,
      config: {
        systemInstruction: `You are ${doctor.name}, a ${doctor.spec} on HealthSphere — an Indian healthcare app. You are in a live text chat consultation with your patient Sandeep. Respond warmly and professionally, like a real doctor texting a patient. Keep replies brief (1–3 sentences max). Ask follow-up questions when relevant. Never break character. ${SYSTEM_INSTRUCTION}`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "The doctor's reply — brief, warm, professional, 1-3 sentences" }
          },
          required: ['reply']
        }
      }
    });
    return JSON.parse(response.text || '{}').reply;
  } catch (error) {
    console.error('Doctor reply error:', error);
    return null;
  }
}

export async function generateMedicalNote(transcript: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract a structured medical note from this consultation transcript: "${transcript}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            note: {
              type: Type.OBJECT,
              properties: {
                chief_complaint: { type: Type.STRING },
                symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                diagnosis: { type: Type.STRING },
                prescription: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      dosage: { type: Type.STRING },
                      frequency: { type: Type.STRING },
                      duration: { type: Type.STRING },
                    },
                    required: ['name', 'dosage', 'frequency', 'duration']
                  }
                },
                advice: { type: Type.ARRAY, items: { type: Type.STRING } },
                follow_up: { type: Type.STRING },
              },
              required: ['chief_complaint', 'symptoms', 'diagnosis', 'prescription', 'advice', 'follow_up']
            }
          },
          required: ['note']
        }
      }
    });
    return JSON.parse(response.text || '{}').note;
  } catch (error) {
    console.error('Medical note error:', error);
    return null;
  }
}

export async function scanPrescription(base64Image: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1],
                mimeType: base64Image.substring(base64Image.indexOf(":")+1, base64Image.indexOf(";"))
              }
            },
            {
              text: "Extract the medication details from this prescription. Return ONLY a valid JSON object with the following keys: 'name' (string, medication name), 'dose' (number, dose in mg without the unit), 'duration' (string, e.g., '1 Week'), 'mealTiming' (string, either 'Take Before' or 'Take After'), 'category' (string, from the following list: 'Antibiotics', 'Pain Relievers', 'Antiacids', 'Antidepressants', 'Antidiarectics', 'Antihypertensives', 'Diuretics', 'Analgesics'). Do not include markdown formatting."
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            dose: { type: Type.NUMBER },
            duration: { type: Type.STRING },
            mealTiming: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["name", "dose", "duration", "mealTiming", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error scanning prescription:", error);
    return null;
  }
}
