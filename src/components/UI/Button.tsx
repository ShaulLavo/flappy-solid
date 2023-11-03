import { JSX } from 'solid-js/jsx-runtime'

interface ButtonProps {
	text: string
	onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

function Button(props: ButtonProps) {
	return (
		<button
			class="bg-black text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-gray-800"
			onClick={props.onClick}
		>
			{props.text}
		</button>
	)
}

export default Button
