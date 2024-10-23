import { Component, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin, Connector, ConnectorModel, DecoratorModel, Diagram,  DiagramComponent, DiagramModule, IClickEventArgs, LayoutModel, LineDistribution, Node, NodeModel, SelectorConstraints, SelectorModel, TextModel, UserHandleEventsArgs, UserHandleModel } from '@syncfusion/ej2-angular-diagrams';
import { RuleData } from '../../models/appModel';
import { RULE_DATA } from '../../data/rule-data';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';

Diagram.Inject(ComplexHierarchicalTree, LineDistribution);

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  imports: [DiagramModule, DialogModule],
  templateUrl: './workflow-diagram.component.html',
  styleUrl: './workflow-diagram.component.scss'
})
export class WorkflowDiagramComponent {
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('dialog') dialog!: DialogComponent;

  public data: RuleData[] = RULE_DATA;

  public nodes: NodeModel[] = [];
  public connectors: ConnectorModel[] = [];
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

  constructor() {
    // Initialize nodes and connectors based on the data
    this.initializeDiagramElements();
  }
  private initializeDiagramElements(): void {
    this.data.forEach(item => {
      // Create nodes based on the data
      this.nodes.push({
        id: `node${item.id}`,
        annotations: [{ content: `Node ${item['id']}` }],
      });

      // Create connectors from success_rule_id
      if (item['success_rule_id']) {
        this.connectors.push({
          id: `connector${item['id']}-s${item['success_rule_id']}`,
          sourceID: `node${item['id']}`,
          targetID: `node${item['success_rule_id']}`,
          annotations: [{ content: 'success', alignment: 'Center'}]
        });
      }

      // Create connectors from failure_rule_id
      if (item['failure_rule_id']) {
        this.connectors.push({
          id: `connector${item['id']}-f${item['failure_rule_id']}`,
          sourceID: `node${item['id']}`,
          targetID: `node${item['failure_rule_id']}`,
          annotations: [{ content: 'failure', alignment: 'Center'}]
        });
      }
    });
  }

  public onDiagramCreated(): void {
    (this.diagram as DiagramComponent).fitToPage();
  };

  public selectedItems: SelectorModel = {
    constraints: SelectorConstraints.UserHandle,
    userHandles: this.handles,
  };

  onDialogCreated(): void {
    this.dialog.hide();
  }

  public layout: LayoutModel = {
    type: 'ComplexHierarchicalTree',
    connectionPointOrigin: ConnectionPointOrigin.DifferentPoint,
    horizontalSpacing: 40,
    verticalSpacing: 40,
    horizontalAlignment: 'Left',
    verticalAlignment: 'Top',
    margin: { left: 0, right: 0, top: 0, bottom: 0 },
    orientation: 'TopToBottom',
  };

  public getNodeDefaults(obj: NodeModel): NodeModel {
    obj.width = 70;
    obj.height = 70;
    // obj.annotations = [{ content: obj.id }];
    obj.style = {
      fill: '#6BA5D7',
      strokeColor: 'none',
      strokeWidth: 2,
    };
    obj.borderColor = 'black';
    obj.backgroundColor = '#6BA5D7';
    obj.borderWidth = 1;
    (obj.shape as TextModel).margin = {
      left: 5,
      right: 5,
      top: 5,
      bottom: 5,
    };
    return obj;
  }

  public getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    (
      (connector as ConnectorModel).targetDecorator as DecoratorModel
    ).height = 5;
    ((connector as ConnectorModel).targetDecorator as DecoratorModel).width = 5;
    connector.style = { strokeColor: '#6BA5D7', strokeWidth: 1 };
    return connector;
  }

  public onNodeClick(args: IClickEventArgs): void {
    if (args.actualObject instanceof Node) {
      console.log('Node:', args.actualObject);
      if(this.diagram.selectedItems.userHandles) {
        this.diagram.selectedItems.userHandles[0].visible = true;
      }
    } else if (args.actualObject instanceof Connector){
      console.log('Connector:', args.actualObject);
      if(this.diagram.selectedItems.userHandles) 
        this.diagram.selectedItems.userHandles[0].visible = false;
      this.dialog.visible = false;
    }
    this.diagram.dataBind();
  }

  public onUserHandleMouseDown(event: UserHandleEventsArgs) {
    if(event.element.name === 'plusIcon') {
      if (this.diagram.selectedItems.nodes && this.dialog)
      {
        const selectedNode = this.diagram.selectedItems.nodes[0];
        if (selectedNode && selectedNode.wrapper) {
          const nodeBounds = selectedNode.wrapper.bounds;
          const dialogWidth = this.dialog.width as number;  // Ensure width is a number
          this.dialogPosition = {
            X: (nodeBounds.x + nodeBounds.width / 2 - dialogWidth / 2) + 'px',
            Y: (nodeBounds.y + nodeBounds.height + 30) + 'px'
          };
        }
      }
      this.dialog.visible = true;
    }
    this.diagram.dataBind();
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

  public onCloseDialog(): void {
    this.dialog.visible = false;
  }
}
