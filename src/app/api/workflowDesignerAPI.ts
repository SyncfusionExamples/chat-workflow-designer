export interface WorkflowListPathsType {
    readonly updateWorkflowRules: string;
    readonly deleteWorkflowRules: string;
    readonly addWorkflowRules: string;
}

// Define the path template once
const workflowRulesPath = `{baseUrl}/{workflowId}/rules/{ruleId}`;

const apiPaths: WorkflowListPathsType = {
    updateWorkflowRules: workflowRulesPath,
    deleteWorkflowRules: workflowRulesPath,
    addWorkflowRules: `{baseUrl}`
}

export const WorkflowApiPaths: WorkflowListPathsType = apiPaths;