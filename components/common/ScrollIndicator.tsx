import { motion, useScroll } from "framer-motion"
import style from "../../styles/ScrollIndicator.module.css"
function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div className={style.progressbar} 
    style={{scaleX: scrollYProgress }} />  
  )
}

export default ScrollIndicator;