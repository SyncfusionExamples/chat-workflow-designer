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