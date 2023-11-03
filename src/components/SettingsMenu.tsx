import {
	setShouldUseWorker,
	setSpeed,
	shouldUseWorker,
	speed,
} from '../globals.ts'

export function SettingsMenu() {
	return (
		<>
			<h2>Settings</h2>
			<div>
				<label>
					Web Worker:
					<button onClick={() => setShouldUseWorker(!shouldUseWorker())}>
						{shouldUseWorker() ? 'ON' : 'OFF'}
					</button>
				</label>
			</div>
			<div>
				<label>
					Speed: {speed()}
					<input
						type="range"
						min="0.1"
						max="5"
						step="0.1"
						value={speed()}
						onInput={e => setSpeed(e.currentTarget.valueAsNumber)}
					/>
				</label>
			</div>
			{/* We'll need a method to close the modal, which should also be globally accessible */}
		</>
	)
}
