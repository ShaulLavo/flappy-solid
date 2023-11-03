import { Show, createSignal } from 'solid-js'
import './App.css'
import { Modal } from './components/Modal'
import { Background, Foreground } from './components/ScrollingLayer'
import { SettingsMenu } from './components/SettingsMenu'
import useWindowSize from './hooks/useWindowSize'
import { numberToPixels } from './services/utils'

function App() {
	const { scaleX, scaleY, baseWidth, baseHeight, width, height } =
		useWindowSize()

	const [isModalOpen, setIsModalOpen] = createSignal(false)

	const toggleModal = () => setIsModalOpen(!isModalOpen())
	return (
		<div>
			<button class={'main-menu-btn'} onClick={toggleModal}>
				{isModalOpen() ? 'Close Settings' : 'Open Settings'}
			</button>
			<Show when={isModalOpen()}>
				<Modal>
					<SettingsMenu />
				</Modal>
			</Show>

			<main
				style={{
					transform: `scaleX(${scaleX()}) scaleY(${scaleY()})`,
					width: numberToPixels(baseWidth()),
					height: numberToPixels(baseHeight()),
					position: 'absolute',
					top: numberToPixels((height() - baseHeight()) / 2),
					left: numberToPixels((width() - baseWidth()) / 2), // center the canvas
				}}
			>
				<Background />
				<Foreground />
			</main>
		</div>
	)
}
export default App
