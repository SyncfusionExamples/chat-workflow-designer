export interface WorkflowListPathsType {
    readonly updateWorkflowRules: string;
    readonly deleteWorkflowRules: string;
    readonly addWorkflowRules: string;
}

const apiPaths: WorkflowListPathsType = {
    updateWorkflowRules: `{baseUrl}/{workflowId}/rules/{ruleId}/update`,
    deleteWorkflowRules: `{baseUrl}/{ruleId}/rules`,
    addWorkflowRules: `{baseUrl}`
}

export const WorkflowApiPaths: WorkflowListPathsType = apiPaths;