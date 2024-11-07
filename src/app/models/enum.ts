export enum TextFormatEnum {
  Text = 2,
  Html = 1,
  Markdown = 3
}

export enum ChatWorkflowBlockTypeEnum {
  GetCustomerDetails = 3,
  GetPickerInput = 4,
  GetTextInput = 5,
  SendTextMessage = 6,
  SetConversationField = 7,
  AutoAssignment = 8,
  BranchOnConversationField = 9,
  BranchOnPickerInput = 10,
  CallAnotherWorkflow = 11,
  EndCurrentWorkflow = 12
}

export enum ChatWorkflowEditorTypeEnum
{
    None = 0,
    Boolean = 1,
    Buttons = 2,
    Dropdown = 3,
    MultiSelect = 4,
    List = 5,
    Card = 6,
    Text = 7,
    TextArea = 8,
    Date = 9,
    DateTime = 10,
    Number = 11,
    Decimal = 12,
    Regex = 13,
    ButtonsBranch = 14,
    DropdownBranch = 15,
    ListBranch = 16,
    CardBranch = 17,
    Name = 18,
    Email = 19,
    PhoneNumber = 20,
    LinkRequester = 21
}