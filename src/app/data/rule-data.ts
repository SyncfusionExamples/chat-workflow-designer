import { RuleData } from "../models/appModel";


export const RULE_DATA: RuleData[] = [
  {
    // identity input request rule
    "id" : 1,
    "workflow_id" : 1,
    "expression" : "Utils.IsValidEmail(input)",
    "success_message" : "Email received",
    "error_message" : "Invalid Email. Provide valid Email",
    "operator" : null,
    "success_action_name" : "EvaluateRule",
    "success_expression" : null,
    "success_workflow_id" : 1,
    "success_rule_id" : 2,
    "failure_action_name" : "OutputExpression",
    "failure_expression" : "false",
    "failure_workflow_id" : 1,
    "failure_rule_id" : 1,
    "child_rules" : null,
    "custom_details" : "{\"Field\": \"visitorEmail\", \"Description\": \"Provide valid email\", \"Placeholder\": \"Enter your email\", \"IsInputStage\": true}",
    "last_modified_on" : "2024-09-26T07:16:07.705Z",
    "is_active" : true
  },
  {
    // identity verification rule 
    "id" : 2,
    "workflow_id" : 1,
    "expression" : "Utils.IsUserEmailExists(input)",
    "success_message" : "",
    "error_message" : "",
    "operator" : null,
    "success_action_name" : "EvaluateRule",
    "success_expression" : null,
    "success_workflow_id" : 1,
    "success_rule_id" : 4,
    "failure_action_name" : "EvaluateRule",
    "failure_expression" : null,
    "failure_workflow_id" : 1,
    "failure_rule_id" : 3,
    "child_rules" : null,
    "custom_details" : null,
    "last_modified_on" : "2024-09-16T12:17:20.768Z",
    "is_active" : true
  },
  {
    // requesting and updating name field
    "id" : 3,
    "workflow_id" : 1,
    "expression" : "Utils.SaveField(input)",
    "success_message" : "Name received",
    "error_message" : "Name should not be empty",
    "operator" : null,
    "success_action_name" : "EvaluateRule",
    "success_expression" : null,
    "success_workflow_id" : 1,
    "success_rule_id" : 4,
    "failure_action_name" : "OutputExpression",
    "failure_expression" : "false",
    "failure_workflow_id" : 1,
    "failure_rule_id" : 3,
    "child_rules" : null,
    "custom_details" : "{\"Field\": \"visitorName\", \"Description\": \"Provide valid name\", \"Placeholder\": \"Enter your name\", \"IsInputStage\": true}",
    "last_modified_on" : "2024-09-26T10:05:28.391Z",
    "is_active" : true
  },
  {
    // branching rule cases
    "id" : 4,
    "workflow_id" : 1,
    "expression" : "true",
    "success_message" : "",
    "error_message" : "",
    "operator" : null,
    "success_action_name" : "CustomAction", // validate the selected value in custom method action
    "success_expression" : null,
    "success_workflow_id" : null,
    "success_rule_id" : null,
    "failure_action_name" : null,
    "failure_expression" : null,
    "failure_workflow_id" : null,
    "failure_rule_id" : null,
    "child_rules" : null,
    "custom_details" : "{\"values\":[{\"value\":\"Bolddesk\",\"SuccessWorkflowId\":1,\"SuccessRuleId\":5},{\"value\":\"Boldsign\",\"SuccessWorkflowId\":1,\"SuccessRuleId\":6}]}",
    "last_modified_on" : "2024-09-16T13:10:50.543Z",
    "is_active" : true
  },
  {
    //branch rule from rule id "4"
    "id" : 5,
    "workflow_id" : 1,
    "expression" : "Utils.SendMessage(input)", // send message action for selected item
    "success_message" : "Bold desk product selected",
    "error_message" : "Send message action failed",
    "operator" : null,
    "success_action_name" : "EvaluateRule",
    "success_expression" : null,
    "success_workflow_id" : 1,
    "success_rule_id" : 7,
    "failure_action_name" : null,
    "failure_expression" : null,
    "failure_workflow_id" : null,
    "failure_rule_id" : null,
    "child_rules" : null,
    "custom_details" : "{\"Message\": \"Bolddesk value selected\"}",
    "last_modified_on" : "2024-09-16T13:10:50.543Z",
    "is_active" : true
  },
  {
    //branch rule from rule id "4"
    "id" : 6,
    "workflow_id" : 1,
    "expression" : "Utils.SendMessage(input)", // send message action for selected item
    "success_message" : "Bold sign product selected",
    "error_message" : "Send message action failed",
    "operator" : null,
    "success_action_name" : "EvaluateRule",
    "success_expression" : null,
    "success_workflow_id" : 7,
    "success_rule_id" : 1,
    "failure_action_name" : null,
    "failure_expression" : null,
    "failure_workflow_id" : null,
    "failure_rule_id" : null,
    "child_rules" : null,
    "custom_details" : "{\"Message\": \"Boldsign value selected\"}",
    "last_modified_on" : "2024-09-16T13:10:50.543Z",
    "is_active" : true
  },
  {
    // flow completed
    "id" : 7,
    "workflow_id" : 1,
    "expression" : "true",
    "success_message" : "Flow completed",
    "error_message" : "Flow completed action failed",
    "operator" : null,
    "success_action_name" : "OutputExpression",
    "success_expression" : "true",
    "success_workflow_id" : null,
    "success_rule_id" : null,
    "failure_action_name" : null,
    "failure_expression" : null,
    "failure_workflow_id" : null,
    "failure_rule_id" : null,
    "child_rules" : null,
    "custom_details" : null,
    "last_modified_on" : "2024-09-16T13:10:50.543Z",
    "is_active" : true
  }
];
