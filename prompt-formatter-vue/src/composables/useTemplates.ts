// src/composables/useTemplates.ts
export type PromptTemplate = {
  id: string;
  name: string;
  systemMessage: string;
  instructions: string;
  variables: string;
  sampleValuesRaw: string;
};

const STORAGE_KEY = "prompt-templates";

export function useTemplates() {
  const getTemplates = (): PromptTemplate[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const saveTemplate = (template: PromptTemplate) => {
    const existing = getTemplates();
    const updated = [...existing.filter((t) => t.id !== template.id), template];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteTemplate = (id: string) => {
    const updated = getTemplates().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getTemplateById = (id: string): PromptTemplate | undefined => {
    return getTemplates().find((t) => t.id === id);
  };

  return { getTemplates, saveTemplate, deleteTemplate, getTemplateById };
}
