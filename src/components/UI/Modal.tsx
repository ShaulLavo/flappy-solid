import { JSX } from 'solid-js/jsx-runtime'

export function Modal(props: { children: JSX.Element }) {
	return (
		<div class='fixed inset-0 bg-black bg-opacity-60 z-10 flex justify-center items-center'>
			<div
				class='bg-black/90 text-white p-5 w-1/2 h-2/3 flex flex-col 
					justify-center items-center shadow-2xl'>
				{props.children}
			</div>
		</div>
	)
}
