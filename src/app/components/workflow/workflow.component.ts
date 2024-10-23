import { Component, ViewChild } from '@angular/core';
import { DiagramComponent, DiagramModule, IClickEventArgs, Node, NodeModel, SelectorConstraints, SelectorModel, UserHandleEventsArgs, UserHandleModel } from '@syncfusion/ej2-angular-diagrams';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [DiagramModule, DialogModule],
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss'
})
export class WorkflowComponent{
  
  @ViewChild('flowdiagram') flowdiagram!: DiagramComponent;
  @ViewChild('dialogBlock') dialogBlock!: DialogComponent;
  
  public nodes: NodeModel[] = [
    { id: 'entryNode', offsetX: 650, offsetY: 200, width: 80, height: 40,
      shape: {  type: 'Flow', shape: 'Terminator' },
      style: { fill: 'skyblue' },
      annotations: [{ content: 'Start' }]
    },
  ]
  
  public dialogPosition : object={ X: 'center', Y: 'center' };

  public handles: UserHandleModel[] = [
    {
      name: 'plusIcon',
      pathData:
        'M12 0C11.4477 0 11 0.447715 11 1V11H1C0.447715 11 0 11.4477 0 12C0 12.5523 0.447715 13 1 13H11V23C11 23.5523 11.4477 24 12 24C12.5523 24 13 23.5523 13 23V13H23C23.5523 13 24 12.5523 24 12C24 11.4477 23.5523 11 23 11H13V1C13 0.447715 12.5523 0 12 0Z',
      visible: false,
      offset: 0.5,
      side: 'Bottom',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      backgroundColor: 'skyblue',
    }
  ];

  public selectedItems: SelectorModel = {
    constraints: SelectorConstraints.UserHandle,
    userHandles: this.handles,
  };

  onDialogCreated(): void {
    this.dialogBlock.hide();
  }

  public onNodeClick(args: IClickEventArgs): void {
    if(args.actualObject instanceof Node) {
      if(this.flowdiagram.selectedItems.userHandles) {
        this.flowdiagram.selectedItems.userHandles[0].visible = true;
      }
    } else {
      this.dialogBlock.visible = false;
    }
  }

  public onUserHandleMouseDown(event: UserHandleEventsArgs) {
    if(event.element.name === 'plusIcon') {
      if (this.flowdiagram.selectedItems.nodes && this.dialogBlock)
      {
        const selectedNode = this.flowdiagram.selectedItems.nodes[0];
      if (selectedNode && selectedNode.wrapper) {
        const nodeBounds = selectedNode.wrapper.bounds;
        const dialogWidth = this.dialogBlock.width as number;  // Ensure width is a number
        this.dialogPosition = {
          X: (nodeBounds.x + nodeBounds.width / 2 - dialogWidth / 2) + 'px',
          Y: (nodeBounds.y + nodeBounds.height + 30) + 'px'
        };
      }
      }
      
      this.dialogBlock.visible = true;
    }
    this.flowdiagram.dataBind();
  }

  public onCloseDialog(): void {
    this.dialogBlock.visible = false;
  }

  // Dialog option handlers
  handleEvent() {
    console.log('Event selected');
    // Add logic for event
  }

  handleAction() {
    console.log('Action selected');
    // Add logic for action
  }

  handleCondition() {
    console.log('Condition selected');
    // Add logic for condition
  }

  handleExit() {
    // Hide the dialog and remove the user handle
    console.log('Exit selected');
  }
}
