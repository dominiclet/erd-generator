import {elementTools, linkTools, dia, shapes} from 'jointjs';

const customElementTools = {
    // Function to create and attach element tools
    attachElementTool: function(elementView){
        var elementToolsView = new dia.ToolsView({
          tools: [new elementTools.Remove({
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
                  new elementTools.Boundary(),
                  new AddAttributeButton({offset: {x: 10, y: -20}}),
                  new SettingsButton({offset: {x: 40, y: -20}}),
                  new elementTools.Connect()
                ],
        });
        elementView.addTools(elementToolsView);
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
            const cylinder = new shapes.standard.Cylinder({
                size: { width: 20, height: 20 },
                attrs: {
                  label: {
                    text: "attribute",
                  },
                },
              });
              // How do i get the canvas reference from this tool??
              canvasRef.current.addShape(cylinder);
              cylinder.prop("custom/type", "attribute");
        },
    },
});

export default customElementTools;