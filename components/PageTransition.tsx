import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type PageTransitionProps = HTMLMotionProps<'div'>
type PageTransitionRef = React.ForwardedRef<HTMLDivElement>

function PageTransition({ children, ...rest }: PageTransitionProps, ref: PageTransitionRef) {
	const onTheRight = { y: '0%', opacity: 0 }
	const inTheCenter = { y: 0, opacity: 1 }
	const onTheLeft = { y: '0%', opacity: 0 }

	const transition = { duration: .7, ease: 'easeInOut' }

	return (
		<motion.div
			ref={ref}
			initial={onTheRight}
			animate={inTheCenter}
			exit={onTheLeft}
			transition={transition}
			{...rest}
		>
			{children}
		</motion.div>

	)
}

export default forwardRef(PageTransition)