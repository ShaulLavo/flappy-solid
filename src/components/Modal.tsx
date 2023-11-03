import { JSX } from 'solid-js/jsx-runtime'

export function Modal(props: { children: JSX.Element }) {
	return (
		<div
			style={{
				position: 'fixed',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: '50%',
				height: '50%',
				background: 'white',
				'z-index': '1000',
				padding: '20px',
				'box-sizing': 'border-box',
				display: 'flex',
				'flex-direction': 'column',
				'justify-content': 'center',
				'align-items': 'center',
				'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
			}}
		>
			{props.children}
		</div>
	)
}
