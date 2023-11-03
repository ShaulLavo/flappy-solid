import { Show, createSignal } from 'solid-js'
import './App.css'
import { Background, Foreground } from './components/ScrollingLayer'
import { SettingsMenu } from './components/SettingsMenu'
import useWindowSize from './hooks/useWindowSize'
import { getBrowserName, numberToPixels } from './services/utils'
import { Modal } from './components/UI/Modal'
import Button from './components/UI/Button'

function App() {
	const { scaleX, scaleY, baseWidth, baseHeight, width, height } =
		useWindowSize()

	const [isModalOpen, setIsModalOpen] = createSignal(false)

	const toggleModal = () => setIsModalOpen(!isModalOpen())

	return (
		<div>
			<div class="absolute left-0 top-0 z-20">
				<Button
					text={isModalOpen() ? 'Close Settings' : 'Open Settings'}
					onClick={toggleModal}
				/>
			</div>
			<div class="fixed inset-0 z-10 flex justify-center items-center">
				<div class="p-5 w-1/2 h-1/2 flex flex-col justify-center items-center text-xl">
					{getBrowserName()}
					{getBrowserName() === 'Firefox' ? ' Main Thread' : ' Worker Thread'}
				</div>
			</div>
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
				{/* <Foreground /> */}
			</main>
		</div>
	)
}
export default App
