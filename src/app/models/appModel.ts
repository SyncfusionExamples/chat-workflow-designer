import { TextFormatEnum } from "./enum";

// Define FieldOptionDetails interface
export interface FieldOptionDetail {
  label: string;
  value: string;
  description?: string | null;
}

// Define FieldValidation interface
export interface FieldValidation {
  max?: string | null;
  min?: string | null; 
  regex?: string | null;
}

// Define FieldDetails interface
export interface FieldDetails {
  description?: string;
  label?: string;
  placeholder?: string;
  apiName?: string;
  maskForAgent?: boolean;
  isOptional?: boolean;
  useAPI?: boolean;
  fieldValidation?: FieldValidation | null;
  value?: string;
  groupId?: number;
  ruleType?: number;
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

export interface CustomerBlockFieldDetails {
  isEmailEditorEnabled?: boolean;
  isNameEditorEnabled?: boolean;
  isPhoneEditorEnabled?: boolean;
}

// Define the main Workflow interface
export interface RuleData2 {
  id: number;
  chatWorkflowId: number;
  successWorkflowId?: number | null;
  successRuleId?: number | null;
  isActive: boolean;
  chatWorkflowBlockId: number;
  chatWorkflowEditorTypeId?: number | null;
  fieldDetails?: FieldDetails | null;
  branchDetails?: BranchDetail[] | null;
  messageDetails?: MessageDetails | null;
  fieldOptionDetails?: FieldOptionDetail[] | null;
  customerBlockFieldInfo?: CustomerBlockFieldDetails | null;
  parentId?: number | null;
}

// Define the main Workflow interface
export interface ChatWorkflowRulesData {
  id: number;
  successWorkflowId?: number | null;
  successRuleId?: number | null;
  chatWorkflowBlockId: number;
  chatWorkflowEditorTypeId?: number | null;
  fieldDetails?: FieldDetails | null;
  branchDetails?: BranchDetail[] | null;
  messageDetails?: MessageDetails | null;
  fieldOptionDetails?: FieldOptionDetail[] | null;
  customerBlockFieldInfo?: CustomerBlockFieldDetails | null;
  parentId?: number | null;
}