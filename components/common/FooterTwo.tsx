import { useEffect, useState } from "react";
import { useScrollPosition } from "../../hooks/useScrollPosition";

const FooterTwo = ({id}) => {

  const [progress, setProgress] = useState(0); 
  const { maxScroll, position, maxSize } = useScrollPosition(id);


  const getScaledPosition = (position, maxScroll, maxSize) => {
    return position * (maxSize / maxScroll);
  }

  useEffect(() => {
    // console.log("maxScroll", maxScroll);
    console.log("position", position);
    let newPosition = getScaledPosition(position, maxScroll, maxSize);
    if (newPosition <= 25) {
      newPosition = 0;
    }
    setProgress(newPosition)
    // Do something when maxScroll changes
  }, [maxScroll, position]);
  
  return (
    <div className="footer-two-container">
      <div
        className="footer-prog"
        style={{width: progress, maxWidth: maxSize}}
      >
      test
      </div>
    </div>
  )
}

export default FooterTwo;