import { Component, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin, ConnectorModel, DecoratorModel, Diagram, DiagramComponent, DiagramModule, LayoutModel, LineDistribution, NodeModel, TextModel } from '@syncfusion/ej2-angular-diagrams';
import { RuleData } from '../../models/appModel';
import { RULE_DATA } from '../../data/rule-data';
Diagram.Inject(ComplexHierarchicalTree, LineDistribution);

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  imports: [DiagramModule],
  templateUrl: './workflow-diagram.component.html',
  styleUrl: './workflow-diagram.component.scss'
})
export class WorkflowDiagramComponent {
  @ViewChild('diagram') diagram!: DiagramComponent;

  public data: RuleData[] = RULE_DATA;

  public nodes: NodeModel[] = [];
  public connectors: ConnectorModel[] = [];

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

  public created(): void {
    (this.diagram as DiagramComponent).fitToPage();
  };

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
}
