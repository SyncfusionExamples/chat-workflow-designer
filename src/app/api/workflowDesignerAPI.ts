export interface WorkflowListPathsType {
    readonly updateWorkflowRules: string;
    readonly deleteWorkflowRules: string;
}

// Define the path template once
const workflowRulesPath = `{baseUrl}/{workflowId}/rules/{ruleId}`;

const apiPaths: WorkflowListPathsType = {
    updateWorkflowRules: workflowRulesPath,
    deleteWorkflowRules: workflowRulesPath,
}

export const WorkflowApiPaths: WorkflowListPathsType = apiPaths;