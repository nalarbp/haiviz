import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

// custom hooks to observe dimension's change
const useWidthObserver = ref => {
  const [width, setWidth] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeWidthObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setWidth(entry.contentRect.width);
      });
    });
    resizeWidthObserver.observe(observeTarget);
    return () => {
      resizeWidthObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return width;
};

export default useWidthObserver;
