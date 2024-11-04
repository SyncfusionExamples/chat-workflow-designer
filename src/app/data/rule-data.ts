import { RuleData, RuleData2 } from "../models/appModel";


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

export const RULE_DATA2: RuleData2[] = [
    {
      "id": 1,
      "chatWorkflowId": 1,
      "successWorkflowId": 1,
      "successRuleId": 2,
      "isActive": true,
      "chatWorkflowBlockId": 3,
      "chatWorkflowEditorTypeId": 18,
      "fieldDetails": {
        "description": "Enter valid name",
        "label": "Enter name",
        "placeholder": "Enter name",
        "apiName": "visitorName",
        "maskForAgent": false
      },
      "branchDetails": null,
      "messageDetails": null,
      "fieldOptionDetails": null
    },
    {
      "id": 2,
      "chatWorkflowId": 1,
      "successWorkflowId": 1,
      "successRuleId": 3,
      "isActive": true,
      "chatWorkflowBlockId": 3,
      "chatWorkflowEditorTypeId": 19,
      "fieldDetails": {
        "description": "Enter valid email",
        "label": "Enter email",
        "placeholder": "Enter email",
        "apiName": "visitorEmail",
        "maskForAgent": false
      },
      "branchDetails": null,
      "messageDetails": null,
      "fieldOptionDetails": null
    },
    {
      "id": 3,
      "chatWorkflowId": 1,
      "successWorkflowId": 1,
      "successRuleId": 4,
      "isActive": true,
      "chatWorkflowBlockId": 3,
      "chatWorkflowEditorTypeId": 20,
      "fieldDetails": {
        "description": "Enter valid phone number",
        "label": "Enter phone number",
        "placeholder": "Enter email phone number",
        "apiName": "visitorPhoneNo",
        "maskForAgent": false
      },
      "branchDetails": null,
      "messageDetails": null,
      "fieldOptionDetails": null
    },
    {
      "id": 4,
      "chatWorkflowId": 1,
      "successWorkflowId": 1,
      "successRuleId": 5,
      "isActive": true,
      "chatWorkflowBlockId": 3,
      "chatWorkflowEditorTypeId": 21,
      "fieldDetails": null,
      "branchDetails": null,
      "messageDetails": null,
      "fieldOptionDetails": null
    },
    {
      "id": 5,
      "chatWorkflowId": 1,
      "successWorkflowId": 1,
      "successRuleId": 6,
      "isActive": true,
      "chatWorkflowBlockId": 6,
      "chatWorkflowEditorTypeId": null,
      "messageDetails": {
        "text": "Share your query",
        "isPrivate": false,
        "textFormat": 2
      },
      "fieldDetails": null,
      "branchDetails": null,
      "fieldOptionDetails": null
    },
    {
      "id": 6,
      "chatWorkflowId": 1,
      "successWorkflowId": 1,
      "successRuleId": 7,
      "isActive": true,
      "chatWorkflowBlockId": 4,
      "chatWorkflowEditorTypeId": 1,
      "fieldDetails": {
        "description": "description for boolean",
        "label": "Select yes/no for custom field",
        "apiName": "cf_",
        "maskForAgent": false,
        "isOptional": false
      },
      "branchDetails": null,
      "messageDetails": null,
      "fieldOptionDetails": null
    },
    {
      "id": 7,
      "chatWorkflowId": 1,
      "successWorkflowId": 1,
      "successRuleId": 8,
      "isActive": true,
      "chatWorkflowBlockId": 4,
      "chatWorkflowEditorTypeId": 2,
      "fieldDetails": {
        "description": "description for buttons",
        "label": "Select any of the buttons to update custom field",
        "placeholder": "description for buttons",
        "apiName": "cf_",
        "maskForAgent": false,
        "isOptional": false
      },
      "branchDetails": null,
      "messageDetails": null,
      "fieldOptionDetails": [
        {
          "label": "Button 1",
          "value": "1"
        },
        {
          "label": "Button 2",
          "value": "2"
        }
      ]
    },
    {
      "id": 8,
      "chatWorkflowId": 1,
      "successWorkflowId": 1,
      "successRuleId": 9,
      "isActive": true,
      "chatWorkflowBlockId": 4,
    "chatWorkflowEditorTypeId": 3,
    "fieldDetails": {
      "description": "description for dropdown",
      "label": "Select an item from dropdown",
      "placeholder": "placeholder for dropdown",
      "apiName": "cf_",
      "maskForAgent": false,
      "useAPI": false,
      "isOptional": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": [
      {
        "label": "Item 1",
        "value": "1"
      },
      {
        "label": "Item 2",
        "value": "2"
      }
    ]
  },
  {
    "id": 9,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 10,
    "isActive": true,
    "chatWorkflowBlockId": 4,
    "chatWorkflowEditorTypeId": 4,
    "fieldDetails": {
      "description": "description for multi select",
      "label": "Select multi-select items to update field",
      "placeholder": "placeholder for multi select",
      "apiName": "cf_",
      "fieldValidation": {
        "max": "2",
        "min": "1"
      },
      "maskForAgent": false,
      "useAPI": false,
      "isOptional": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": [
      {
        "label": "Item 1",
        "value": "1"
      },
      {
        "label": "Item 2",
        "value": "2"
      }
    ]
  },
  {
    "id": 10,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 11,
    "isActive": true,
    "chatWorkflowBlockId": 5,
    "chatWorkflowEditorTypeId": 9,
    "fieldDetails": {
      "description": "description for date",
      "label": "Pick a date for field update",
      "placeholder": "placeholder for date",
      "apiName": "cf_",
      "fieldValidation": {
        "max": "2024-10-25T00:00:00Z",
        "min": "2000-10-25T00:00:00Z"
      },
      "maskForAgent": false,
      "isOptional": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 11,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 12,
    "isActive": true,
    "chatWorkflowBlockId": 5,
    "chatWorkflowEditorTypeId": 10,
    "fieldDetails": {
      "description": "description for date",
      "label": "Pick a date with time for field update",
      "placeholder": "placeholder for date",
      "apiName": "cf_",
      "fieldValidation": {
        "max": "2024-10-25T14:30:00Z",
        "min": "2000-10-25T14:30:00Z"
      },
      "maskForAgent": false,
      "isOptional": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 12,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 13,
    "isActive": true,
    "chatWorkflowBlockId": 5,
    "chatWorkflowEditorTypeId": 11,
    "fieldDetails": {
      "description": "description for number",
      "label": "Provide a number to update field",
      "placeholder": "placeholder for number",
      "apiName": "cf_",
      "fieldValidation": {
        "max": "100",
        "min": "1"
      },
      "maskForAgent": false,
      "isOptional": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 13,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 14,
    "isActive": true,
    "chatWorkflowBlockId": 5,
    "chatWorkflowEditorTypeId": 12,
    "fieldDetails": {
      "description": "description for decimal",
      "label": "Enter decimal value",
      "placeholder": "placeholder for decimal",
      "apiName": "cf_",
      "fieldValidation": {
        "max": "100",
        "min": "1"
      },
      "maskForAgent": false,
      "isOptional": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 14,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 15,
    "isActive": true,
    "chatWorkflowBlockId": 5,
    "chatWorkflowEditorTypeId": 7,
    "fieldDetails": {
      "description": "description for text",
      "label": "Enter a valid text",
      "placeholder": "placeholder for text",
      "apiName": "cf_",
      "fieldValidation": {
        "max": "100"
      },
      "maskForAgent": false,
      "isOptional": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 15,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 16,
    "isActive": true,
    "chatWorkflowBlockId": 5,
    "chatWorkflowEditorTypeId": 8,
    "fieldDetails": {
      "description": "description for text area",
      "label": "Enter the description about your requirement",
      "placeholder": "placeholder for text area",
      "apiName": "cf_",
      "fieldValidation": {
        "max": "100"
      },
      "maskForAgent": false,
      "isOptional": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 16,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 17,
    "isActive": true,
    "chatWorkflowBlockId": 5,
    "chatWorkflowEditorTypeId": 13,
    "fieldDetails": {
      "description": "Enter regex format",
      "label": "Label for regex",
      "placeholder": "Enter regex",
      "apiName": "cf_regex",
      "fieldValidation": {
        "regex": "^abc"
      },
      "maskForAgent": false,
      "isOptional": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 17,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 18,
    "isActive": true,
    "chatWorkflowBlockId": 7,
    "chatWorkflowEditorTypeId": null,
    "fieldDetails": {
      "apiName": "chatPriority",
      "value": "1"
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 18,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 19,
    "isActive": true,
    "chatWorkflowBlockId": 8,
    "chatWorkflowEditorTypeId": null,
    "fieldDetails": {
      "groupId": 1,
      "ruleType": 2
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 19,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 9,
    "chatWorkflowEditorTypeId": null,
    "fieldDetails": null,
    "branchDetails": [
      {
        "id": 1,
        "type": "if",
        "name": "QBCondition1",
        "successRuleId": 20,
        "successWorkflowId": 1
      },
      {
        "id": 2,
        "type": "else if",
        "name": "QBCondition2",
        "successRuleId": 28,
        "successWorkflowId": 1
      },
      {
        "id": 3,
        "type": "else",
        "name": "QBCondition3",
        "successRuleId": 29,
        "successWorkflowId": 1
      }
    ],
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 20,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 10,
    "chatWorkflowEditorTypeId": 14,
    "fieldDetails": null,
    "branchDetails": [
      {
        "successRuleId": 21,
        "successWorkflowId": 1,
        "value": "1"
      },
      {
        "successRuleId": 27,
        "successWorkflowId": 1,
        "value": "2"
      }
    ],
    "messageDetails": null,
    "fieldOptionDetails": [
      {
        "label": "Sales",
        "value": "1"
      },
      {
        "label": "Marketing",
        "value": "2"
      }
    ]
  },
  {
    "id": 21,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 10,
    "chatWorkflowEditorTypeId": 16,
    "fieldDetails": null,
    "branchDetails": [
      {
        "successRuleId": 22,
        "successWorkflowId": 1,
        "value": "1"
      },
      {
        "successRuleId": 26,
        "successWorkflowId": 1,
        "value": "2"
      }
    ],
    "messageDetails": null,
    "fieldOptionDetails": [
      {
        "label": "Sales",
        "value": "1"
      },
      {
        "label": "Marketing",
        "value": "2"
      }
    ]
  },
  {
    "id": 22,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 10,
    "chatWorkflowEditorTypeId": 15,
    "fieldDetails": null,
    "branchDetails": [
      {
        "successRuleId": 23,
        "successWorkflowId": 1,
        "value": "2"
      },
      {
        "successRuleId": 25,
        "successWorkflowId": 1,
        "value": "1"
      }
    ],
    "messageDetails": null,
    "fieldOptionDetails": [
      {
        "label": "Sales",
        "value": "1"
      },
      {
        "label": "Marketing",
        "value": "2"
      }
    ]
  },
  {
    "id": 23,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": 24,
    "isActive": true,
    "chatWorkflowBlockId": 6,
    "chatWorkflowEditorTypeId": null,
    "messageDetails": {
      "text": "Marketing item selected in dropdown branching",
      "isPrivate": false,
      "textFormat": 2
    },
    "fieldDetails": null,
    "branchDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 24,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 12,
    "chatWorkflowEditorTypeId": null,
    "fieldDetails": null,
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 25,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 6,
    "chatWorkflowEditorTypeId": null,
    "messageDetails": {
      "text": "Sales item selected in dropdown branching",
      "isPrivate": false,
      "textFormat": 2
    },
    "fieldDetails": null,
    "branchDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 26,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 6,
    "chatWorkflowEditorTypeId": null,
    "messageDetails": {
      "text": "Marketing item selected in list branching",
      "isPrivate": false,
      "textFormat": 2
    },
    "fieldDetails": null,
    "branchDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 27,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 6,
    "chatWorkflowEditorTypeId": null,
    "messageDetails": {
      "text": "Marketing item selected in button branching",
      "isPrivate": false,
      "textFormat": 2
    },
    "fieldDetails": null,
    "branchDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 28,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 6,
    "chatWorkflowEditorTypeId": null,
    "messageDetails": {
      "text": "QBCondition2 condition becomes true",
      "isPrivate": false,
      "textFormat": 2
    },
    "fieldDetails": null,
    "branchDetails": null,
    "fieldOptionDetails": null
  },
  {
    "id": 29,
    "chatWorkflowId": 1,
    "successWorkflowId": null,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 6,
    "chatWorkflowEditorTypeId": null,
    "messageDetails": {
      "text": "QBCondition3 condition becomes true",
      "isPrivate": false,
      "textFormat": 2
    },
    "fieldDetails": null,
    "branchDetails": null,
    "fieldOptionDetails": null
  }
];

export const RULE_DATA3: RuleData2[] = [
  {
    "id": 1,
    "chatWorkflowId": 1,
    "successWorkflowId": 1,
    "successRuleId": null,
    "isActive": true,
    "chatWorkflowBlockId": 3,
    "chatWorkflowEditorTypeId": 18,
    "fieldDetails": {
      "description": "Enter valid name",
      "label": "Enter name",
      "placeholder": "Enter name",
      "apiName": "visitorName",
      "maskForAgent": false
    },
    "branchDetails": null,
    "messageDetails": null,
    "fieldOptionDetails": null
  }]