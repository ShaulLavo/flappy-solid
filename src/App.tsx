import { Show, createSignal } from 'solid-js'
import { Background, Foreground } from './components/ScrollingLayer'
import { SettingsMenu } from './components/SettingsMenu'
import useWindowSize from './hooks/useWindowSize'
import { getBrowserName, numberToPixels } from './services/utils'
import { Modal } from './components/UI/Modal'
import Button from './components/UI/Button'
import { store } from './store'

// BUGS
//TODO scale speed with scaleX
//TODO figure out offset to make images not break

//Features

//TODO add main loop that syncs all workers and make it opt in
//TODO add FPS to info modal with portal maybe?

//TODO add pause state

const playSvg = () => (
	<svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 24 24' fill='white'>
		<polygon points='5 3 19 12 5 21 5 3'></polygon>
	</svg>
)

const pauseSvg = () => (
	<svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 24 24' fill='white'>
		<rect x='6' y='4' width='4' height='16'></rect>
		<rect x='14' y='4' width='4' height='16'></rect>
	</svg>
)

function GameInfoModal() {
	return (
		<div class='fixed top-0 right-0 z-20 p-2'>
			<div class='bg-black bg-opacity-90 text-white p-4  flex flex-col justify-center  shadow-2xl'>
				<div>Browser: {getBrowserName()}</div>
				<div>Thread: {store.shouldUseWorker ? 'Worker' : 'Main'}</div>
			</div>
		</div>
	)
}

function App() {
	const { baseWidth, baseHeight, width, height } = useWindowSize()

	const [isMainMenu, setIsMainMenu] = createSignal(false)
	const [isGameInfo] = createSignal(true)

	const toggleMainMenu = () => setIsMainMenu(!isMainMenu())

	return (
		<div>
			<div class='absolute left-0 top-0 z-20'>
				<Button isPressed={isMainMenu} onClick={toggleMainMenu}>
					{isMainMenu() ? playSvg() : pauseSvg()}
				</Button>
			</div>

			<Show when={isMainMenu()}>
				<Modal>
					<SettingsMenu />
				</Modal>
			</Show>
			<Show when={isGameInfo()}>
				<GameInfoModal />
			</Show>

			<main
				class={'absolute' + (isMainMenu() ? ' blur-sm' : '')}
				style={{
					transform: `scaleX(${store.scaleX}) scaleY(${store.scaleY})`,
					width: numberToPixels(baseWidth()),
					height: numberToPixels(baseHeight()),
					top: numberToPixels((height() - baseHeight()) / 2),
					left: numberToPixels((width() - baseWidth()) / 2) // center the canvas
				}}>
				<Background />
				<Foreground />
			</main>
		</div>
	)
}
export default App
