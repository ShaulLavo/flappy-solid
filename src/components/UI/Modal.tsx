import { JSX } from 'solid-js/jsx-runtime'

export function Modal(props: { children: JSX.Element }) {
	return (
		<div class="fixed inset-0 bg-gray-600 bg-opacity-50 z-10 flex justify-center items-center">
			<div class="bg-white p-5 w-1/2 h-1/2 flex flex-col justify-center items-center shadow-lg">
				{props.children}
			</div>
		</div>
	)
}
