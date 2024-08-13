import { motion } from 'framer-motion'

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const onTheRight = { y: '0%', opacity: 0 }
	const inTheCenter = { y: 0, opacity: 1 }
	const onTheLeft = { y: '0%', opacity: 0 }

	const transition = { duration: .7, ease: 'easeInOut' }

	return (
		<motion.div
			initial={onTheRight}
			animate={inTheCenter}
			exit={onTheLeft}
			transition={transition}
		>
			{children}
		</motion.div>

	)
}

export default PageTransition;