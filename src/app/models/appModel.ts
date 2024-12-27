import { TextFormatEnum } from "./enum";

export interface RuleData {
  id: number;
  workflow_id: number;
  expression: string;
  success_message: string;
  error_message: string;
  operator: any | null;  // Use 'any' if the data type is unknown, else specify a more specific type
  success_action_name: string | null;
  success_expression: string | null;
  success_workflow_id: number | null;
  success_rule_id: number | null;
  failure_action_name: string | null;
  failure_expression: string | null;
  failure_workflow_id: number | null;
  failure_rule_id: number | null;
  child_rules: any | null;  // If child_rules has a specific type, replace 'any' with it
  custom_details: string | null;  // Assuming this is always a JSON string
  last_modified_on: string;  // Keep as a string, or use Date if you prefer converting it
  is_active: boolean;
}

// Define FieldOptionDetails interface
export interface FieldOptionDetail {
  label: string;
  value: string;
  description?: string | "";
}

// Define FieldValidation interface
export interface FieldValidation {
  max?: string | "";
  min?: string | ""; 
  regex?: string | "";
}

// Define FieldDetails interface
export interface FieldDetails {
  description?: string | null;
  label?: string | null;
  placeholder?: string | null;
  apiName?: string | null;
  maskForAgent?: boolean | null;
  isOptional?: boolean | null;
  useAPI?: boolean | null;
  fieldValidation?: FieldValidation | null;
  value?: string | null;
  groupId?: number | null;
  ruleType?: number | null;
}

// Define MessageDetails interface
export interface MessageDetails {
  text: string;
  isPrivate: boolean;
  textFormat: TextFormatEnum; // 2 for Text, Html, Markdown
}

// Define BranchDetails interface
export interface BranchDetail {
  id?: number | null;
  type?: string | null;
  name?: string | null;
  successRuleId?: number| null;
  successWorkflowId?: number | null;
  value?: string | null;
}

// Define the main Workflow interface
export interface RuleData2 {
  id: number;
  chatWorkflowId: number;
  successWorkflowId?: number | null;
  successRuleId?: number | null;
  isActive?: boolean;
  chatWorkflowBlockId: number;
  chatWorkflowEditorTypeId?: number | null;
  fieldDetails?: FieldDetails | null;
  branchDetails?: BranchDetail[] | null;
  messageDetails?: MessageDetails | null;
  fieldOptionDetails?: FieldOptionDetail[] | null;
}

// Define the main Workflow interface
export interface ChatWorkflowRulesData extends ChatWorkflowCommonObject {
  id: number;
  successWorkflowId?: number | null;
  successRuleId?: number | null;
}

export interface ChatWorkflowRulesData2 {
  chatWorkflowEditorTypeId?: number | null;
  fieldDetails?: FieldDetails | null;
  fieldOptionDetails?: FieldOptionDetail[] | null;
}

export interface ChatWorkflowCommonObject {
  chatWorkflowId: number;
  chatWorkflowBlockId: number;
  chatWorkflowEditorTypeId?: number | null;
  fieldDetails?: FieldDetails | null;
  branchDetails?: BranchDetail[] | null;
  messageDetails?: MessageDetails | null;
  fieldOptionDetails?: FieldOptionDetail[] | null;
  parentId?: number | null;
}

export interface ChatWorkflowAddRuleRequest extends ChatWorkflowCommonObject {
  previousWorkflowRuleId?: number;
}

export interface AddWorkflowRulesResponse {
  workflowRuleId: number;
  successMessage: string;
}