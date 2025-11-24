import React, { CSSProperties, ReactNode } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

/**
 * Props for the FadeAnimation component
 */
interface FadeAnimationProps {
	/** Optional inline styles to apply to the wrapper */
	style?: CSSProperties;
	/** Optional CSS class name for the wrapper */
	className?: string;
	/** Whether the animation should appear on mount */
	appear?: boolean;
	/** Child elements to animate */
	children?: ReactNode;
}

/**
 * FadeAnimation Component
 * 
 * A reusable animation wrapper that applies fade-in/fade-out transitions to its children.
 * Uses react-transition-group for smooth CSS transitions.
 * 
 * @component
 * @example
 * ```tsx
 * <FadeAnimation className="my-list">
 *   {items.map(item => <Item key={item.id} {...item} />)}
 * </FadeAnimation>
 * ```
 */
const FadeAnimation = React.forwardRef<HTMLDivElement, FadeAnimationProps>(
	(props, ref) => {
		const { style, className, appear, children } = props;

		return (
			<TransitionGroup 
				style={style} 
				className={className}
				appear={appear}
			>
				{React.Children.map(children, (child) => {
					return (
						<CSSTransition
							classNames="fade"
							timeout={300}
							mountOnEnter={true}
							unmountOnExit={true}
						>
							{child}
						</CSSTransition>
					);
				})}
			</TransitionGroup>
		);
	}
);

FadeAnimation.displayName = "FadeAnimation";

export default FadeAnimation;