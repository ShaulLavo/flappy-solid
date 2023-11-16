import { JSX } from 'solid-js/jsx-runtime'

interface ButtonProps {
	text?: string
	onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
	isPressed?: () => boolean
	children?: JSX.Element
}

function Button(props: ButtonProps) {
	return (
		<>
			<button
				class={
					'bg-black text-white font-semibold py-2 px-4 rounded outline-none m-2 text-center inline-flex items-center' +
					'transition duration-100 ease-in-out hover:bg-black/70 active:bg-black/40' +
					(props.isPressed && props.isPressed() ? ' bg-black/40' : '')
				}
				onClick={props.onClick}>
				{props.text}
				{props.children}
			</button>
		</>
	)
}

export default Button
