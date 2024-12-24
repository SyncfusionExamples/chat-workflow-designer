export interface WorkflowListPathsType {
    readonly updateWorkflowRules: string;
    readonly deleteWorkflowRules: string;
}

const apiPaths: WorkflowListPathsType = {
    updateWorkflowRules: `{baseUrl}/{workflowId}/rules/{ruleId}/update`,
    deleteWorkflowRules: `{baseUrl}/rules/{ruleId}/delete`,
}

export const WorkflowApiPaths: WorkflowListPathsType = apiPaths;