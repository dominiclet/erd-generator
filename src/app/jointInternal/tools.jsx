import {elementTools, linkTools, dia, shapes} from 'jointjs';
import { doc, erd } from '../page';

export const getCustomElementTools = (graph) => {
  const AddAttrButton = getAddAttrBtnConstructor(graph);
  const customElementTools = {
      // Function to create and attach element tools
      attachElementTool: function(elementView){
          var toolsList = [
            new elementTools.Boundary(),
            new elementTools.Connect(),
            new elementTools.Remove({
            markup: [{
                tagName: 'circle',
                selector: 'button',
                attributes:{
                    'r': 10,
                    'fill':'#ed0028',
                    'cursor': 'pointer',
                }
            }],
            offset: {x: -20, y:-20},  
          }), 
          // new SettingsButton({offset: {x: 40, y: -20}}),
        ];

        if(elementView.model.prop("custom/type") == "entity"){
          toolsList.push(new AddAttrButton({offset: {x: 10, y: -20}}));
        };
        if(elementView.model.prop("custom/type") == "attribute"){
          toolsList.push(new TogglePrimaryButton({offset: {x: 10, y: -20}}));
        };
        elementView.addTools(new dia.ToolsView({
          tools: toolsList,
        }));
      },
        // Function to create and attach link tools
        attachLinkTool: function(linkView){
          var linkToolsView = new dia.ToolsView({
            tools: [
                    // distance attribute determines button distance from the left linked item (ON link-line) 
                    new elementTools.Boundary(),
                  //   new SettingsButton({distance:150}),
                  ],
          });
          linkView.addTools(linkToolsView);
        }
  }
  return customElementTools;
}

const SettingsButton = elementTools.Button.extend ({
    name: 'Settings-button',
    options: {
        markup: [{
            tagName: 'circle',
            selector: 'button',
            attributes: {
                'r': 10,
                'fill': '#0e6121',
                'cursor': 'pointer'
            }
        }],
        rotate: true,
        action: function(evt, elementView, buttonView) {
            alert("Add modal edit window here");
        }
    }
});

const getAddAttrBtnConstructor = (graph) => {
  const AddAttributeButton = elementTools.Button.extend ({
      name: 'AddAttribute-button',
      options: {
          markup: [{
              tagName: 'circle',
              selector: 'button',
              attributes: {
                  'r': 10,
                  'fill': '#f2ff00',
                  'cursor': 'pointer'
              }
          }],
          rotate: true,
          action: function(evt, elementView, buttonView) {
              let entityId = this.model.attributes.attrs.label.text;
              let entityNo = entityId.split("_")[1];
              let entityElement = erd.getElementsByClassName(entityId)[0];
              let attribute = doc.createElement("attribute");
              let attrId = `Attribute_${entityNo}_${entityElement.children.length}`; 
              attribute.className = attrId;
              attribute.innerHTML = attrId;
              attribute.id = attrId;
              entityElement.appendChild(attribute);
              const cylinder = new shapes.standard.Cylinder({
                  size: { width: 20, height: 20 },
                  position: { x: this.model.position().x + 100, 
                              y: this.model.position().y + 200 },
                  attrs: {
                    label: {
                      text: attrId,
                    },
                  },
                });
                graph.addCell(cylinder);
                cylinder.prop("custom/type", "attribute");
                const link = new dia.Link({
                  source: {id: this.model.id},
                  target: {id: cylinder.id},
                });
                graph.addCell(link);
          },
      },
  });
  return AddAttributeButton;
}

const TogglePrimaryButton = elementTools.Button.extend ({
  name: 'TogglePrimary-button',
  options: {
      markup: [{
          tagName: 'circle',
          selector: 'button',
          attributes: {
              'r': 10,
              'fill': '#e100ff',
              'cursor': 'pointer'
          }
      }],
      rotate: true,
      action: function(evt, elementView, buttonView) {
        // Handle pressing button for attribute (makes it primary key)
        let attrId = this.model.attributes.attrs.label.text;
        let attrElement = erd.getElementsByClassName(attrId)[0];
        let isPrimary = attrElement.getAttribute("primary");
        console.log(this.model)
        if (isPrimary != null && isPrimary == "true") {
          attrElement.setAttribute("primary", "false");
          this.model.attr({label: {fill: 'black'}});
        } else {
          attrElement.setAttribute("primary", "true");
          this.model.attr({label: {fill: 'red'}});
        }
        return;
      }
  }
});

