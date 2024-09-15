import { use, useEffect, useRef, useState } from "react";

type ElementItems = {
  maxScrollHeight: number;
  maxScrollWidth: number; // will be the max scroll width
  height: number;
  width: number;
  horizontalScroll: number;
  verticalScroll: number;
} | null;

// give the html element of the scroll container
export const useScrollPosition = (prop: string) => {
  // useState so we can react to size changes
  const [maxScroll, setMaxScroll] = useState(0);
  const [position, setPosition] = useState(0);
  const elementRef = useRef<ElementItems>(null);

  // convert to our ref to track changes ... I think
  const setElement = (element: HTMLElement) => {
    console.log("element set")
    if (element?.scrollHeight) {
      elementRef.current = {
        ...elementRef.current,
        maxScrollWidth: element.scrollHeight,
      }
    }
    if (element?.scrollWidth) {
      elementRef.current = {
        ...elementRef.current,
        maxScrollWidth: element.scrollWidth,
      }
    }
    if (element?.clientHeight) {
      elementRef.current = {
        ...elementRef.current,
        height: element.clientHeight,
      }
    }
    if (element?.clientWidth) {
      elementRef.current = {
        ...elementRef.current,
        width: element.clientWidth
      }
    }
    // if scrolling horizontally
    if (element?.scrollLeft) {
      elementRef.current = {
        ...elementRef.current,
        horizontalScroll: element.scrollLeft,
      }
    }
    // if scrolling vertically
    if (element?.scrollTop) {
      elementRef.current = {
        ...elementRef.current,
        verticalScroll: element.scrollTop,
      }
    }
  }

  // update maxScroll and position
  const handleElementUpdates = () => {
    // console.log("element", elementRef.current);
    if (elementRef.current === null) return;
    // scrolling horizontally
    if (elementRef.current?.horizontalScroll && !elementRef.current?.verticalScroll) {
      const maxScrollWidth = elementRef.current?.maxScrollWidth - elementRef.current?.width;
      setMaxScroll(maxScrollWidth || 0);
      setPosition(elementRef.current?.horizontalScroll || 0);
    } 
    // scrolling vertically
    else if (elementRef.current?.verticalScroll && !elementRef.current?.horizontalScroll) {
      const maxScrollHeight = elementRef.current?.maxScrollHeight - elementRef.current?.height;
      setMaxScroll(maxScrollHeight || 0);
      setPosition(elementRef.current?.verticalScroll || 0);
    }
  }

  /* 
  I wanted to be able to update our exposed values whenever we update elementRef by listening to the changes to the ref to avoid having to call in
  each eventListener. I thought useEffect would allow me to do this but it doesn't seem to work for some reason. Anybody know why? 
  TODO: Fix or remove commented out code
  */
 // useEffect(() => {
 //   handleElementUpdates();
 // }, [elementRef.current]);


  useEffect(() => {
    const scrollContainer = document.getElementById(prop);
    // do not proceed if you can't find the element
    if (!scrollContainer) { return;} 
    // set the element initial values
    setElement(scrollContainer);

    // TODO: handle more events
    window.addEventListener('wheel', () => {
      if (scrollContainer) {
        setElement(scrollContainer);
        handleElementUpdates();
      }
    });

    // TODO handle scroll event
    return () => {
      window.removeEventListener('wheel', () => {
        if (scrollContainer) {
          setElement(scrollContainer);
          handleElementUpdates();
        }
      });
    }

  }, []);

  return { maxScroll, position }
}