import { dia, mvc } from "jointjs";
import React, { useRef, useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { GraphContext } from "./GraphContext";
import { PaperContext } from "./PaperContext";
import { getCustomElementTools } from "./tools";

export const PORTAL_READY_EVENT = "portal:ready";

export function Paper({
  children,
  options,
  renderElement,
  onReady,
  onEvent,
  style,
  dataAttributes = ["data"],
  portalSelector = "portal",
}) {
  const paperWrapperElRef = useRef(null);
  const paperRef = useRef(null);

  const [graph] = useContext(GraphContext);
  const [, setPaperContext] = useContext(PaperContext) ?? [];

  const customElementTools = getCustomElementTools(graph);

  const [elements, setElements] = useState({});
  const setElement = (model, containerEl) => {
    setElements((prevState) => {
      const id = model.id;
      return {
        ...prevState,
        [id]: {
          id,
          data: model.get("data"),
          containerEl: containerEl ?? prevState[id]?.containerEl,
        },
      };
    });
  };

  const resizePaperWrapper = (paper) => {
    paperWrapperElRef.current.style.width = paper.el.style.width;
    paperWrapperElRef.current.style.height = paper.el.style.height;
  };

  const createElementPortal = ({ id, containerEl }) => {
    if (!containerEl) return null;
    const element = graph.getCell(id);
    if (!element) return null;
    return createPortal(renderElement(element), containerEl);
  };

  const ElementView = dia.ElementView.extend({
    onRender() {
      let portalEl =
        typeof portalSelector === "function"
          ? portalSelector(this)
          : portalSelector;
      if (typeof portalEl === "string") {
        [portalEl] = this.findBySelector(portalEl);
      }
      portalEl && this.notify(PORTAL_READY_EVENT, portalEl);
    },
  });

  let elementPortals = null;
  if (renderElement) {
    elementPortals = Object.values(elements).map(createElementPortal);
  }

  const bindEvents = (paper) => {
    // An object to keep track of the listeners. It's not exposed, so the users
    // can't undesirably remove the listeners.
    const controller = new mvc.Listener();

    // Update the elements state when the graph data changes
    const attributeChangeEvents = dataAttributes
      .map((attribute) => `change:${attribute}`)
      .join(" ");

    controller.listenTo(graph, attributeChangeEvents, (cell) =>
      setElement(cell)
    );
    // Update the portal node reference when the element view is rendered
    controller.listenTo(paper, PORTAL_READY_EVENT, (elementView, portalEl) =>
      setElement(elementView.model, portalEl)
    );

    controller.listenTo(paper, "resize", () => resizeWrapper(paper));

    if (onEvent) {
      controller.listenTo(paper, "all", (...args) => onEvent(paper, ...args));
    }

    return () => controller.stopListening();
  };

  useEffect(() => {
    const paper = new dia.Paper({
      width: "100%",
      height: "100%",
      async: true,
      sorting: dia.Paper.sorting.APPROX,
      preventDefaultBlankAction: false,
      // TODO: It is possible to override it. We need to instruct
      // the users to trigger the PORTAL_READY_EVENT event manually
      // or find a better way to do it (e.g. trigger the event in JointJS)
      elementView: ElementView,
      ...options,
      frozen: true,
      model: graph,
    });

    // Graph event listener - triggers on additions to Paper
    graph.on('add', function(cell) {
      // Removes arrowheads from links
      if (cell instanceof dia.Link) {
          cell.attr('.marker-arrowhead-group', { display: 'none' });
        }
  });

    // Graph even listener - triggers on link connection
    graph.on("add:link", function(link){
      // console.log('LINKADD');
      // if ( link.get('source').id && link.get('target').id ){
      //   link.hideTools();
      // }
    });
    
    // Add a click event listener to the Paper component
    paper.on("cell:pointerclick", (cellView, evt, x, y) => {
      var cell = cellView.model;
      console.log("Shape clicked", cell.attributes.attrs);
      // Add your custom logic here
      
      console.log(cellView.model.prop("custom/type"));

      if(cell.isElement()){
        customElementTools.attachElementTool(cellView); 
      }
      if(cell.isLink()){
        customElementTools.attachLinkTool(cellView); 
      }
      cell.prop("custom/isActive") == "true" ? cell.prop("custom/isActive", "false") : cell.prop("custom/isActive", "true");
    
    });

    paper.on("cell:mouseenter", (cellView, evt, x, y) => {
      // cellView.showTools();
    });

    paper.on("cell:mouseleave", (cellView, evt, x, y) => {
      if(cellView.model.prop("custom/isActive") == "false"){
        cellView.hideTools();
      }
    });

    paper.el.style.boxSizing = "border-box";
    paperWrapperElRef.current.appendChild(paper.el);
    resizePaperWrapper(paper);
    paper.unfreeze();

    paperRef.current = paper;
    setPaperContext && setPaperContext(paper);

    const unbindEvents = bindEvents(paper);
    if (onReady) {
      onReady(paper);
    }

    return () => {
      paper.remove();
      unbindEvents();
      setPaperContext && setPaperContext(null);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, setPaperContext]); // options, onReady, onEvent, style

  return (
    <div ref={paperWrapperElRef} style={style}>
      <PaperContext.Provider value={[paperRef.current, setPaperContext]}>
        {elementPortals}
        {children}
      </PaperContext.Provider>
    </div>
  );
}
