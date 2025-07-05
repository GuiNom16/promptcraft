<template>
  <div class="flex flex-col gap-4">
    <!-- Template Manager -->
    <n-card title="📁 Template Manager">
      <n-space vertical>
        <n-select
          v-model:value="selectedTemplateId"
          placeholder="Load a template"
          :options="templateOptions"
          @update:value="handleTemplateSelect"
        />
        <n-input
          v-model:value="templateNameInput"
          placeholder="Name this template (for saving)"
        />
        <n-button-group>
          <n-button @click="handleSaveTemplate" type="primary"
            >💾 Save Template</n-button
          >
          <n-button
            @click="handleDeleteTemplate"
            type="error"
            :disabled="!selectedTemplateId"
          >
            🗑 Delete
          </n-button>
        </n-button-group>
      </n-space>
    </n-card>

    <!-- System Message -->
    <n-card title="🧠 System Message">
      <n-input
        v-model:value="systemMessage"
        type="textarea"
        placeholder="e.g. You are a helpful assistant."
        :autosize="{ minRows: 2 }"
      />
    </n-card>

    <!-- Instructions -->
    <n-card title="📋 Instructions">
      <n-input
        v-model:value="instructions"
        type="textarea"
        placeholder="What should the AI do?"
        :autosize="{ minRows: 3 }"
      />
    </n-card>

    <!-- Variables with placeholders -->
    <n-card title="🔣 Prompt (with {{variables}})">
      <n-input
        v-model:value="variables"
        type="textarea"
        placeholder="e.g. Hello {{name}}, your goal is {{goal}}."
        :autosize="{ minRows: 4 }"
      />
    </n-card>

    <!-- Sample JSON values -->
    <n-card title="🔧 Sample Values (JSON)">
      <n-input
        v-model:value="sampleValuesRaw"
        type="textarea"
        placeholder='{ "name": "Alice", "goal": "write a novel" }'
        :autosize="{ minRows: 3 }"
      />
      <n-text depth="3" v-if="!isSampleJsonValid" type="error"
        >⚠️ Invalid JSON format</n-text
      >
    </n-card>

    <!-- Live Prompt Preview -->
    <n-space vertical size="large">
      <!-- Live Prompt Preview -->
      <n-card title="🪄 Rendered Prompt (live preview)">
        <n-input
          :value="renderedPrompt"
          type="textarea"
          readonly
          :autosize="{ minRows: 6 }"
        />
      </n-card>

      <!-- Copy & Export Buttons -->
      <n-space justify="center">
        <n-button @click="copyPrompt" type="success"
          >📋 Copy to Clipboard</n-button
        >
        <n-button @click="exportTxt" type="info">⬇️ Export .txt</n-button>
        <n-button @click="exportMd" type="info">⬇️ Export .md</n-button>
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTemplates, PromptTemplate } from "../composables/useTemplates";
import { v4 as uuidv4 } from "uuid";
import { useMessage } from "naive-ui";
import copy from "copy-to-clipboard"; // make sure to install this or use native API

// State
const systemMessage = ref("");
const instructions = ref("");
const variables = ref("");
const sampleValuesRaw = ref("");
const templateNameInput = ref("");
const selectedTemplateId = ref<string | null>(null);

// Template logic
const { getTemplates, saveTemplate, deleteTemplate, getTemplateById } =
  useTemplates();
const templateOptions = ref<{ label: string; value: string }[]>([]);

// Notifications
const message = useMessage();

// Parse sample values
const sampleValues = computed(() => {
  try {
    return JSON.parse(sampleValuesRaw.value || "{}");
  } catch {
    return {};
  }
});

const isSampleJsonValid = computed(() => {
  try {
    JSON.parse(sampleValuesRaw.value || "{}");
    return true;
  } catch {
    return false;
  }
});

// Replace placeholders like {{name}} with sampleValues["name"]
function replacePlaceholders(text: string, values: Record<string, string>) {
  return text.replace(
    /{{(.*?)}}/g,
    (_, key) => values[key.trim()] ?? `{{${key}}}`
  );
}

// Final prompt preview
const renderedPrompt = computed(() => {
  const replacedVars = replacePlaceholders(variables.value, sampleValues.value);
  return `System:\n${systemMessage.value}\n\nInstructions:\n${instructions.value}\n\nPrompt:\n${replacedVars}`;
});

// Init dropdown options
function refreshTemplateOptions() {
  templateOptions.value = getTemplates().map((t) => ({
    label: t.name,
    value: t.id,
  }));
}

onMounted(() => {
  refreshTemplateOptions();
});

// Load a template
function handleTemplateSelect(id: string) {
  const template = getTemplateById(id);
  if (!template) return;
  selectedTemplateId.value = id;
  systemMessage.value = template.systemMessage;
  instructions.value = template.instructions;
  variables.value = template.variables;
  sampleValuesRaw.value = template.sampleValuesRaw;
}

// Save current template (new or update)
function handleSaveTemplate() {
  const id = selectedTemplateId.value || uuidv4();
  const name =
    templateNameInput.value?.trim() ||
    `Template - ${new Date().toLocaleString()}`;

  const template: PromptTemplate = {
    id,
    name,
    systemMessage: systemMessage.value,
    instructions: instructions.value,
    variables: variables.value,
    sampleValuesRaw: sampleValuesRaw.value,
  };

  saveTemplate(template);
  selectedTemplateId.value = id;
  templateNameInput.value = "";
  refreshTemplateOptions();
  message.success("Template saved successfully!");
}

// Delete template
function handleDeleteTemplate() {
  if (selectedTemplateId.value) {
    deleteTemplate(selectedTemplateId.value);
    selectedTemplateId.value = null;
    refreshTemplateOptions();
    message.success("Template deleted.");
  }
}

// Clipboard copy
function copyPrompt() {
  const success = copy(renderedPrompt.value);
  if (success) {
    message.success("Copied prompt to clipboard!");
  } else {
    message.error("Failed to copy prompt.");
  }
}

// Generic file export helper
function exportFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

// Export as .txt
function exportTxt() {
  exportFile("prompt.txt", renderedPrompt.value);
  message.success("Exported prompt as prompt.txt");
}

// Export as .md (wrapped in code block)
function exportMd() {
  const mdContent = "```\n" + renderedPrompt.value + "\n```";
  exportFile("prompt.md", mdContent);
  message.success("Exported prompt as prompt.md");
}
</script>
