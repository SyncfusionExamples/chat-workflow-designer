import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { DiagramComponent, DiagramModule, NodeModel, SelectorConstraints, SelectorModel, UserHandleEventsArgs, UserHandleModel } from '@syncfusion/ej2-angular-diagrams';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [DiagramModule, DialogModule, CommonModule],
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss'
})
export class WorkflowComponent {
  @ViewChild('flowdiagram') flowdiagram!: DiagramComponent;
  @ViewChild('dialogBlock') dialogBlock!: DialogComponent;
  
  public nodes: NodeModel[] = [
    { id: 'entryNode', offsetX: 650, offsetY: 200, width: 80, height: 40,
      shape: {  type: 'Flow', shape: 'Terminator' },
      style: { fill: 'skyblue' },
      annotations: [{ content: 'Start' }]
    },
  ]
  
  public plusIconHandles: UserHandleModel[] = [
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
    userHandles: this.plusIconHandles,
  };

  public isDialogVisible: boolean = false;

  public dialogPosition : object={ X: 'center', Y: 'center' };

  // For checking the dialog component
  ngAfterViewInit(): void {
    // Check if the dialog is initialized
    console.log('Dialog:', this.dialogBlock);  // Should not log "undefined"
    this.isDialogVisible = false;
    const entryNode = document.getElementById('entryNode');
    if (entryNode) {
      entryNode.onclick = this.onEntryNodeClick.bind(this);
    }
  }

  public created(): void {
    const entryNode = document.getElementById('entryNode');
    if (entryNode) {
      entryNode.onclick = this.onEntryNodeClick.bind(this);
    }
  }

  public onEntryNodeClick(): void {
    const handle = this.plusIconHandles[0];
    handle.offset = 0.5; // Center the handle horizontally

    // Update selected items to include the user handle
    this.selectedItems.userHandles = [handle];
    this.flowdiagram.selectedItems = this.selectedItems;

    // Update the diagram to reflect changes
    this.flowdiagram.dataBind();
  }

  /*public getCustomTool: Function = this.getTool.bind(this);

  public getTool(action: string): void {
    if (action === "plusIcon") {
      this.dialogBlock.visible= true;
      this.isDialogVisible = true;
      if(this.flowdiagram.selectedItems.nodes)
        {
          const selectedNode = this.flowdiagram.selectedItems.nodes[0];
      
          if (selectedNode && selectedNode.wrapper && selectedNode.width && this.dialogBlock?.position) {
            const nodeBounds = selectedNode.wrapper.bounds;
            const dialogPosition = {
              X: (nodeBounds.x + selectedNode.width + 10) + 'px',
              Y: nodeBounds.y + 'px'
            };
            
            this.dialogBlock.position = dialogPosition; // Set dialog position
          }
        }
    } else {
      this.isDialogVisible = false;
    }
    this.flowdiagram.dataBind();
  }*/

  public onNodeClick(args: any): void {
    if(args.element.id === 'entryNode') {
      if(this.flowdiagram.selectedItems.userHandles)
        this.flowdiagram.selectedItems.userHandles[0].visible = true;
    }
  }
  
  public onUserHandleMouseDown: Function = (event: UserHandleEventsArgs) => {
    if(event.element.name === 'plusIcon')
    {
      this.dialogBlock.visible = true;
    }
    this.flowdiagram.dataBind();
  }

  public dialogOverlayClick(): void {
    this.isDialogVisible = false;
  }

  public dialogHeader(): string {
    return 'Choose an option'; // Replace with your desired header logic
  }

  public onCloseDialog(): void {
    this.dialogBlock?.hide();
    // Optionally reset or handle additional logic when dialog closes
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
